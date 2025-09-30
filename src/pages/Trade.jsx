import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Grid,
  Chip,
  Avatar,
  useTheme,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  Person,
  Email,
  Settings,
  VerifiedUser,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  Timeline,
  History
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useBalance } from '../contexts/BalanceContext';
import { useNotifications } from '../contexts/NotificationContext';
import useLiveTrading from '../hooks/useLiveTrading';

// Backend API configuration - Updated to use deployed backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://crypto-forex-backend-9mme.onrender.com/api';

const tradingAPI = {
  // Submit trade order to backend
  submitTrade: async (tradeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trading/submit-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(tradeData)
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'API connection failed' };
    }
  },

  // Close trade position
  closeTrade: async (tradeId, closePrice) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trading/close-position`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ tradeId, closePrice })
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'API connection failed' };
    }
  },

  // Get user's trading history
  getTradingHistory: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trading/history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'API connection failed' };
    }
  },

  // Get active trading positions
  getActivePositions: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trading/positions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'API connection failed' };
    }
  },

  // Get real-time market data
  getMarketData: async (symbols) => {
    try {
      const response = await fetch(`${API_BASE_URL}/market/prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbols })
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'API connection failed' };
    }
  },

  // Verify trading account and balance
  verifyTradingAccount: async (userId, tradeAmount) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trading/verify-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId, tradeAmount })
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'API connection failed' };
    }
  }
};

// Trading assets - Crypto, Forex, and Stocks with TradingView symbols
const tradingAssets = [
  // Cryptocurrency
  { symbol: 'BTC/USDT', name: 'Bitcoin', price: 45000, change: 2.5, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:BTCUSDT' },
  { symbol: 'ETH/USDT', name: 'Ethereum', price: 2800, change: -1.2, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:ETHUSDT' },
  { symbol: 'BNB/USDT', name: 'Binance Coin', price: 320, change: 0.8, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:BNBUSDT' },
  
  // Forex
  { symbol: 'EUR/USD', name: 'Euro vs US Dollar', price: 1.0850, change: 0.15, type: 'forex', category: 'Forex', tvSymbol: 'FX:EURUSD' },
  { symbol: 'GBP/USD', name: 'British Pound vs US Dollar', price: 1.2750, change: -0.25, type: 'forex', category: 'Forex', tvSymbol: 'FX:GBPUSD' },
  { symbol: 'USD/JPY', name: 'US Dollar vs Japanese Yen', price: 147.50, change: 0.35, type: 'forex', category: 'Forex', tvSymbol: 'FX:USDJPY' },

  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 1.25, type: 'stock', category: 'Stocks', tvSymbol: 'NASDAQ:AAPL' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.80, change: -2.15, type: 'stock', category: 'Stocks', tvSymbol: 'NASDAQ:TSLA' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.25, change: 0.85, type: 'stock', category: 'Stocks', tvSymbol: 'NASDAQ:GOOGL' }
];

// Multipliers
const multipliers = [
  { label: 'X2', value: 2, color: 'primary' },
  { label: 'X3', value: 3, color: 'secondary' },
  { label: 'X5', value: 5, color: 'warning' },
  { label: 'X10', value: 10, color: 'error' }
];

export default function Trade() {
  const theme = useTheme();
  const { user } = useUser();
  const { balance, updateBalance, deductBalance, addBalance, refreshBalance } = useBalance();
  const { addNotification } = useNotifications();
  
  // Use live trading hook for real-time data
  const {
    activeTrades,
    tradeHistory,
    tradingStats,
    marketData,
    isLive,
    lastUpdated,
    loading: tradingLoading,
    error: tradingError,
    submitTrade: submitTradeAPI,
    closeTrade: closeTradeAPI,
    refreshData,
    refreshMarketData
  } = useLiveTrading(user?.id, 15000);
  
  // Local state management
  const [selectedAsset, setSelectedAsset] = useState(tradingAssets[0]);
  const [selectedMultiplier, setSelectedMultiplier] = useState(multipliers[0]);
  const [tradeAmount, setTradeAmount] = useState(100);
  const [currentPrice, setCurrentPrice] = useState(selectedAsset.price);
  const [priceChange, setPriceChange] = useState(selectedAsset.change);
  const [validation, setValidation] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, trade: null });
  const [loading, setLoading] = useState({
    page: false,
    trade: false,
    close: false
  });
  
  // Update current price when asset or market data changes
  useEffect(() => {
    if (marketData[selectedAsset.tvSymbol]) {
      setCurrentPrice(marketData[selectedAsset.tvSymbol].price);
      setPriceChange(marketData[selectedAsset.tvSymbol].change);
    }
  }, [selectedAsset, marketData]);

  // Load initial data on component mount
  useEffect(() => {
    setLoading(prev => ({ ...prev, page: tradingLoading }));
  }, [tradingLoading]);

  // Calculate trading statistics
  const calculateTradingStats = (trades) => {
    // This is now handled by the useLiveTrading hook
    return {
      todayPnl: tradingStats.todayPnl,
      totalTrades: tradingStats.totalTrades,
      winRate: tradingStats.winRate
    };
  };

  // Notification handler
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
    // Also add to global notification context
    addNotification({
      message,
      type: severity,
      timestamp: new Date().toISOString()
    });
  };

  // Enhanced form validation
  const validateTrade = () => {
    const errors = {};
    
    if (!tradeAmount || isNaN(tradeAmount) || tradeAmount <= 0) {
      errors.amount = 'Please enter a valid trade amount';
    } else if (tradeAmount > balance) {
      errors.amount = 'Insufficient balance for this trade';
    } else if (tradeAmount < 10) {
      errors.amount = 'Minimum trade amount is $10';
    } else if (tradeAmount > 10000) {
      errors.amount = 'Maximum trade amount is $10,000';
    }
    
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle asset selection
  const handleAssetChange = (asset) => {
    setSelectedAsset(asset);
    
    // Update price from market data if available
    if (marketData[asset.tvSymbol]) {
      setCurrentPrice(marketData[asset.tvSymbol].price);
      setPriceChange(marketData[asset.tvSymbol].change);
    } else {
      setCurrentPrice(asset.price);
      setPriceChange(asset.change);
    }
  };

  // Professional trade execution with backend integration
  const handleTrade = async (direction) => {
    if (!validateTrade()) {
      showNotification('Please fix the trade parameters', 'error');
      return;
    }

    const trade = {
      // Trade Details
      symbol: selectedAsset.symbol,
      type: direction,
      multiplier: selectedMultiplier.value,
      multiplierLabel: selectedMultiplier.label,
      amount: tradeAmount,
      entryPrice: currentPrice,
      
      // User Information
      userId: user?.id || 'demo_user_123',
      userName: user?.username || user?.name || 'Theophilus Crown',
      userEmail: user?.email || 'theophiluscrown693@gmail.com',
      
      // Asset Information
      assetName: selectedAsset.name,
      assetType: selectedAsset.type,
      assetCategory: selectedAsset.category,
      
      // Risk Management
      potentialProfit: tradeAmount * (selectedMultiplier.value - 1),
      potentialLoss: tradeAmount,
      riskRewardRatio: selectedMultiplier.value - 1,
      
      // Timestamps and Status
      timestamp: new Date().toISOString(),
      status: 'pending',
      
      // Additional metadata for backend
      userAgent: navigator.userAgent,
      sessionId: localStorage.getItem('sessionId') || null,
      marketPrice: currentPrice,
      leverage: selectedMultiplier.value,
      marginRequired: tradeAmount / selectedMultiplier.value
    };

    setConfirmDialog({ open: true, trade });
  };

  // Submit trade to backend and admin monitoring
  const submitTrade = async () => {
    try {
      setLoading(prev => ({ ...prev, trade: true }));
      const { trade } = confirmDialog;
      
      // Step 1: Verify trading account first
      const accountVerification = await tradingAPI.verifyTradingAccount(
        trade.userId, 
        trade.amount
      );
      
      if (!accountVerification.success) {
        throw new Error(accountVerification.message || 'Account verification failed');
      }

      // Step 2: Try to submit to backend API using the hook
      try {
        const result = await submitTradeAPI(trade);
        
        if (result.success) {
          showNotification(
            result.message || 'Trade executed successfully!',
            'success'
          );
          
          // Close dialog and refresh data
          setConfirmDialog({ open: false, trade: null });
          return;
        }
      } catch (apiError) {
        console.warn('Backend API failed, using localStorage fallback:', apiError);
      }
      
      // Step 3: Fallback to localStorage if backend fails (for development/demo)
      const localTradeData = {
        ...trade,
        id: `trade_${Date.now()}`,
        status: 'ACTIVE',
        backendStatus: 'offline',
        localSubmission: true,
        pnl: 0
      };
      
      // Store for admin dashboard monitoring
      const existingTrades = JSON.parse(localStorage.getItem('allUserTrades') || '[]');
      existingTrades.push(localTradeData);
      localStorage.setItem('allUserTrades', JSON.stringify(existingTrades));
      
      // Store in user's active trades
      const userActiveTrades = JSON.parse(localStorage.getItem('userActiveTrades') || '[]');
      userActiveTrades.push(localTradeData);
      localStorage.setItem('userActiveTrades', JSON.stringify(userActiveTrades));
      
      // Update user balance using BalanceContext
      deductBalance(trade.amount);
      
      // Also update localStorage for consistency
      const newBalance = balance - trade.amount;
      localStorage.setItem('userBalance', newBalance.toString());
      
      showNotification(
        `${trade.type} ${trade.multiplierLabel} ${trade.symbol} trade opened successfully!`,
        'success'
      );
      
      // Step 4: Close dialog and refresh data
      setConfirmDialog({ open: false, trade: null });
      await refreshData(); // Refresh data from the hook
      
    } catch (error) {
      console.error('Error submitting trade:', error);
      showNotification(
        'Error executing trade. Please try again or contact support.',
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, trade: false }));
    }
  };

  // Close trade with backend integration
  const closeTrade = async (tradeId) => {
    try {
      setLoading(prev => ({ ...prev, close: true }));
      
      const trade = activeTrades.find(t => t.id === tradeId);
      if (!trade) {
        showNotification('Trade not found', 'error');
        return;
      }

      const closePrice = currentPrice;
      
      // Try to close via backend API using the hook
      try {
        const result = await closeTradeAPI(tradeId, closePrice);
        
        if (result.success) {
          showNotification(
            result.message || 'Trade closed successfully!',
            result.data.pnl >= 0 ? 'success' : 'warning'
          );
          return;
        }
      } catch (apiError) {
        console.warn('Backend API failed, using localStorage fallback:', apiError);
      }
      
      // Fallback to localStorage if backend fails
      // Calculate P&L
      const pnl = trade.type === 'BUY'
        ? (closePrice - trade.entryPrice) * (trade.amount / trade.entryPrice) * trade.multiplier
        : (trade.entryPrice - closePrice) * (trade.amount / trade.entryPrice) * trade.multiplier;

      // Update trade with close information
      const updatedTrade = {
        ...trade,
        exitPrice: closePrice,
        pnl: Math.round(pnl * 100) / 100,
        status: 'CLOSED',
        closedAt: new Date().toISOString(),
        closingReason: 'manual'
      };

      // Update all trades for admin dashboard
      const allTrades = JSON.parse(localStorage.getItem('allUserTrades') || '[]');
      const updatedAllTrades = allTrades.map(t => 
        t.id === tradeId ? updatedTrade : t
      );
      localStorage.setItem('allUserTrades', JSON.stringify(updatedAllTrades));

      // Update user's active trades
      const userActiveTrades = JSON.parse(localStorage.getItem('userActiveTrades') || '[]');
      const updatedActiveTrades = userActiveTrades.filter(t => t.id !== tradeId);
      localStorage.setItem('userActiveTrades', JSON.stringify(updatedActiveTrades));

      // Update user's trade history
      const userTradeHistory = JSON.parse(localStorage.getItem('userTradeHistory') || '[]');
      userTradeHistory.push(updatedTrade);
      localStorage.setItem('userTradeHistory', JSON.stringify(userTradeHistory));

      // Update balance (return initial amount + P&L) using BalanceContext
      addBalance(trade.amount + pnl);
      
      // Also update localStorage for consistency
      const newBalance = balance + trade.amount + pnl;
      localStorage.setItem('userBalance', newBalance.toString());

      showNotification(
        `Trade closed with ${pnl >= 0 ? 'profit' : 'loss'} of $${Math.abs(pnl).toFixed(2)}`,
        pnl >= 0 ? 'success' : 'warning'
      );
      
      await refreshData(); // Refresh data from the hook
      
    } catch (error) {
      console.error('Error closing trade:', error);
      showNotification(
        'Error closing trade. Please try again or contact support.',
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, close: false }));
    }
  };

  return (
    <Box sx={{
      p: { xs: 1, sm: 2, md: 3 },
      minHeight: '100vh',
      bgcolor: theme.palette.background.default
    }}>
      {loading.page && (
        <LinearProgress 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 9999,
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4CAF50'
            }
          }} 
        />
      )}

      {/* Professional Header */}
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
            <TrendingUp sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem' } }} />
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
              Professional Trading
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
              User: <span style={{ color: theme.palette.primary.main }}>Theophilus Crown</span>
            </Typography>
          </Box>
        </Box>
        <Stack
          direction="row"
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
            icon={<VerifiedUser />}
            label="Verified Trader"
            color="success"
            variant="outlined"
            size="small"
            sx={{
              height: { xs: 28, sm: 32 },
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              fontWeight: 600
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Email sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />}
            size="small"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 32, sm: 36 },
              px: { xs: 1.5, sm: 2, md: 3 },
              fontWeight: 600
            }}
          >
            Support
          </Button>
        </Stack>
      </Box>

      {/* Main Trading Interface */}
      <Grid container spacing={3}>
        {/* Left Column - Trading Chart and Controls */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Live Trading Chart */}
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: 6, 
              minHeight: { xs: 320, sm: 360, md: 400 }, 
              bgcolor: theme.palette.background.paper, 
              p: { xs: 1.5, sm: 2, md: 2.5 }
            }}>
              <Typography 
                variant="h5"
                fontWeight={700} 
                sx={{ 
                  mb: 2, 
                  textAlign: 'center',
                  fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' }
                }}
              >
                Live Trading Chart - {selectedAsset.symbol} 
                <Chip 
                  label={selectedAsset.type.toUpperCase()} 
                  color={
                    selectedAsset.type === 'crypto' ? 'primary' :
                    selectedAsset.type === 'forex' ? 'secondary' : 'warning'
                  }
                  size="small" 
                  sx={{ ml: 1, fontSize: '0.6rem', height: 20 }}
                />
              </Typography>
              <Box sx={{ 
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 2
              }}>
                <iframe
                  key={selectedAsset.tvSymbol}
                  title="Live Trading Chart"
                  src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_trade&symbol=${selectedAsset.tvSymbol}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
                  width="100%"
                  height="420"
                  frameBorder="0"
                  scrolling="no"
                  style={{ borderRadius: 8, minHeight: 320 }}
                />
              </Box>
            </Card>

            {/* Trading Controls */}
            <Card sx={{
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                >
                  Trading Controls
                </Typography>

                <Grid container spacing={3}>
                  {/* Asset Selection */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Select Asset
                      </InputLabel>
                      <Select
                        value={selectedAsset.tvSymbol}
                        onChange={(e) => {
                          const asset = tradingAssets.find(a => a.tvSymbol === e.target.value);
                          if (asset) handleAssetChange(asset);
                        }}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                          '& .MuiSelect-select': { color: '#fff' },
                          '& .MuiSvgIcon-root': { color: '#fff' }
                        }}
                      >
                        {tradingAssets.map((asset) => (
                          <MenuItem key={asset.tvSymbol} value={asset.tvSymbol}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                              <Typography sx={{ flex: 1 }}>{asset.symbol}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                {asset.name}
                              </Typography>
                              <Chip
                                label={`${asset.change >= 0 ? '+' : ''}${asset.change}%`}
                                color={asset.change >= 0 ? 'success' : 'error'}
                                size="small"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Trade Amount */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Trade Amount ($)"
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(Number(e.target.value))}
                      error={!!validation.amount}
                      helperText={validation.amount || `Max: $${balance.toLocaleString()}`}
                      InputProps={{
                        sx: { color: '#fff' }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'primary.main' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' }
                      }}
                    />
                  </Grid>

                  {/* Multipliers */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="white" gutterBottom>
                      Select Multiplier
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {multipliers.map((multiplier) => (
                        <Chip
                          key={multiplier.value}
                          label={multiplier.label}
                          color={selectedMultiplier.value === multiplier.value ? multiplier.color : 'default'}
                          variant={selectedMultiplier.value === multiplier.value ? 'filled' : 'outlined'}
                          onClick={() => setSelectedMultiplier(multiplier)}
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            height: { xs: 36, sm: 40 },
                            minWidth: { xs: 60, sm: 70 },
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </Stack>
                  </Grid>

                  {/* Trade Buttons */}
                  <Grid item xs={12}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        startIcon={<TrendingUp />}
                        onClick={() => handleTrade('BUY')}
                        disabled={loading.trade}
                        fullWidth
                        sx={{
                          py: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 700,
                          borderRadius: 2
                        }}
                      >
                        BUY {selectedMultiplier.label} - ${tradeAmount}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<TrendingDown />}
                        onClick={() => handleTrade('SELL')}
                        disabled={loading.trade}
                        fullWidth
                        sx={{
                          py: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 700,
                          borderRadius: 2
                        }}
                      >
                        SELL {selectedMultiplier.label} - ${tradeAmount}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column - Account Info and Trading Overview */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Account Balance */}
            <Card sx={{
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6,
              p: { xs: 2, sm: 2.5, md: 3 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceWallet sx={{ fontSize: '2rem', color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Account Balance
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 2 }}>
                Available Balance
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Today's P&L
                </Typography>
                <Typography 
                  variant="body2" 
                  color={tradingStats.todayPnl >= 0 ? 'success.main' : 'error.main'} 
                  fontWeight={600}
                >
                  {tradingStats.todayPnl >= 0 ? '+' : ''}${tradingStats.todayPnl.toFixed(2)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Last Updated
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ fontSize: '0.75rem' }}>
                  {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Live'}
                </Typography>
              </Stack>
              {!isLive && (
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                  <Typography variant="body2" color="warning.main" sx={{ fontSize: '0.75rem' }}>
                    Offline Mode
                  </Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={refreshData}
                    sx={{ fontSize: '0.7rem', py: 0.25, px: 1, minWidth: 'auto' }}
                  >
                    Retry
                  </Button>
                </Stack>
              )}
            </Card>

            {/* Active Trades */}
            <Card sx={{
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6,
              p: { xs: 2, sm: 2.5, md: 3 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ fontSize: '2rem', color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Active Trades ({activeTrades.length})
                </Typography>
              </Box>

              {activeTrades.length === 0 ? (
                <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ textAlign: 'center', py: 2 }}>
                  No active trades
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {activeTrades.slice(0, 3).map((trade) => (
                    <Paper
                      key={trade.id}
                      sx={{
                        p: 1.5,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 0.5 }}>
                        <Box>
                          <Typography variant="subtitle2" color="white" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                            {trade.symbol} {trade.multiplierLabel}
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ fontSize: '0.7rem' }}>
                            {trade.type} • ${trade.amount}
                          </Typography>
                        </Box>
                        <Chip
                          label="ACTIVE"
                          color="primary"
                          size="small"
                          sx={{ fontSize: '0.6rem', height: 20 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ fontSize: '0.7rem' }}>
                          Entry: ${trade.entryPrice.toLocaleString()}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => closeTrade(trade.id)}
                          disabled={loading.close}
                          sx={{ fontSize: '0.6rem', py: 0.25, px: 1, minWidth: 'auto' }}
                        >
                          {loading.close ? 'Closing...' : 'Close'}
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Card>

            {/* Trading Statistics */}
            <Card sx={{
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6,
              p: { xs: 2, sm: 2.5, md: 3 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <History sx={{ fontSize: '2rem', color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Trading Stats
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Total Trades
                  </Typography>
                  <Typography variant="h6" color="white" fontWeight={600}>
                    {tradingStats.totalTrades}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Win Rate
                  </Typography>
                  <Typography variant="h6" color="success.main" fontWeight={600}>
                    {tradingStats.winRate.toFixed(1)}%
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, trade: null })}
        PaperProps={{
          sx: {
            bgcolor: '#232742',
            color: 'white',
            minWidth: { xs: '90vw', sm: 400 }
          }
        }}
      >
        <DialogTitle sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Confirm Trade Execution
        </DialogTitle>
        <DialogContent>
          {confirmDialog.trade && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="h6" gutterBottom>
                {confirmDialog.trade.type} {confirmDialog.trade.multiplierLabel} {confirmDialog.trade.symbol}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Amount: ${confirmDialog.trade.amount.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Entry Price: ${confirmDialog.trade.entryPrice.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Potential Profit: ${confirmDialog.trade.potentialProfit.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Maximum Loss: ${confirmDialog.trade.potentialLoss.toLocaleString()}
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                This will deduct ${confirmDialog.trade.amount.toLocaleString()} from your balance as margin.
              </Alert>
              <Alert severity="warning">
                Trading involves risk. Only trade with funds you can afford to lose.
              </Alert>
              {balance < confirmDialog.trade.amount && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  Insufficient balance! Current balance: ${balance.toLocaleString()}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, trade: null })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={submitTrade}
            variant="contained"
            color="primary"
            disabled={loading.trade || (confirmDialog.trade && balance < confirmDialog.trade.amount)}
            autoFocus
          >
            {loading.trade ? 'Executing...' : 'Confirm Trade'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}