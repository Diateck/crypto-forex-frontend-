import { useState, useEffect, useCallback } from 'react';
import { useBalance } from '../contexts/BalanceContext';
import { useNotifications } from '../contexts/NotificationContext';

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
        if (response.ok) {
          return await response.json();
        }
        throw new Error('Failed to fetch positions');
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
        if (response.ok) {
          return await response.json();
        }
        throw new Error('Failed to fetch history');
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
        if (response.ok) {
          return await response.json();
        }
        throw new Error('Failed to fetch overview');
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
        if (response.ok) {
          return await response.json();
        }
        throw new Error('Failed to fetch market data');
      } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
      }
    }
  };

  // Load trading data from backend
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
  const loadMarketData = useCallback(async () => {
    try {
      const symbols = [
        'BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:BNBUSDT',
        'FX:EURUSD', 'FX:GBPUSD', 'FX:USDJPY',
        'NASDAQ:AAPL', 'NASDAQ:TSLA', 'NASDAQ:GOOGL'
      ];

      const marketResult = await tradingAPI.getMarketData(symbols);
      
      if (marketResult.success) {
        setTradingData(prev => ({
          ...prev,
          marketData: marketResult.data.prices || {},
          lastUpdated: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.warn('Market data update failed:', error);
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

      const result = await response.json();
      
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
        
        return result;
      } else {
        throw new Error(result.message || 'Trade submission failed');
      }
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

      const result = await response.json();
      
      if (result.success) {
        // Add success notification
        addNotification({
          message: result.message || 'Trade closed successfully!',
          type: result.data.pnl >= 0 ? 'success' : 'warning',
          timestamp: new Date().toISOString()
        });

        // Reload trading data and balance
        await loadTradingData();
        
        return result;
      } else {
        throw new Error(result.message || 'Trade closure failed');
      }
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
      loadTradingData();
      loadMarketData();

      // Set up periodic updates
      const tradingInterval = setInterval(loadTradingData, updateInterval);
      const marketInterval = setInterval(loadMarketData, 5000); // Market data every 5 seconds

      return () => {
        clearInterval(tradingInterval);
        clearInterval(marketInterval);
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