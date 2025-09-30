import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { useBalance } from '../contexts/BalanceContext';
import { useNotifications } from '../contexts/NotificationContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://crypto-forex-backend-9mme.onrender.com/api';

// Custom hook for real-time copy trading functionality
export const useLiveCopyTrading = () => {
  const { user } = useUser();
  const { updateBalance } = useBalance();
  const { addNotification } = useNotifications();
  
  const [traders, setTraders] = useState([]);
  const [mycopies, setMyCopies] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [tradingHistory, setTradingHistory] = useState([]);
  const [liveStream, setLiveStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [filters, setFilters] = useState({
    platform: 'all',
    minRoi: '',
    maxRisk: '',
    sortBy: 'roi'
  });

  // Fetch top traders with real-time data
  const fetchTopTraders = useCallback(async (filterOptions = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      Object.entries(filterOptions).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/copy-trading/top-traders?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTraders(data.data);
        addNotification?.({
          type: 'success',
          message: `Loaded ${data.data.length} live traders from ${data.platforms.length} platforms`,
          duration: 3000
        });
      } else {
        // Fallback to localStorage/mock data
        const mockTraders = [
          {
            id: 'mock_001',
            platform: 'etoro',
            name: 'CryptoMaster_Live',
            realName: 'Sarah Johnson',
            avatar: '/api/placeholder/150/150',
            verified: true,
            country: 'United Kingdom',
            roi: 287.6,
            monthlyReturn: 22.3,
            weeklyReturn: 5.2,
            dailyReturn: 1.1,
            followers: 12847,
            copiers: 1547,
            winRate: 84.7,
            totalTrades: 1856,
            riskScore: 5.8,
            totalProfit: 145780,
            activePositions: 18,
            description: 'Professional crypto trader specializing in DeFi and altcoins.',
            specializations: ['crypto', 'defi', 'swing-trading'],
            lastTradeTime: new Date(Date.now() - 900000), // 15 min ago
            status: 'online',
            isLive: false // Indicates this is fallback data
          }
        ];
        setTraders(mockTraders);
        setError('Using offline mode - connect to see live trader data');
      }
    } catch (err) {
      console.error('Error fetching traders:', err);
      setError(err.message);
      
      // Fallback data on error
      const fallbackTraders = JSON.parse(localStorage.getItem('copyTradingTraders') || '[]');
      setTraders(fallbackTraders);
      
      addNotification?.({
        type: 'warning',
        message: 'Using cached trader data - check your connection',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }, [filters, addNotification]);

  // Fetch user's copied traders
  const fetchMyCopies = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/copy-trading/my-copies/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMyCopies(data.data);
        
        // Update balance context with copy trading performance
        if (data.summary && updateBalance) {
          updateBalance('copyTradingProfit', data.summary.totalProfit);
          updateBalance('copyTradingInvested', data.summary.totalInvested);
        }
      } else {
        // Fallback to localStorage
        const savedCopies = JSON.parse(localStorage.getItem(`myCopies_${user.id}`) || '[]');
        setMyCopies(savedCopies);
      }
    } catch (err) {
      console.error('Error fetching my copies:', err);
      const fallbackCopies = JSON.parse(localStorage.getItem(`myCopies_${user.id}`) || '[]');
      setMyCopies(fallbackCopies);
    }
  }, [user?.id, updateBalance]);

  // Fetch available platforms
  const fetchPlatforms = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/copy-trading/platforms`);
      const data = await response.json();
      
      if (data.success) {
        setPlatforms(data.data);
      }
    } catch (err) {
      console.error('Error fetching platforms:', err);
      // Fallback platforms
      setPlatforms([
        { id: 'etoro', name: 'eToro', traderCount: 15000 },
        { id: 'zulutrade', name: 'ZuluTrade', traderCount: 8500 },
        { id: 'myfxbook', name: 'MyFXBook', traderCount: 12000 }
      ]);
    }
  }, []);

  // Copy a trader
  const copyTrader = useCallback(async (traderId, amount, riskLevel) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/copy-trading/copy-trader`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          traderId,
          amount: parseFloat(amount),
          riskLevel,
          userId: user.id
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to copy trader');
      }
      
      if (data.success) {
        // Refresh my copies
        await fetchMyCopies();
        
        // Update balance
        if (updateBalance) {
          updateBalance('balance', -parseFloat(amount));
          updateBalance('copyTradingInvested', parseFloat(amount));
        }
        
        // Save to localStorage as backup
        const savedCopies = JSON.parse(localStorage.getItem(`myCopies_${user.id}`) || '[]');
        savedCopies.push(data.data);
        localStorage.setItem(`myCopies_${user.id}`, JSON.stringify(savedCopies));
        
        addNotification?.({
          type: 'success',
          message: data.message,
          duration: 5000
        });
        
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error copying trader:', err);
      addNotification?.({
        type: 'error',
        message: err.message,
        duration: 5000
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id, updateBalance, addNotification, fetchMyCopies]);

  // Stop copying a trader
  const stopCopyTrader = useCallback(async (copyId, closePositions = true) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/copy-trading/stop-copy/${copyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ closePositions }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh my copies
        await fetchMyCopies();
        
        addNotification?.({
          type: 'success',
          message: data.message,
          duration: 5000
        });
        
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error stopping copy:', err);
      addNotification?.({
        type: 'error',
        message: err.message,
        duration: 5000
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addNotification, fetchMyCopies]);

  // Get trader details with live data
  const getTraderDetails = useCallback(async (traderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/copy-trading/trader/${traderId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error fetching trader details:', err);
      throw err;
    }
  }, []);

  // Get trader's live activity
  const getTraderActivity = useCallback(async (traderId, limit = 20) => {
    try {
      const response = await fetch(`${API_BASE_URL}/copy-trading/trader/${traderId}/activity?limit=${limit}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error fetching trader activity:', err);
      throw err;
    }
  }, []);

  // Fetch performance data
  const fetchPerformanceData = useCallback(async (period = '30d') => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/copy-trading/performance/${user.id}?period=${period}`);
      const data = await response.json();
      
      if (data.success) {
        setPerformanceData(data.data);
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error fetching performance data:', err);
      // Fallback performance data
      const fallbackData = {
        period,
        metrics: {
          totalProfit: mycopies.reduce((sum, copy) => sum + (copy.totalProfit || 0), 0),
          totalInvested: mycopies.reduce((sum, copy) => sum + (copy.amount || 0), 0),
          totalReturn: mycopies.reduce((sum, copy) => sum + (copy.totalProfit || 0), 0),
          totalReturnPercent: 0,
          averageReturn: 0,
          activeCopies: mycopies.filter(copy => copy.status === 'active').length
        },
        performanceChart: [],
        summary: { period, totalDays: 30 }
      };
      setPerformanceData(fallbackData);
      return fallbackData;
    }
  }, [user?.id, mycopies]);

  // Fetch trading history
  const fetchTradingHistory = useCallback(async (limit = 50, offset = 0) => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/copy-trading/history/${user.id}?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      
      if (data.success) {
        setTradingHistory(data.data);
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error fetching trading history:', err);
      setTradingHistory([]);
      return [];
    }
  }, [user?.id]);

  // Setup real-time WebSocket connection
  const connectLiveStream = useCallback(() => {
    if (!user?.id || liveStream) return;
    
    try {
      const eventSource = new EventSource(`${API_BASE_URL}/copy-trading/live-stream/${user.id}`);
      
      eventSource.onopen = () => {
        setConnected(true);
        addNotification?.({
          type: 'success',
          message: 'Connected to live trading stream',
          duration: 3000
        });
      };
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'traders_update') {
            // Update traders with live data
            setTraders(prevTraders => 
              prevTraders.map(trader => {
                const liveUpdate = data.data.find(update => update.id === trader.id);
                return liveUpdate ? { ...trader, ...liveUpdate, isLive: true } : trader;
              })
            );
          }
        } catch (err) {
          console.error('Error parsing live stream data:', err);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('Live stream error:', error);
        setConnected(false);
        eventSource.close();
        setLiveStream(null);
      };
      
      setLiveStream(eventSource);
    } catch (err) {
      console.error('Error connecting to live stream:', err);
      setConnected(false);
    }
  }, [user?.id, liveStream, addNotification]);

  // Disconnect live stream
  const disconnectLiveStream = useCallback(() => {
    if (liveStream) {
      liveStream.close();
      setLiveStream(null);
      setConnected(false);
    }
  }, [liveStream]);

  // Apply filters
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchTopTraders({ ...filters, ...newFilters });
  }, [filters, fetchTopTraders]);

  // Initialize data on mount
  useEffect(() => {
    fetchTopTraders();
    fetchPlatforms();
    if (user?.id) {
      fetchMyCopies();
      fetchPerformanceData();
      fetchTradingHistory();
    }
  }, [user?.id]);

  // Setup live stream when user is available
  useEffect(() => {
    if (user?.id) {
      connectLiveStream();
    }
    
    return () => {
      disconnectLiveStream();
    };
  }, [user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectLiveStream();
    };
  }, [disconnectLiveStream]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTopTraders();
      if (user?.id) {
        fetchMyCopies();
        fetchPerformanceData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchTopTraders, fetchMyCopies, fetchPerformanceData, user?.id]);

  return {
    // Data
    traders,
    mycopies,
    platforms,
    performanceData,
    tradingHistory,
    
    // State
    loading,
    error,
    connected,
    filters,
    
    // Actions
    copyTrader,
    stopCopyTrader,
    getTraderDetails,
    getTraderActivity,
    fetchPerformanceData,
    fetchTradingHistory,
    applyFilters,
    refreshData: () => {
      fetchTopTraders();
      fetchMyCopies();
      fetchPerformanceData();
      fetchTradingHistory();
    },
    
    // Live stream controls
    connectLiveStream,
    disconnectLiveStream,
    
    // Utils
    isLive: connected && liveStream !== null
  };
};

export default useLiveCopyTrading;