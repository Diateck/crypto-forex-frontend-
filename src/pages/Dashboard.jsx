import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Typography, Box, Grid, Card, useTheme, Avatar, Button, Stack, Chip, CircularProgress, Alert, Badge, LinearProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import OutboxIcon from '@mui/icons-material/Outbox';
import HistoryIcon from '@mui/icons-material/History';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PendingIcon from '@mui/icons-material/Pending';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useUser } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useBalance } from '../contexts/BalanceContext';
import { marketAPI } from '../services/api';
import useLiveDashboard from '../hooks/useLiveDashboard';
import useLiveCopyTrading from '../hooks/useLiveCopyTrading';
import ContactModal from '../components/ContactModal';

// Backend API base URL - Use live deployed backend
const BACKEND_URL = 'https://crypto-forex-backend-9mme.onrender.com/api';

// Backend API functions
const dashboardAPI = {
  getOverview: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/dashboard/overview`);
      if (!response.ok) throw new Error('Failed to fetch overview');
      return await response.json();
    } catch (error) {
      console.error('Dashboard overview API error:', error);
      return { success: false, error: error.message };
    }
  },
  getBalance: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/dashboard/balance`);
      if (!response.ok) throw new Error('Failed to fetch balance');
      return await response.json();
    } catch (error) {
      console.error('Dashboard balance API error:', error);
      return { success: false, error: error.message };
    }
  },
  getKYCStatus: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/dashboard/kyc-status`);
      if (!response.ok) throw new Error('Failed to fetch KYC status');
      return await response.json();
    } catch (error) {
      console.error('Dashboard KYC API error:', error);
      return { success: false, error: error.message };
    }
  },
  getTradingOverview: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/dashboard/trading-overview`);
      if (!response.ok) throw new Error('Failed to fetch trading overview');
      return await response.json();
    } catch (error) {
      console.error('Dashboard trading API error:', error);
      return { success: false, error: error.message };
    }
  },
  getStats: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/dashboard/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Dashboard stats API error:', error);
      return { success: false, error: error.message };
    }
  },
  getNotifications: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/dashboard/notifications`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch (error) {
      console.error('Dashboard notifications API error:', error);
      return { success: false, error: error.message };
    }
  }
};

export default function Dashboard() {
  const theme = useTheme();
  const { user, userStats, loading, error, backendStatus } = useUser();
  const { balance, refreshBalance } = useBalance();
  
  // Copy Trading Integration
  const { 
    mycopies, 
    performanceData, 
    loading: copyTradingLoading, 
    connected: copyTradingConnected 
  } = useLiveCopyTrading();
  
  // Backend data state
  const [backendData, setBackendData] = useState({
    overview: null,
    balance: null,
    kycStatus: null,
    tradingOverview: null,
    stats: null,
    notifications: []
  });
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  
  // Contact Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  
  // Use new notification system
  const { addNotification } = useNotifications();
  
  // Load backend data on component mount
  useEffect(() => {
    loadBackendData();
    // Refresh backend data every 30 seconds
    const interval = setInterval(loadBackendData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const loadBackendData = async () => {
    try {
      setBackendLoading(true);
      setBackendError(null);
      
      // Fetch all dashboard data from backend
      const [overviewResult, balanceResult, kycResult, tradingResult, statsResult, notificationsResult] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getBalance(),
        dashboardAPI.getKYCStatus(),
        dashboardAPI.getTradingOverview(),
        dashboardAPI.getStats(),
        dashboardAPI.getNotifications()
      ]);
      
      // Check if any requests succeeded
      const hasSuccessfulResponse = [overviewResult, balanceResult, kycResult, tradingResult, statsResult, notificationsResult]
        .some(result => result && result.success);
      
      if (hasSuccessfulResponse) {
        setBackendConnected(true);
        setBackendData({
          overview: overviewResult.success ? overviewResult.data : null,
          balance: balanceResult.success ? balanceResult.data : null,
          kycStatus: kycResult.success ? kycResult.data : null,
          tradingOverview: tradingResult.success ? tradingResult.data : null,
          stats: statsResult.success ? statsResult.data : null,
          notifications: notificationsResult.success ? notificationsResult.data.notifications : []
        });
      } else {
        setBackendConnected(false);
        setBackendError('Unable to connect to backend server. Using demo data.');
      }
    } catch (error) {
      setBackendConnected(false);
      setBackendError(`Backend connection failed: ${error.message}`);
      console.error('Backend data loading error:', error);
    } finally {
      setBackendLoading(false);
    }
  };

  // Live Dashboard Hook for real-time updates
  const {
    dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refreshDashboardData,
    updateBalance,
    updateBonus,
    updateTrading,
    updateKYC
  } = useLiveDashboard(user?.id, 15000); // Update every 15 seconds

  // Helper functions for KYC status display
  const getKYCStatusLabel = (kycStatus) => {
    switch (kycStatus) {
      case 'verified':
      case 'approved':
        return 'KYC Verified';
      case 'pending':
      case 'submitted':
        return 'KYC Pending';
      case 'rejected':
        return 'KYC Rejected';
      default:
        return 'KYC Unverified';
    }
  };

  const getKYCStatusColor = (kycStatus) => {
    switch (kycStatus) {
      case 'verified':
      case 'approved':
        return 'success';
      case 'pending':
      case 'submitted':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAccountStatusValue = (accountStatus) => {
    switch (accountStatus) {
      case 'VERIFIED':
        return 'VERIFIED';
      case 'PENDING':
        return 'PENDING';
      case 'REJECTED':
        return 'REJECTED';
      default:
        return 'UNVERIFIED';
    }
  };

  const getAccountStatusChip = (accountStatus) => {
    switch (accountStatus) {
      case 'VERIFIED':
        return { label: 'VERIFIED', color: 'success' };
      case 'PENDING':
        return { label: 'PENDING', color: 'warning' };
      case 'REJECTED':
        return { label: 'REJECTED', color: 'error' };
      default:
        return { label: 'UNVERIFIED', color: 'default' };
    }
  };
  
  // Market data state
  const [tickerData, setTickerData] = useState([
    { label: 'Nasdaq 100', value: '24,344.8', change: '+98.90 (+0.41%)', color: 'green' },
    { label: 'EUR/USD', value: '1.18099', change: '-0.00059 (-0.05%)', color: 'red' },
    { label: 'BTC/USD', value: '116,747', change: '+270.00 (+0.23%)', color: 'green' },
    { label: 'ETH/USD', value: '4,620.8', change: '+28.50', color: 'green' }
  ]);
  const [marketData, setMarketData] = useState([]);

  // Load market data with better error handling
  useEffect(() => {
    const loadMarketData = async () => {
      try {
        // Only try to load if we don't have fallback data
        if (backendStatus === 'connected') {
          const [tickerResponse, chartResponse] = await Promise.all([
            marketAPI.getTickerData().catch(() => ({ success: false, data: [] })),
            marketAPI.getChartData().catch(() => ({ success: false, data: [] }))
          ]);
          
          // Handle API response format (success/fallback)
          if (tickerResponse.success && Array.isArray(tickerResponse.data) && tickerResponse.data.length > 0) {
            const formattedTicker = tickerResponse.data.map(item => ({
              label: item.symbol || item.label,
              value: item.price ? `$${item.price.toLocaleString()}` : item.value,
              change: item.changePercent ? `${item.change > 0 ? '+' : ''}${item.change} (${item.changePercent > 0 ? '+' : ''}${item.changePercent}%)` : item.change,
              color: item.changePercent >= 0 ? 'green' : 'red'
            }));
            setTickerData(formattedTicker);
          }
          
          if (chartResponse.success && Array.isArray(chartResponse.data)) {
            setMarketData(chartResponse.data);
          }
        }
      } catch (error) {
        console.warn('Error loading market data, using fallback:', error);
        // Keep the fallback data that's already set
      }
    };

    // Load market data only if backend is available
    if (backendStatus === 'connected') {
      loadMarketData();
      // Set up interval for live updates only if backend is connected
      const interval = setInterval(loadMarketData, 30000);
      return () => clearInterval(interval);
    }
  }, [backendStatus]);

  // Dynamic card data - prioritize backend data over local data
  const cardGradient = 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)';
  
  // Determine data source and current stats
  const hasBackendData = backendConnected && backendData.overview;
  const dataSource = hasBackendData ? 'backend' : 'local';
  
  // Use backend data when available, fallback to userStats, then fallback data
  const fallbackStats = {
    totalBalance: 0,
    profit: 0,
    totalBonus: 0,
    accountStatus: 'UNVERIFIED',
    totalTrades: 0,
    openTrades: 0,
    closedTrades: 0,
    winLossRatio: 0
  };

  // Priority: Backend Data → Live Dashboard Data → UserStats → Fallback Data
  let currentStats;
  if (hasBackendData) {
    // Use backend data
    currentStats = {
      totalBalance: backendData.balance?.totalBalance || backendData.overview?.totalBalance || 0,
      profit: backendData.overview?.totalProfit || 0,
      totalBonus: backendData.overview?.totalBonus || 0,
      accountStatus: backendData.overview?.accountStatus || backendData.kycStatus?.kycStatus || 'UNVERIFIED',
      totalTrades: backendData.tradingOverview?.totalTrades || 0,
      openTrades: backendData.tradingOverview?.activeTrades || 0,
      closedTrades: backendData.tradingOverview?.totalTrades - backendData.tradingOverview?.activeTrades || 0,
      winLossRatio: backendData.tradingOverview?.winRate ? backendData.tradingOverview.winRate / 100 : 0
    };
  } else if (dashboardData.isLive) {
    currentStats = dashboardData;
  } else {
    currentStats = userStats || fallbackStats;
  }
  
  const topCards = [
    { 
      label: 'Total Balance', 
      value: `$${currentStats.totalBalance?.toLocaleString() || '0.00'}`, 
      icon: <AccountBalanceWalletIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />, 
      gradient: cardGradient,
      isLive: hasBackendData || dashboardData.isLive,
      dataSource: dataSource,
      refreshAction: hasBackendData ? loadBackendData : updateBalance,
      isPending: hasBackendData ? false : (dashboardData.pendingActions?.depositsAwaitingApproval > 0),
      pendingText: hasBackendData ? null : (dashboardData.pendingActions?.depositsAwaitingApproval > 0 ? 
        `${dashboardData.pendingActions.depositsAwaitingApproval} deposit(s) pending admin approval` : null),
      adminControlled: true
    },
    { 
      label: 'Profit', 
      value: `$${currentStats.profit?.toLocaleString() || '0.00'}`, 
      icon: <ShowChartIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />, 
      gradient: cardGradient,
      isLive: hasBackendData || dashboardData.isLive,
      dataSource: dataSource,
      refreshAction: hasBackendData ? loadBackendData : updateTrading,
      adminControlled: false
    },
    { 
      label: 'Total Bonus', 
      value: `$${currentStats.totalBonus?.toLocaleString() || '0.00'}`, 
      icon: <GroupIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />, 
      gradient: cardGradient,
      isLive: hasBackendData || dashboardData.isLive,
      dataSource: dataSource,
      refreshAction: hasBackendData ? loadBackendData : updateBonus,
      adminControlled: true
    },
    { 
      label: 'Account Status', 
      value: getAccountStatusValue(currentStats.accountStatus || 'UNVERIFIED'), 
      icon: <VerifiedUserIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />, 
      gradient: cardGradient, 
      chip: true,
      chipData: getAccountStatusChip(currentStats.accountStatus || 'UNVERIFIED'),
      isLive: hasBackendData || dashboardData.isLive,
      dataSource: dataSource,
      refreshAction: hasBackendData ? loadBackendData : updateKYC,
      isPending: hasBackendData ? (backendData.kycStatus?.kycStatus === 'pending') : dashboardData.pendingActions?.kycAwaitingApproval,
      pendingText: hasBackendData ? 
        (backendData.kycStatus?.kycStatus === 'pending' ? 'KYC verification in progress' : null) :
        (dashboardData.pendingActions?.kycAwaitingApproval ? 'KYC documents pending admin approval' : null),
      adminControlled: true
    },
  ];

  const bottomCards = [
    { 
      label: 'Total Trades', 
      value: currentStats.totalTrades?.toString() || '0', 
      icon: <ShowChartIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />, 
      gradient: cardGradient,
      isLive: hasBackendData || dashboardData.isLive,
      dataSource: dataSource,
      refreshAction: hasBackendData ? loadBackendData : updateTrading,
      adminControlled: false
    },
    { 
      label: 'Open Trades', 
      value: currentStats.openTrades?.toString() || '0', 
      icon: <FolderOpenIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />, 
      gradient: cardGradient,
      isLive: hasBackendData || dashboardData.isLive,
      dataSource: dataSource,
      refreshAction: hasBackendData ? loadBackendData : updateTrading,
      adminControlled: false
    },
    { 
      label: 'Closed Trades', 
      value: currentStats.closedTrades?.toString() || '0', 
      icon: <HistoryIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />, 
      gradient: cardGradient,
      isLive: hasBackendData || dashboardData.isLive,
      dataSource: dataSource,
      refreshAction: hasBackendData ? loadBackendData : updateTrading,
      adminControlled: false
    },
    { 
      label: 'Win/Loss Ratio', 
      value: currentStats.winLossRatio ? `${(currentStats.winLossRatio * 100).toFixed(1)}%` : '0%', 
      icon: <EmojiEventsIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />, 
      gradient: cardGradient,
      isLive: hasBackendData || dashboardData.isLive,
      dataSource: dataSource,
      refreshAction: hasBackendData ? loadBackendData : updateTrading,
      adminControlled: false
    },
  ];
  // List of crypto pairs for selection
  const cryptoPairs = [
    { label: 'BTC/USDT', value: 'BINANCE:BTCUSDT' },
    { label: 'ETH/USDT', value: 'BINANCE:ETHUSDT' },
    { label: 'BNB/USDT', value: 'BINANCE:BNBUSDT' },
    { label: 'SOL/USDT', value: 'BINANCE:SOLUSDT' },
    { label: 'XRP/USDT', value: 'BINANCE:XRPUSDT' },
    { label: 'DOGE/USDT', value: 'BINANCE:DOGEUSDT' },
    { label: 'ADA/USDT', value: 'BINANCE:ADAUSDT' },
  ];

  const [selectedPair, setSelectedPair] = useState(cryptoPairs[0].value);
  const [selectedForex, setSelectedForex] = useState('OANDA:EURUSD');
  const [selectedStock, setSelectedStock] = useState('NASDAQ:AAPL');
  const [chartWidth, setChartWidth] = useState(900);
  const isResizing = useRef(false);

  const handleMouseDown = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
  }, []);
  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    if (typeof document !== 'undefined') {
      document.body.style.cursor = '';
    }
  }, []);
  
  const handleMouseMove = useCallback((e) => {
    if (isResizing.current && typeof window !== 'undefined') {
      const newWidth = Math.max(300, Math.min(window.innerWidth, e.clientX - 50));
      setChartWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseUp]);

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, 
      minHeight: '100vh',
      bgcolor: theme.palette.background.default
    }}>
      {/* Subtle loading indicator - only show when backend is connecting */}
      {(loading || backendLoading) && (
        <LinearProgress 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 9999,
            height: 3,
            '& .MuiLinearProgress-bar': {
              backgroundColor: backendLoading ? '#4CAF50' : '#2196F3'
            },
            '& .MuiLinearProgress-root': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }} 
        />
      )}

      {/* Error State */}
      {(error || backendError) && (
        <Box sx={{ mb: 2, mt: (loading || backendLoading) ? 1 : 0 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          {backendError && (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 1,
                '& .MuiAlert-message': {
                  fontSize: '0.875rem'
                }
              }}
            >
              <strong>Backend Status:</strong> {backendError}
            </Alert>
          )}
        </Box>
      )}

      {/* Main Content - Always show, don't hide during loading */}
      <>
        {/* Header with site name, username and quick actions */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 2, 
            bgcolor: '#232742', 
            p: { xs: 1.5, sm: 2, md: 2.5 }, 
            borderRadius: 3, 
            boxShadow: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 2, md: 0 },
            minHeight: { xs: 'auto', sm: 80 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, sm: 1.5, md: 2 },
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                width: { xs: 36, sm: 42, md: 48 }, 
                height: { xs: 36, sm: 42, md: 48 },
                flexShrink: 0
              }}>
                <PersonIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem' } }} />
              </Avatar>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography 
                  variant="h5"
                  fontWeight={900} 
                  color={theme.palette.primary.main}
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  Elon Investment Broker
                  {/* Subtle connection status indicator */}
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: backendConnected ? '#4CAF50' : '#FF9800',
                      ml: 1,
                      animation: backendLoading ? 'pulse 1.5s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { opacity: 0.6 },
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0.6 }
                      }
                    }}
                    title={backendConnected ? 'Connected to backend' : 'Backend offline'}
                  />
                </Typography>
                <Typography 
                  variant="h6"
                  fontWeight={700} 
                  color="#fff"
                  sx={{ 
                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.25rem' },
                    lineHeight: 1.2,
                    mt: 0.25
                  }}
                >
                  Username: <span style={{ color: theme.palette.primary.main }}>{user?.username || 'theophilus'}</span>
                </Typography>
              </Box>
            </Box>
            <Stack 
              direction={{ xs: 'row', sm: 'row' }} 
              spacing={{ xs: 1, sm: 1.5, md: 2 }} 
              alignItems="center"
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'center', sm: 'flex-end' },
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 1.5 }
              }}
            >
              <Chip 
                icon={<VerifiedUserIcon />} 
                label={getKYCStatusLabel(user?.kycStatus)} 
                color={getKYCStatusColor(user?.kycStatus)} 
                variant="outlined" 
                size="small"
                sx={{ 
                  height: { xs: 28, sm: 32 },
                  fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }
                }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EmailIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
                size="small"
                onClick={() => setContactModalOpen(true)}
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  height: { xs: 32, sm: 36 },
                  px: { xs: 1.5, sm: 2, md: 3 },
                  fontWeight: 600,
                  minWidth: { xs: 'auto', sm: 80 },
                  whiteSpace: 'nowrap'
                }}
              >
                Mail Us
              </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<SettingsIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
            size="small"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 32, sm: 36 },
              px: { xs: 1.5, sm: 2, md: 3 },
              fontWeight: 600,
              minWidth: { xs: 'auto', sm: 80 },
              whiteSpace: 'nowrap'
            }}
          >
            Settings
          </Button>
        </Stack>
      </Box>

      {/* Ticker Bar */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 1.5, sm: 2, md: 3 }, 
        bgcolor: '#181A20', 
        p: { xs: 1, sm: 1.5 }, 
        borderRadius: 2, 
        mb: 3, 
        overflowX: 'auto', 
        boxShadow: 1,
        '&::-webkit-scrollbar': { 
          height: { xs: 4, sm: 6 }
        },
        '&::-webkit-scrollbar-track': { 
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: 2
        },
        '&::-webkit-scrollbar-thumb': { 
          bgcolor: 'primary.main', 
          borderRadius: 2,
          '&:hover': {
            bgcolor: 'primary.dark'
          }
        },
        scrollbarWidth: 'thin',
        scrollbarColor: 'primary.main rgba(255,255,255,0.1)'
      }}>
        {tickerData.map((item, idx) => (
          <Box 
            key={idx} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 1 },
              minWidth: { xs: 140, sm: 160, md: 180 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' },
              py: { xs: 0.5, sm: 0 },
              px: { xs: 1, sm: 0 }
            }}
          >
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              fontWeight={600}
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8125rem' } }}
            >
              {item.label}
            </Typography>
            <Typography 
              variant="body1" 
              color="#fff" 
              fontWeight={700}
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' } }}
            >
              {item.value}
            </Typography>
            <Typography 
              variant="body2" 
              color={item.color} 
              fontWeight={700}
              sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}
            >
              {item.change}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Dashboard Cards - Top Row */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 0.5 }}>
        {topCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 6,
                background: card.gradient,
                color: '#fff',
                minHeight: { xs: 110, sm: 120, md: 130 },
                display: 'flex',
                alignItems: 'center',
                px: { xs: 2, sm: 2.5, md: 3 },
                py: { xs: 2, sm: 2.5, md: 3 },
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-2px)' },
                  boxShadow: { xs: 6, sm: 8 }
                }
              }}
            >
              <Box sx={{ 
                mr: { xs: 1.5, sm: 2, md: 2.5 },
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {card.icon}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="h6"
                  fontWeight={700} 
                  sx={{ 
                    color: '#fff',
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                    lineHeight: 1.2,
                    mb: 0.5
                  }}
                >
                  {card.value}
                </Typography>
                <Typography 
                  variant="subtitle2"
                  fontWeight={500} 
                  sx={{ 
                    color: '#fff', 
                    opacity: 0.9,
                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' },
                    lineHeight: 1.2
                  }}
                >
                  {card.label}
                </Typography>
                {card.chip && (
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={card.chipData ? card.chipData.label : card.value} 
                      color={card.chipData ? card.chipData.color : 'default'} 
                      size="small" 
                      sx={{ 
                        bgcolor: card.chipData?.color === 'success' ? '#4caf50' : 
                                card.chipData?.color === 'warning' ? '#ff9800' : 
                                card.chipData?.color === 'error' ? '#f44336' : '#fff', 
                        color: card.chipData?.color === 'default' ? '#f5576c' : '#fff', 
                        fontWeight: 700,
                        height: { xs: 22, sm: 24 },
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        '& .MuiChip-label': {
                          px: { xs: 1, sm: 1.5 }
                        }
                      }} 
                    />
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dashboard Cards - Bottom Row */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
        {bottomCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 6,
                background: card.gradient,
                color: '#fff',
                minHeight: { xs: 110, sm: 120, md: 130 },
                display: 'flex',
                alignItems: 'center',
                px: { xs: 2, sm: 2.5, md: 3 },
                py: { xs: 2, sm: 2.5, md: 3 },
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-2px)' },
                  boxShadow: { xs: 6, sm: 8 }
                }
              }}
            >
              <Box sx={{ 
                mr: { xs: 1.5, sm: 2, md: 2.5 },
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {card.icon}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="h6"
                  fontWeight={700} 
                  sx={{ 
                    color: '#fff',
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                    lineHeight: 1.2,
                    mb: 0.5
                  }}
                >
                  {card.value}
                </Typography>
                <Typography 
                  variant="subtitle2"
                  fontWeight={500} 
                  sx={{ 
                    color: '#fff', 
                    opacity: 0.9,
                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' },
                    lineHeight: 1.2
                  }}
                >
                  {card.label}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Copy Trading Integration Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
        {/* Copy Trading Summary Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 6,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              minHeight: { xs: 110, sm: 120, md: 130 },
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 2, sm: 2.5, md: 3 },
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: { xs: 'none', sm: 'translateY(-2px)' },
                boxShadow: { xs: 6, sm: 8 }
              }
            }}
          >
            <Box sx={{ 
              mr: { xs: 1.5, sm: 2, md: 2.5 },
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ContentCopyIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h6"
                fontWeight={700} 
                sx={{ 
                  color: '#fff',
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                  lineHeight: 1.2,
                  mb: 0.5
                }}
              >
                {mycopies?.length || 0}
              </Typography>
              <Typography 
                variant="subtitle2"
                fontWeight={500} 
                sx={{ 
                  color: '#fff', 
                  opacity: 0.9,
                  fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' },
                  lineHeight: 1.2
                }}
              >
                Copy Trading
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  {copyTradingConnected ? 'Connected' : 'Connecting'}
                </Typography>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: copyTradingConnected ? '#4caf50' : '#ff9800',
                    ml: 1,
                    animation: copyTradingLoading ? 'pulse 1.5s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.6 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.6 }
                    }
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ 
              position: 'absolute', 
              top: -20, 
              right: -20, 
              width: '80px', 
              height: '80px', 
              opacity: 0.1,
              transform: 'rotate(15deg)'
            }}>
              <TrendingUpIcon sx={{ fontSize: 60 }} />
            </Box>
          </Card>
        </Grid>

        {/* Copy Trading Performance Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 6,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff',
              minHeight: { xs: 110, sm: 120, md: 130 },
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 2, sm: 2.5, md: 3 },
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: { xs: 'none', sm: 'translateY(-2px)' },
                boxShadow: { xs: 6, sm: 8 }
              }
            }}
          >
            <Box sx={{ 
              mr: { xs: 1.5, sm: 2, md: 2.5 },
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUpIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {performanceData && !copyTradingLoading ? (
                <>
                  <Typography 
                    variant="h6"
                    fontWeight={700} 
                    sx={{ 
                      color: performanceData.totalProfit >= 0 ? '#4caf50' : '#fff',
                      fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                      lineHeight: 1.2,
                      mb: 0.5
                    }}
                  >
                    ${performanceData.totalProfit?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography 
                    variant="subtitle2"
                    fontWeight={500} 
                    sx={{ 
                      color: '#fff', 
                      opacity: 0.9,
                      fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' },
                      lineHeight: 1.2
                    }}
                  >
                    Total P&L
                  </Typography>
                </>
              ) : (
                <>
                  <Typography 
                    variant="h6"
                    fontWeight={700} 
                    sx={{ 
                      color: '#fff',
                      fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                      lineHeight: 1.2,
                      mb: 0.5
                    }}
                  >
                    $0.00
                  </Typography>
                  <Typography 
                    variant="subtitle2"
                    fontWeight={500} 
                    sx={{ 
                      color: '#fff', 
                      opacity: 0.9,
                      fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' },
                      lineHeight: 1.2
                    }}
                  >
                    Performance
                  </Typography>
                </>
              )}
            </Box>
            
            <Box sx={{ 
              position: 'absolute', 
              top: -20, 
              right: -20, 
              width: '80px', 
              height: '80px', 
              opacity: 0.1,
              transform: 'rotate(-15deg)'
            }}>
              <ContentCopyIcon sx={{ fontSize: 60 }} />
            </Box>
          </Card>
        </Grid>

        {/* Copy Trading Win Rate Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 6,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: '#fff',
              minHeight: { xs: 110, sm: 120, md: 130 },
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 2, sm: 2.5, md: 3 },
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: { xs: 'none', sm: 'translateY(-2px)' },
                boxShadow: { xs: 6, sm: 8 }
              }
            }}
          >
            <Box sx={{ 
              mr: { xs: 1.5, sm: 2, md: 2.5 },
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <EmojiEventsIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h6"
                fontWeight={700} 
                sx={{ 
                  color: '#fff',
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                  lineHeight: 1.2,
                  mb: 0.5
                }}
              >
                {performanceData?.winRate?.toFixed(1) || '0.0'}%
              </Typography>
              <Typography 
                variant="subtitle2"
                fontWeight={500} 
                sx={{ 
                  color: '#fff', 
                  opacity: 0.9,
                  fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' },
                  lineHeight: 1.2
                }}
              >
                Win Rate
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Copy Trading Daily Performance Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 6,
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              color: '#333',
              minHeight: { xs: 110, sm: 120, md: 130 },
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 2, sm: 2.5, md: 3 },
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: { xs: 'none', sm: 'translateY(-2px)' },
                boxShadow: { xs: 6, sm: 8 }
              }
            }}
          >
            <Box sx={{ 
              mr: { xs: 1.5, sm: 2, md: 2.5 },
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShowChartIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h6"
                fontWeight={700} 
                sx={{ 
                  color: performanceData?.dailyChange >= 0 ? '#4caf50' : '#f44336',
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                  lineHeight: 1.2,
                  mb: 0.5
                }}
              >
                {performanceData?.dailyChange >= 0 ? '+' : ''}{performanceData?.dailyChange?.toFixed(2) || '0.00'}%
              </Typography>
              <Typography 
                variant="subtitle2"
                fontWeight={500} 
                sx={{ 
                  color: '#333', 
                  opacity: 0.8,
                  fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' },
                  lineHeight: 1.2
                }}
              >
                Daily Change
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Three Large, Vertically Arranged Live Charts */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 4 }, alignItems: 'center', width: '100%' }}>
        {/* Crypto Trading Chart */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: 6, 
          minHeight: { xs: 320, sm: 360, md: 400 }, 
          bgcolor: theme.palette.background.paper, 
          width: '100%', 
          maxWidth: 1200, 
          p: { xs: 1.5, sm: 2, md: 2.5 }, 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          <Typography 
            variant="h5"
            fontWeight={700} 
            sx={{ 
              mb: 2, 
              textAlign: 'center',
              fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
              color: theme.palette.text.primary
            }}
          >
            Crypto Trading Chart
          </Typography>
          <Box sx={{ 
            mb: 2, 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center',
            px: { xs: 1, sm: 0 }
          }}>
            <select
              value={selectedPair}
              onChange={e => setSelectedPair(e.target.value)}
              style={{ 
                padding: '10px 16px', 
                fontSize: { xs: '0.9rem', sm: '1rem' }, 
                borderRadius: 8, 
                background: '#232742', 
                color: '#fff', 
                border: '1px solid #444',
                width: '100%',
                maxWidth: { xs: '100%', sm: 320, md: 350 },
                minWidth: 200,
                fontWeight: 500
              }}
            >
              {cryptoPairs.map(pair => (
                <option key={pair.value} value={pair.value}>{pair.label}</option>
              ))}
            </select>
          </Box>
          <Box sx={{ 
            width: { xs: '100%', sm: chartWidth }, 
            minWidth: { xs: '100%', sm: 320 }, 
            maxWidth: '100%', 
            transition: 'width 0.1s', 
            position: 'relative', 
            display: 'flex', 
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 2
          }}>
            <iframe
              title="Crypto Trading Chart"
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_crypto&symbol=${selectedPair}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
              width="100%"
              height={typeof window !== 'undefined' && window.innerWidth < 600 ? "350" : "420"}
              frameBorder="0"
              scrolling="no"
              style={{ borderRadius: 8, minHeight: 320 }}
            />
            <div
              onMouseDown={handleMouseDown}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 10,
                height: '100%',
                cursor: 'ew-resize',
                background: 'rgba(35,39,66,0.7)',
                borderRadius: '0 8px 8px 0',
                zIndex: 2,
                display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8,
                transition: 'opacity 0.2s'
              }}
              title="Drag to resize chart"
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.8'}
            >
              <span style={{ width: 4, height: 50, background: '#fff', borderRadius: 2 }} />
            </div>
          </Box>
        </Card>

        {/* Forex Trading Chart */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: 6, 
          minHeight: { xs: 320, sm: 360, md: 400 }, 
          bgcolor: theme.palette.background.paper, 
          width: '100%', 
          maxWidth: 1200, 
          p: { xs: 1.5, sm: 2, md: 2.5 }, 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          <Typography 
            variant="h5"
            fontWeight={700} 
            sx={{ 
              mb: 2,
              fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
              color: theme.palette.text.primary
            }}
          >
            Forex Trading Chart
          </Typography>
          <Box sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center', px: { xs: 1, sm: 0 } }}>
            <select
              value={selectedForex}
              onChange={e => setSelectedForex(e.target.value)}
              style={{ 
                padding: '10px 16px', 
                fontSize: { xs: '0.9rem', sm: '1rem' }, 
                borderRadius: 8, 
                background: '#232742', 
                color: '#fff', 
                border: '1px solid #444',
                width: '100%',
                maxWidth: { xs: '100%', sm: 320, md: 350 },
                minWidth: 200,
                fontWeight: 500
              }}
            >
              {['OANDA:EURUSD','OANDA:GBPUSD','OANDA:USDJPY','OANDA:USDCHF','OANDA:AUDUSD','OANDA:USDCAD','OANDA:NZDUSD'].map(pair => (
                <option key={pair} value={pair}>{pair.replace('OANDA:','')}</option>
              ))}
            </select>
          </Box>
          <Box sx={{ 
            width: { xs: '100%', sm: chartWidth }, 
            minWidth: { xs: '100%', sm: 320 }, 
            maxWidth: '100%', 
            transition: 'width 0.1s', 
            position: 'relative', 
            display: 'flex', 
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 2
          }}>
            <iframe
              title="Forex Trading Chart"
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_forex&symbol=${selectedForex}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
              width="100%"
              height={typeof window !== 'undefined' && window.innerWidth < 600 ? "350" : "420"}
              frameBorder="0"
              scrolling="no"
              style={{ borderRadius: 8, minHeight: 320 }}
            />
            <div
              onMouseDown={handleMouseDown}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 10,
                height: '100%',
                cursor: 'ew-resize',
                background: 'rgba(35,39,66,0.7)',
                borderRadius: '0 8px 8px 0',
                zIndex: 2,
                display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8,
                transition: 'opacity 0.2s'
              }}
              title="Drag to resize chart"
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.8'}
            >
              <span style={{ width: 4, height: 50, background: '#fff', borderRadius: 2 }} />
            </div>
          </Box>
        </Card>

        {/* Stock Market Data Chart */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: 6, 
          minHeight: { xs: 320, sm: 360, md: 400 }, 
          bgcolor: theme.palette.background.paper, 
          width: '100%', 
          maxWidth: 1200, 
          p: { xs: 1.5, sm: 2, md: 2.5 }, 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          <Typography 
            variant="h5"
            fontWeight={700} 
            sx={{ 
              mb: 2,
              fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
              color: theme.palette.text.primary
            }}
          >
            Stock Market Data Chart
          </Typography>
          <Box sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center', px: { xs: 1, sm: 0 } }}>
            <select
              value={selectedStock}
              onChange={e => setSelectedStock(e.target.value)}
              style={{ 
                padding: '10px 16px', 
                fontSize: { xs: '0.9rem', sm: '1rem' }, 
                borderRadius: 8, 
                background: '#232742', 
                color: '#fff', 
                border: '1px solid #444',
                width: '100%',
                maxWidth: { xs: '100%', sm: 320, md: 350 },
                minWidth: 200,
                fontWeight: 500
              }}
            >
              {['NASDAQ:AAPL','NASDAQ:MSFT','NASDAQ:GOOGL','NASDAQ:AMZN','NASDAQ:TSLA','NYSE:BRK.A','NYSE:JPM','NYSE:V','NYSE:UNH','NYSE:HD'].map(stock => (
                <option key={stock} value={stock}>{stock.replace(/^[A-Z]+:/,'')}</option>
              ))}
            </select>
          </Box>
          <Box sx={{ 
            width: { xs: '100%', sm: chartWidth }, 
            minWidth: { xs: '100%', sm: 320 }, 
            maxWidth: '100%', 
            transition: 'width 0.1s', 
            position: 'relative', 
            display: 'flex', 
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 2
          }}>
            <iframe
              title="Stock Market Data Chart"
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_stock&symbol=${selectedStock}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
              width="100%"
              height={typeof window !== 'undefined' && window.innerWidth < 600 ? "350" : "420"}
              frameBorder="0"
              scrolling="no"
              style={{ borderRadius: 8, minHeight: 320 }}
            />
            <div
              onMouseDown={handleMouseDown}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 10,
                height: '100%',
                cursor: 'ew-resize',
                background: 'rgba(35,39,66,0.7)',
                borderRadius: '0 8px 8px 0',
                zIndex: 2,
                display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8,
                transition: 'opacity 0.2s'
              }}
              title="Drag to resize chart"
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.8'}
            >
              <span style={{ width: 4, height: 50, background: '#fff', borderRadius: 2 }} />
            </div>
          </Box>
        </Card>
      </Box>

      {/* Additional Quick Actions */}
      <Box sx={{ 
        mt: 4, 
        mb: 2, 
        display: 'flex', 
        justifyContent: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontWeight: 600,
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Quick Actions
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 1.5, sm: 2 }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button 
            variant="outlined" 
            color="primary"
            sx={{ 
              fontWeight: 600,
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 1.25 },
              borderRadius: 2,
              minWidth: { xs: '100%', sm: 140 }
            }}
          >
            View Portfolio
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            sx={{ 
              fontWeight: 600,
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 1.25 },
              borderRadius: 2,
              minWidth: { xs: '100%', sm: 140 }
            }}
          >
            Open Trade
          </Button>
        </Stack>
      </Box>
      </>

      {/* Contact Modal */}
      <ContactModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </Box>
  );
}
