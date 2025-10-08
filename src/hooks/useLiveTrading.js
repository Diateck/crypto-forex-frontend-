import { useState, useEffect, useCallback, useRef } from 'react';
import { useBalance } from '../contexts/BalanceContext';
import { useNotifications } from '../contexts/NotificationContext';
import { safeParseResponse } from '../utils/safeResponse.js';
import { nextDelayMs, retryAfterToMs } from '../utils/backoff';

// Backend API base URL
const API_BASE_URL = 'https://crypto-forex-backend-9mme.onrender.com/api';

const useLiveTrading = (userId, updateInterval = 10000) => {
  const [tradingData, setTradingData] = useState({
    activeTrades: [],
    tradeHistory: [],
    tradingStats: {
      todayPnl: 0,
      totalTrades: 0,
      winRate: 0
    },
    marketData: {},
    isLive: false,
    lastUpdated: null,
    error: null
  });

  const [loading, setLoading] = useState(false);
  const { balance, updateBalance } = useBalance();
  const { addNotification } = useNotifications();

  // API functions
  const tradingAPI = {
    getActivePositions: async (userId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/trading/positions/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        return await safeParseResponse(response);
      } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
      }
    },

    getTradingHistory: async (userId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/trading/history/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        return await safeParseResponse(response);
      } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
      }
    },

    getTradingOverview: async (userId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/trading/overview/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        return await safeParseResponse(response);
      } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
      }
    },

    getMarketData: async (symbols) => {
      try {
        const response = await fetch(`${API_BASE_URL}/market/prices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ symbols })
        });
        return await safeParseResponse(response);
      } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
      }
    }
  };

  // Load trading data from backend
  const attemptRef = useRef(0);

  const loadTradingData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const [positionsResult, historyResult, overviewResult] = await Promise.all([
        tradingAPI.getActivePositions(userId),
        tradingAPI.getTradingHistory(userId),
        tradingAPI.getTradingOverview(userId)
      ]);

      let isBackendConnected = false;
      let newTradingData = { ...tradingData };

      // Handle active positions
      if (positionsResult.success) {
        newTradingData.activeTrades = positionsResult.data || [];
        isBackendConnected = true;
      } else {
        // Fallback to localStorage
        const localPositions = JSON.parse(localStorage.getItem('userActiveTrades') || '[]');
        newTradingData.activeTrades = localPositions;
      }

      // Handle trading history
      if (historyResult.success) {
        newTradingData.tradeHistory = historyResult.data || [];
        isBackendConnected = true;
      } else {
        // Fallback to localStorage
        const localHistory = JSON.parse(localStorage.getItem('userTradeHistory') || '[]');
        newTradingData.tradeHistory = localHistory;
      }

      // Handle trading statistics
      if (overviewResult.success && overviewResult.data) {
        const overview = overviewResult.data.overview;
        const today = overviewResult.data.today;
        
        newTradingData.tradingStats = {
          todayPnl: today?.pnl || 0,
          totalTrades: overview?.totalTrades || 0,
          winRate: overview?.winRate || 0
        };
        isBackendConnected = true;
      } else {
        // Calculate stats from local data
        calculateTradingStats(newTradingData.tradeHistory);
      }


      if (isBackendConnected) {
        attemptRef.current = 0;
      } else {
        attemptRef.current++;
      }

      newTradingData.isLive = isBackendConnected;
      newTradingData.lastUpdated = new Date().toISOString();
      newTradingData.error = null;

      setTradingData(newTradingData);

    } catch (error) {
      console.error('Error loading trading data:', error);
      setTradingData(prev => ({
        ...prev,
        error: error.message,
        isLive: false
      }));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load market data
  const marketAttemptRef = useRef(0);

  const loadMarketData = useCallback(async () => {
    try {
      const symbols = [
        'BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:BNBUSDT',
        'FX:EURUSD', 'FX:GBPUSD', 'FX:USDJPY',
        'NASDAQ:AAPL', 'NASDAQ:TSLA', 'NASDAQ:GOOGL'
      ];
      const marketResult = await tradingAPI.getMarketData(symbols);

      if (marketResult.success) {
        marketAttemptRef.current = 0;
        setTradingData(prev => ({
          ...prev,
          marketData: marketResult.data.prices || {},
          lastUpdated: new Date().toISOString()
        }));
        return 5000;
      }

      // handle rate-limit/backoff
      marketAttemptRef.current++;
      if (marketResult.status === 429) {
        const ra = marketResult.retryAfter || null;
        const delay = ra ? Number(ra) : nextDelayMs(marketAttemptRef.current);
        console.warn(`Market data rate-limited. Backing off ${delay}ms.`);
        return delay;
      }

      return nextDelayMs(marketAttemptRef.current);
    } catch (error) {
      console.warn('Market data update failed:', error);
      marketAttemptRef.current++;
      return nextDelayMs(marketAttemptRef.current);
    }
  }, []);

  // Calculate trading statistics from local data
  const calculateTradingStats = (trades) => {
    const today = new Date().toDateString();
    const todayTrades = trades.filter(t => new Date(t.timestamp || t.createdAt).toDateString() === today);
    const completedTrades = trades.filter(t => t.status === 'CLOSED');
    const winningTrades = completedTrades.filter(t => (t.pnl || t.realizedPnl || 0) > 0);
    
    setTradingData(prev => ({
      ...prev,
      tradingStats: {
        todayPnl: todayTrades.reduce((sum, t) => sum + (t.pnl || t.realizedPnl || 0), 0),
        totalTrades: completedTrades.length,
        winRate: completedTrades.length > 0 ? (winningTrades.length / completedTrades.length * 100) : 0
      }
    }));
  };

  // Submit trade
  const submitTrade = async (tradeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trading/submit-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(tradeData)
      });
      const result = await safeParseResponse(response);
      
      if (result.success) {
        // Update balance immediately in context
        updateBalance(balance - tradeData.amount);

        // Add success notification
        addNotification({
          message: result.message || 'Trade executed successfully!',
          type: 'success',
          timestamp: new Date().toISOString()
        });

        // Reload trading data
        await loadTradingData();
        
        return result.data || { success: true };
      }

      throw new Error(result.error || result.message || 'Trade submission failed');
    } catch (error) {
      addNotification({
        message: `Trade failed: ${error.message}`,
        type: 'error',
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  };

  // Close trade
  const closeTrade = async (tradeId, closePrice) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trading/close-position`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ tradeId, closePrice })
      });
      const result = await safeParseResponse(response);

      if (result.success) {
        // Add success notification
        addNotification({
          message: result.data?.message || 'Trade closed successfully!',
          type: result.data?.pnl >= 0 ? 'success' : 'warning',
          timestamp: new Date().toISOString()
        });

        // Reload trading data and balance
        await loadTradingData();
        
        return result.data || { success: true };
      }

      throw new Error(result.error || result.message || 'Trade closure failed');
    } catch (error) {
      addNotification({
        message: `Failed to close trade: ${error.message}`,
        type: 'error',
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  };

  // Initialize and set up intervals
  useEffect(() => {
    if (userId) {
      // backoff-aware scheduling
      let mounted = true;
      let tradingTimeout = null;
      let marketTimeout = null;

      const scheduleTrading = (ms) => {
        if (!mounted) return;
        clearTimeout(tradingTimeout);
        tradingTimeout = setTimeout(async () => {
          await loadTradingData();
          scheduleTrading( updateInterval );
        }, ms);
      };

      const scheduleMarket = (ms) => {
        if (!mounted) return;
        clearTimeout(marketTimeout);
        marketTimeout = setTimeout(async () => {
          const delay = await loadMarketData();
          scheduleMarket(typeof delay === 'number' ? delay : 5000);
        }, ms);
      };

      // start
      loadTradingData().then(() => scheduleTrading(updateInterval));
      loadMarketData().then((delay) => scheduleMarket(typeof delay === 'number' ? delay : 5000));

      return () => {
        mounted = false;
        clearTimeout(tradingTimeout);
        clearTimeout(marketTimeout);
      };
    }
  }, [userId, updateInterval, loadTradingData, loadMarketData]);

  return {
    ...tradingData,
    loading,
    submitTrade,
    closeTrade,
    refreshData: loadTradingData,
    refreshMarketData: loadMarketData
  };
};

export default useLiveTrading;