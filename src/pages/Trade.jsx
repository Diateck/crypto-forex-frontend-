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
  IconButton,
  Tooltip,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  PlayArrow,
  Stop,
  Refresh,
  Info,
  Warning,
  CheckCircle,
  Cancel,
  AccessTime
} from '@mui/icons-material';

// Trading assets - Crypto, Forex, and Stocks with TradingView symbols
const tradingAssets = [
  // Cryptocurrency
  { symbol: 'BTC/USDT', name: 'Bitcoin', price: 45000, change: 2.5, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:BTCUSDT' },
  { symbol: 'ETH/USDT', name: 'Ethereum', price: 2800, change: -1.2, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:ETHUSDT' },
  { symbol: 'BNB/USDT', name: 'Binance Coin', price: 320, change: 0.8, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:BNBUSDT' },
  { symbol: 'ADA/USDT', name: 'Cardano', price: 0.45, change: 3.1, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:ADAUSDT' },
  { symbol: 'SOL/USDT', name: 'Solana', price: 98, change: -2.1, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:SOLUSDT' },
  { symbol: 'DOT/USDT', name: 'Polkadot', price: 8.5, change: 1.7, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:DOTUSDT' },

  // Forex
  { symbol: 'EUR/USD', name: 'Euro vs US Dollar', price: 1.0850, change: 0.15, type: 'forex', category: 'Forex', tvSymbol: 'OANDA:EURUSD' },
  { symbol: 'GBP/USD', name: 'British Pound vs US Dollar', price: 1.2750, change: -0.25, type: 'forex', category: 'Forex', tvSymbol: 'OANDA:GBPUSD' },
  { symbol: 'USD/JPY', name: 'US Dollar vs Japanese Yen', price: 147.50, change: 0.35, type: 'forex', category: 'Forex', tvSymbol: 'OANDA:USDJPY' },
  { symbol: 'USD/CHF', name: 'US Dollar vs Swiss Franc', price: 0.9050, change: -0.12, type: 'forex', category: 'Forex', tvSymbol: 'OANDA:USDCHF' },
  { symbol: 'AUD/USD', name: 'Australian Dollar vs US Dollar', price: 0.6750, change: 0.45, type: 'forex', category: 'Forex', tvSymbol: 'OANDA:AUDUSD' },
  { symbol: 'USD/CAD', name: 'US Dollar vs Canadian Dollar', price: 1.3450, change: -0.28, type: 'forex', category: 'Forex', tvSymbol: 'OANDA:USDCAD' },

  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 1.25, type: 'stock', category: 'Stocks', tvSymbol: 'NASDAQ:AAPL' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.80, change: -2.15, type: 'stock', category: 'Stocks', tvSymbol: 'NASDAQ:TSLA' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.25, change: 0.85, type: 'stock', category: 'Stocks', tvSymbol: 'NASDAQ:GOOGL' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 335.75, change: 1.95, type: 'stock', category: 'Stocks', tvSymbol: 'NASDAQ:MSFT' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.20, change: -0.75, type: 'stock', category: 'Stocks', tvSymbol: 'NASDAQ:AMZN' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.30, change: 3.45, type: 'stock', category: 'Stocks', tvSymbol: 'NASDAQ:NVDA' }
];

// Trading Signals
const tradingSignals = [
  {
    id: 'SIG001',
    symbol: 'BTC/USDT',
    type: 'BUY',
    strength: 'STRONG',
    price: 44800,
    target: 46500,
    stopLoss: 43500,
    timeframe: '4H',
    timestamp: new Date(Date.now() - 1800000),
    reason: 'Bullish divergence on RSI, support level breakout'
  },
  {
    id: 'SIG002',
    symbol: 'EUR/USD',
    type: 'SELL',
    strength: 'MODERATE',
    price: 1.0870,
    target: 1.0750,
    stopLoss: 1.0920,
    timeframe: '1H',
    timestamp: new Date(Date.now() - 900000),
    reason: 'Resistance level rejection, bearish MACD crossover'
  },
  {
    id: 'SIG003',
    symbol: 'AAPL',
    type: 'BUY',
    strength: 'STRONG',
    price: 174.20,
    target: 182.00,
    stopLoss: 170.50,
    timeframe: '1D',
    timestamp: new Date(Date.now() - 3600000),
    reason: 'Earnings beat expectations, positive momentum'
  },
  {
    id: 'SIG004',
    symbol: 'ETH/USDT',
    type: 'BUY',
    strength: 'MODERATE',
    price: 2780,
    target: 2950,
    stopLoss: 2700,
    timeframe: '2H',
    timestamp: new Date(Date.now() - 720000),
    reason: 'Support level hold, increasing volume'
  },
  {
    id: 'SIG005',
    symbol: 'GBP/USD',
    type: 'SELL',
    strength: 'WEAK',
    price: 1.2780,
    target: 1.2650,
    stopLoss: 1.2850,
    timeframe: '30M',
    timestamp: new Date(Date.now() - 300000),
    reason: 'Overbought conditions, potential reversal'
  }
];

// Multipliers
const multipliers = [
  { label: 'X2', value: 2, color: 'primary' },
  { label: 'X3', value: 3, color: 'secondary' },
  { label: 'X5', value: 5, color: 'warning' },
  { label: 'X10', value: 10, color: 'error' }
];

// Mock trade history
const mockTradeHistory = [
  {
    id: 'T001',
    symbol: 'BTC/USDT',
    type: 'BUY',
    multiplier: 'X2',
    amount: 100,
    entryPrice: 44500,
    currentPrice: 45000,
    pnl: 50,
    status: 'ACTIVE',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: 'T002',
    symbol: 'ETH/USDT',
    type: 'SELL',
    multiplier: 'X5',
    amount: 200,
    entryPrice: 2850,
    exitPrice: 2800,
    pnl: 250,
    status: 'CLOSED',
    timestamp: new Date(Date.now() - 600000)
  }
];

export default function Trade() {
  const theme = useTheme();
  const [selectedAsset, setSelectedAsset] = useState(tradingAssets[0]);
  const [selectedMultiplier, setSelectedMultiplier] = useState(multipliers[0]);
  const [tradeAmount, setTradeAmount] = useState(100);
  const [currentPrice, setCurrentPrice] = useState(selectedAsset.price);
  const [priceChange, setPriceChange] = useState(selectedAsset.change);
  const [accountBalance, setAccountBalance] = useState(12500.00);
  const [activeTrades, setActiveTrades] = useState(mockTradeHistory.filter(t => t.status === 'ACTIVE'));
  const [tradeHistory, setTradeHistory] = useState(mockTradeHistory.filter(t => t.status === 'CLOSED'));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, trade: null });
  const [chartWidth, setChartWidth] = useState(900);
  const isResizing = useRef(false);

  // Update price from chart
  const handlePriceUpdate = (price, change) => {
    setCurrentPrice(price);
    setPriceChange(change);
  };

  // Handle asset selection
  const handleAssetChange = (asset) => {
    setSelectedAsset(asset);
    setCurrentPrice(asset.price);
    setPriceChange(asset.change);
  };

  // Chart resizing functions
  const handleMouseDown = useRef(() => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
  });

  const handleMouseUp = useRef(() => {
    isResizing.current = false;
    if (typeof document !== 'undefined') {
      document.body.style.cursor = '';
    }
  });

  const handleMouseMove = useRef((e) => {
    if (isResizing.current && typeof window !== 'undefined') {
      const newWidth = Math.max(300, Math.min(window.innerWidth, e.clientX - 50));
      setChartWidth(newWidth);
    }
  });

  // Set up chart resizing event listeners
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove.current);
      window.addEventListener('mouseup', handleMouseUp.current);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove.current);
        window.removeEventListener('mouseup', handleMouseUp.current);
      };
    }
  }, []);

  // Handle trade execution
  const handleTrade = (direction) => {
    const trade = {
      symbol: selectedAsset.symbol,
      type: direction,
      multiplier: selectedMultiplier.label,
      amount: tradeAmount,
      entryPrice: currentPrice,
      timestamp: new Date()
    };

    setConfirmDialog({ open: true, trade });
  };

  // Confirm trade execution
  const confirmTrade = () => {
    const { trade } = confirmDialog;

    // Check if sufficient balance
    if (trade.amount > accountBalance) {
      setSnackbar({
        open: true,
        message: 'Insufficient balance for this trade',
        severity: 'error'
      });
      setConfirmDialog({ open: false, trade: null });
      return;
    }

    // Create new trade
    const newTrade = {
      id: `T${Date.now()}`,
      ...trade,
      status: 'ACTIVE',
      pnl: 0
    };

    // Update balance
    setAccountBalance(prev => prev - trade.amount);

    // Add to active trades
    setActiveTrades(prev => [newTrade, ...prev]);

    setSnackbar({
      open: true,
      message: `${trade.type} ${trade.multiplier} ${trade.symbol} trade opened successfully!`,
      severity: 'success'
    });

    setConfirmDialog({ open: false, trade: null });
  };

  // Close trade
  const closeTrade = (tradeId) => {
    const trade = activeTrades.find(t => t.id === tradeId);
    if (!trade) return;

    const exitPrice = currentPrice;
    const pnl = trade.type === 'BUY'
      ? (exitPrice - trade.entryPrice) * (trade.amount / trade.entryPrice) * trade.multiplier.value
      : (trade.entryPrice - exitPrice) * (trade.amount / trade.entryPrice) * trade.multiplier.value;

    // Update trade
    const updatedTrade = {
      ...trade,
      exitPrice,
      pnl: Math.round(pnl * 100) / 100,
      status: 'CLOSED',
      timestamp: new Date()
    };

    // Update balance
    setAccountBalance(prev => prev + trade.amount + pnl);

    // Move to history
    setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
    setTradeHistory(prev => [updatedTrade, ...prev]);

    setSnackbar({
      open: true,
      message: `Trade closed with ${pnl >= 0 ? 'profit' : 'loss'} of $${Math.abs(pnl)}`,
      severity: pnl >= 0 ? 'success' : 'warning'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'primary';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  };

  // Get PNL color
  const getPnlColor = (pnl) => {
    if (pnl > 0) return 'success.main';
    if (pnl < 0) return 'error.main';
    return 'text.secondary';
  };

  return (
    <Box sx={{
      p: { xs: 1, sm: 2, md: 3 },
      minHeight: '100vh',
      bgcolor: theme.palette.background.default
    }}>
      {/* Header - Consistent with Dashboard */}
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
            <Person sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem' } }} />
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
              Username: <span style={{ color: theme.palette.primary.main }}>theophilus</span>
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
            icon={<VerifiedUser />}
            label="KYC"
            color="primary"
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
            startIcon={<Email sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />}
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
            Mail Us
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Settings sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />}
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

      {/* Market Overview */}
      <Card sx={{
        background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
        borderRadius: 3,
        boxShadow: 6,
        mb: 3
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary"
            gutterBottom
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            Market Overview
          </Typography>

          <Grid container spacing={2}>
            {/* Cryptocurrency Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary.main" fontWeight={600} sx={{ mb: 1 }}>
                  Cryptocurrency
                </Typography>
                <Stack spacing={1}>
                  {tradingAssets.filter(asset => asset.type === 'crypto').slice(0, 3).map((asset) => (
                    <Box
                      key={asset.symbol}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                      }}
                      onClick={() => handleAssetChange(asset)}
                    >
                      <Typography variant="body2" color="white" fontWeight={500}>
                        {asset.symbol}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="white">
                          ${asset.price.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={asset.change >= 0 ? 'success.main' : 'error.main'}
                          fontWeight={600}
                        >
                          {asset.change >= 0 ? '+' : ''}{asset.change}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* Forex Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="secondary.main" fontWeight={600} sx={{ mb: 1 }}>
                  Forex
                </Typography>
                <Stack spacing={1}>
                  {tradingAssets.filter(asset => asset.type === 'forex').slice(0, 3).map((asset) => (
                    <Box
                      key={asset.symbol}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                      }}
                      onClick={() => handleAssetChange(asset)}
                    >
                      <Typography variant="body2" color="white" fontWeight={500}>
                        {asset.symbol}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="white">
                          {asset.price.toFixed(4)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={asset.change >= 0 ? 'success.main' : 'error.main'}
                          fontWeight={600}
                        >
                          {asset.change >= 0 ? '+' : ''}{asset.change}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* Stocks Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="warning.main" fontWeight={600} sx={{ mb: 1 }}>
                  Stocks
                </Typography>
                <Stack spacing={1}>
                  {tradingAssets.filter(asset => asset.type === 'stock').slice(0, 3).map((asset) => (
                    <Box
                      key={asset.symbol}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                      }}
                      onClick={() => handleAssetChange(asset)}
                    >
                      <Typography variant="body2" color="white" fontWeight={500}>
                        {asset.symbol}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="white">
                          ${asset.price.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={asset.change >= 0 ? 'success.main' : 'error.main'}
                          fontWeight={600}
                        >
                          {asset.change >= 0 ? '+' : ''}{asset.change}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
      </CardContent>
      </Card>
      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        {/* Left Column - Chart and Trading Controls */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Live Trading Chart */}
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
                Live Trading Chart - {selectedAsset.symbol}
              </Typography>
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
                  title="Live Trading Chart"
                  src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_trade&symbol=${selectedAsset.tvSymbol}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
                  width="100%"
                  height={typeof window !== 'undefined' && window.innerWidth < 600 ? "350" : "420"}
                  frameBorder="0"
                  scrolling="no"
                  style={{ borderRadius: 8, minHeight: 320 }}
                />
                <div
                  onMouseDown={handleMouseDown.current}
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
                        {/* Cryptocurrency */}
                        <MenuItem disabled sx={{ fontWeight: 600, color: 'primary.main' }}>
                          ─── Cryptocurrency ───
                        </MenuItem>
                        {tradingAssets.filter(asset => asset.type === 'crypto').map((asset) => (
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

                        {/* Forex */}
                        <MenuItem disabled sx={{ fontWeight: 600, color: 'secondary.main', mt: 1 }}>
                          ─── Forex ───
                        </MenuItem>
                        {tradingAssets.filter(asset => asset.type === 'forex').map((asset) => (
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

                        {/* Stocks */}
                        <MenuItem disabled sx={{ fontWeight: 600, color: 'warning.main', mt: 1 }}>
                          ─── Stocks ───
                        </MenuItem>
                        {tradingAssets.filter(asset => asset.type === 'stock').map((asset) => (
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

            {/* Trading Signals */}
            <Card sx={{
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                  >
                    Trading Signals
                  </Typography>
                  <Chip
                    label={`${tradingSignals.length} Active`}
                    color="warning"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Stack spacing={2}>
                  {tradingSignals.slice(0, 4).map((signal) => (
                    <Paper
                      key={signal.id}
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        border: `1px solid ${signal.type === 'BUY' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" color="white" fontWeight={600}>
                            {signal.symbol}
                          </Typography>
                          <Chip
                            label={signal.type}
                            color={signal.type === 'BUY' ? 'success' : 'error'}
                            size="small"
                            sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                          />
                          <Chip
                            label={signal.strength}
                            color={
                              signal.strength === 'STRONG' ? 'success' :
                              signal.strength === 'MODERATE' ? 'warning' : 'error'
                            }
                            variant="outlined"
                            size="small"
                            sx={{ fontSize: '0.65rem' }}
                          />
                        </Box>
                        <Typography variant="caption" color="rgba(255,255,255,0.6)">
                          {signal.timeframe}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 1, fontSize: '0.8rem' }}>
                        {signal.reason}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)">
                            Entry: <span style={{ color: 'white', fontWeight: 600 }}>${signal.price.toLocaleString()}</span>
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ ml: 2 }}>
                            Target: <span style={{ color: 'success.main', fontWeight: 600 }}>${signal.target.toLocaleString()}</span>
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ ml: 2 }}>
                            Stop: <span style={{ color: 'error.main', fontWeight: 600 }}>${signal.stopLoss.toLocaleString()}</span>
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="rgba(255,255,255,0.6)">
                          {signal.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>

                {tradingSignals.length > 4 && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: 'primary.main',
                        borderColor: 'rgba(25, 118, 210, 0.5)',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'rgba(25, 118, 210, 0.1)'
                        }
                      }}
                    >
                      View All Signals
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column - Account Info and Active Trades */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Account Balance */}
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
                  Account Balance
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="white"
                    sx={{ fontSize: { xs: '1.8rem', sm: '2.125rem' } }}
                  >
                    ${accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Available Balance
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Today's P&L
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    +$320.50
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* Active Trades */}
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
                  Active Trades ({activeTrades.length})
                </Typography>

                {activeTrades.length === 0 ? (
                  <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ textAlign: 'center', py: 3 }}>
                    No active trades
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {activeTrades.map((trade) => (
                      <Paper
                        key={trade.id}
                        sx={{
                          p: 2,
                          bgcolor: 'rgba(255,255,255,0.05)',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle2" color="white" fontWeight={600}>
                              {trade.symbol} {trade.multiplier}
                            </Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.7)">
                              {trade.type} • ${trade.amount}
                            </Typography>
                          </Box>
                          <Chip
                            label="ACTIVE"
                            color="primary"
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)">
                            Entry: ${trade.entryPrice.toLocaleString()}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => closeTrade(trade.id)}
                            sx={{ fontSize: '0.7rem', py: 0.5 }}
                          >
                            Close
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* Recent Trades */}
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
                  Recent Trades
                </Typography>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', p: 1 }}>
                          Asset
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', p: 1 }}>
                          P&L
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tradeHistory.slice(0, 5).map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell sx={{ color: 'white', fontSize: '0.8rem', p: 1 }}>
                            <Box>
                              <Typography variant="caption" color="white" fontWeight={600}>
                                {trade.symbol}
                              </Typography>
                              <Typography variant="caption" color="rgba(255,255,255,0.6)">
                                {trade.multiplier} {trade.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>
                            <Typography
                              variant="caption"
                              sx={{ color: getPnlColor(trade.pnl), fontWeight: 600 }}
                            >
                              {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
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
          Confirm Trade
        </DialogTitle>
        <DialogContent>
          {confirmDialog.trade && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="h6" gutterBottom>
                {confirmDialog.trade.type} {confirmDialog.trade.multiplier} {confirmDialog.trade.symbol}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Amount: ${confirmDialog.trade.amount}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Entry Price: ${confirmDialog.trade.entryPrice.toLocaleString()}
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                This will deduct ${confirmDialog.trade.amount} from your balance.
              </Alert>
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
            onClick={confirmTrade}
            variant="contained"
            color="primary"
            autoFocus
          >
            Confirm Trade
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
