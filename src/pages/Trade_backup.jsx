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
  TableRow,
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
  PlayArrow,
  Stop,
  Refresh,
  Info,
  Warning,
  CheckCircle,
  Cancel,
  AccessTime,
  History
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';

// Backend API configuration - Ready for backend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

  // Get trading signals
  getTradingSignals: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trading/signals`);
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
  { symbol: 'ADA/USDT', name: 'Cardano', price: 0.45, change: 3.1, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:ADAUSDT' },
  { symbol: 'SOL/USDT', name: 'Solana', price: 98, change: -2.1, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:SOLUSDT' },
  { symbol: 'DOT/USDT', name: 'Polkadot', price: 8.5, change: 1.7, type: 'crypto', category: 'Cryptocurrency', tvSymbol: 'BINANCE:DOTUSDT' },

  // Forex
  { symbol: 'EUR/USD', name: 'Euro vs US Dollar', price: 1.0850, change: 0.15, type: 'forex', category: 'Forex', tvSymbol: 'FX:EURUSD' },
  { symbol: 'GBP/USD', name: 'British Pound vs US Dollar', price: 1.2750, change: -0.25, type: 'forex', category: 'Forex', tvSymbol: 'FX:GBPUSD' },
  { symbol: 'USD/JPY', name: 'US Dollar vs Japanese Yen', price: 147.50, change: 0.35, type: 'forex', category: 'Forex', tvSymbol: 'FX:USDJPY' },
  { symbol: 'USD/CHF', name: 'US Dollar vs Swiss Franc', price: 0.9050, change: -0.12, type: 'forex', category: 'Forex', tvSymbol: 'FX:USDCHF' },
  { symbol: 'AUD/USD', name: 'Australian Dollar vs US Dollar', price: 0.6750, change: 0.45, type: 'forex', category: 'Forex', tvSymbol: 'FX:AUDUSD' },
  { symbol: 'USD/CAD', name: 'US Dollar vs Canadian Dollar', price: 1.3450, change: -0.28, type: 'forex', category: 'Forex', tvSymbol: 'FX:USDCAD' },

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
  },
  {
    id: 'SIG006',
    symbol: 'TSLA',
    type: 'BUY',
    strength: 'STRONG',
    price: 243.50,
    target: 260.00,
    stopLoss: 235.00,
    timeframe: '1D',
    timestamp: new Date(Date.now() - 1800000),
    reason: 'Strong upward trend, volume confirmation'
  },
  {
    id: 'SIG007',
    symbol: 'USD/JPY',
    type: 'BUY',
    strength: 'MODERATE',
    price: 147.20,
    target: 148.50,
    stopLoss: 146.50,
    timeframe: '4H',
    timestamp: new Date(Date.now() - 900000),
    reason: 'Bullish engulfing pattern, support level'
  },
  {
    id: 'SIG008',
    symbol: 'GOOGL',
    type: 'SELL',
    strength: 'MODERATE',
    price: 139.80,
    target: 135.00,
    stopLoss: 142.00,
    timeframe: '1D',
    timestamp: new Date(Date.now() - 3600000),
    reason: 'Resistance level, bearish indicators'
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
  },
  {
    id: 'T003',
    symbol: 'EUR/USD',
    type: 'BUY',
    multiplier: 'X3',
    amount: 150,
    entryPrice: 1.0820,
    exitPrice: 1.0850,
    pnl: 67.5,
    status: 'CLOSED',
    timestamp: new Date(Date.now() - 900000)
  },
  {
    id: 'T004',
    symbol: 'AAPL',
    type: 'BUY',
    multiplier: 'X2',
    amount: 200,
    entryPrice: 172.50,
    currentPrice: 175.50,
    pnl: 60,
    status: 'ACTIVE',
    timestamp: new Date(Date.now() - 1200000)
  },
  {
    id: 'T005',
    symbol: 'GBP/USD',
    type: 'SELL',
    multiplier: 'X3',
    amount: 180,
    entryPrice: 1.2800,
    exitPrice: 1.2750,
    pnl: 135,
    status: 'CLOSED',
    timestamp: new Date(Date.now() - 1800000)
  },
  {
    id: 'T006',
    symbol: 'TSLA',
    type: 'BUY',
    multiplier: 'X5',
    amount: 250,
    entryPrice: 240.00,
    exitPrice: 245.80,
    pnl: 362.5,
    status: 'CLOSED',
    timestamp: new Date(Date.now() - 2400000)
  }
];

export default function Trade() {
  const theme = useTheme();
  const { user } = useUser();
  
  // Enhanced state management for backend integration
  const [selectedAsset, setSelectedAsset] = useState(tradingAssets[0]);
  const [selectedMultiplier, setSelectedMultiplier] = useState(multipliers[0]);
  const [tradeAmount, setTradeAmount] = useState(100);
  const [currentPrice, setCurrentPrice] = useState(selectedAsset.price);
  const [priceChange, setPriceChange] = useState(selectedAsset.change);
  const [accountBalance, setAccountBalance] = useState(0);
  const [activeTrades, setActiveTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [tradingSignals, setTradingSignals] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [validation, setValidation] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, trade: null });
  const [loading, setLoading] = useState({
    page: false,
    trade: false,
    close: false,
    market: false
  });
  const [chartWidth, setChartWidth] = useState(900);
  const [tradingStats, setTradingStats] = useState({
    todayPnl: 0,
    totalTrades: 0,
    winRate: 0,
    totalPnl: 0
  });
  const isResizing = useRef(false);

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
    startMarketDataUpdates();
  }, [user?.id]);

  const loadInitialData = async () => {
    try {
      setLoading(prev => ({ ...prev, page: true }));
      
      // Load user balance (fallback to demo data)
      const storedBalance = localStorage.getItem('userBalance');
      setAccountBalance(storedBalance ? parseFloat(storedBalance) : 12547.83);
      
      // Try to load from backend first, fallback to localStorage
      const [positionsResult, historyResult, signalsResult] = await Promise.all([
        user?.id ? tradingAPI.getActivePositions(user.id) : Promise.resolve({ success: false }),
        user?.id ? tradingAPI.getTradingHistory(user.id) : Promise.resolve({ success: false }),
        tradingAPI.getTradingSignals()
      ]);
      
      // Handle active positions
      if (positionsResult.success) {
        setActiveTrades(positionsResult.data || []);
      } else {
        // Fallback to localStorage
        const localPositions = JSON.parse(localStorage.getItem('userActiveTrades') || '[]');
        setActiveTrades(localPositions);
      }
      
      // Handle trading history
      if (historyResult.success) {
        setTradeHistory(historyResult.data || []);
        calculateTradingStats(historyResult.data || []);
      } else {
        // Fallback to localStorage
        const localHistory = JSON.parse(localStorage.getItem('userTradeHistory') || '[]');
        setTradeHistory(localHistory);
        calculateTradingStats(localHistory);
      }
      
      // Handle trading signals
      if (signalsResult.success) {
        setTradingSignals(signalsResult.data || []);
      } else {
        // Fallback to demo signals
        setTradingSignals(mockTradingSignals);
      }
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      showNotification('Error loading data. Using local data.', 'warning');
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  };

  // Calculate trading statistics
  const calculateTradingStats = (trades) => {
    const today = new Date().toDateString();
    const todayTrades = trades.filter(t => new Date(t.timestamp).toDateString() === today);
    const completedTrades = trades.filter(t => t.status === 'CLOSED');
    const winningTrades = completedTrades.filter(t => t.pnl > 0);
    
    setTradingStats({
      todayPnl: todayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0),
      totalTrades: completedTrades.length,
      winRate: completedTrades.length > 0 ? (winningTrades.length / completedTrades.length * 100) : 0,
      totalPnl: completedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)
    });
  };

  // Start real-time market data updates
  const startMarketDataUpdates = () => {
    const updateMarketData = async () => {
      try {
        setLoading(prev => ({ ...prev, market: true }));
        const symbols = tradingAssets.map(asset => asset.symbol);
        const marketResult = await tradingAPI.getMarketData(symbols);
        
        if (marketResult.success) {
          setMarketData(marketResult.data);
          // Update current price if watching this asset
          if (marketResult.data[selectedAsset.symbol]) {
            setCurrentPrice(marketResult.data[selectedAsset.symbol].price);
            setPriceChange(marketResult.data[selectedAsset.symbol].change);
          }
        }
      } catch (error) {
        console.error('Error updating market data:', error);
      } finally {
        setLoading(prev => ({ ...prev, market: false }));
      }
    };

    // Update immediately and then every 5 seconds
    updateMarketData();
    const interval = setInterval(updateMarketData, 5000);
    
    return () => clearInterval(interval);
  };

  // Notification handler
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Enhanced form validation
  const validateTrade = () => {
    const errors = {};
    
    // Amount validation
    if (!tradeAmount || isNaN(tradeAmount) || tradeAmount <= 0) {
      errors.amount = 'Please enter a valid trade amount';
    } else if (tradeAmount > accountBalance) {
      errors.amount = 'Insufficient balance for this trade';
    } else if (tradeAmount < 10) {
      errors.amount = 'Minimum trade amount is $10';
    } else if (tradeAmount > 10000) {
      errors.amount = 'Maximum trade amount is $10,000';
    }
    
    // Check if market is open (simplified - should be real market hours)
    const now = new Date();
    const hour = now.getHours();
    if (selectedAsset.type === 'forex' && (hour < 6 || hour > 22)) {
      errors.market = 'Forex market is currently closed';
    }
    
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

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
      ipAddress: null, // Will be set by backend
      userAgent: navigator.userAgent,
      sessionId: localStorage.getItem('sessionId') || null,
      marketPrice: currentPrice,
      spread: 0.1, // Will be calculated by backend
      
      // Trading conditions
      leverage: selectedMultiplier.value,
      marginRequired: tradeAmount / selectedMultiplier.value,
      stopLoss: null, // Can be added later
      takeProfit: null // Can be added later
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

      // Step 2: Try to submit to backend API first
      let backendSuccess = false;
      let backendResponse = null;
      
      try {
        backendResponse = await tradingAPI.submitTrade(trade);
        
        if (backendResponse.success) {
          backendSuccess = true;
          showNotification(
            backendResponse.message || 'Trade executed successfully!',
            'success'
          );
        } else {
          throw new Error(backendResponse.message || 'Backend submission failed');
        }
        
      } catch (apiError) {
        console.warn('Backend API failed, using localStorage fallback:', apiError);
        backendSuccess = false;
      }
      
      // Step 3: Fallback to localStorage if backend fails (for development/demo)
      if (!backendSuccess) {
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
        
        // Update user balance (subtract margin requirement)
        const newBalance = accountBalance - trade.amount;
        setAccountBalance(newBalance);
        localStorage.setItem('userBalance', newBalance.toString());
        
        // Update local state
        setActiveTrades(prev => [localTradeData, ...prev]);
        
        showNotification(
          `${trade.type} ${trade.multiplierLabel} ${trade.symbol} trade opened successfully!`,
          'success'
        );
      }
      
      // Step 4: Close dialog and refresh data
      setConfirmDialog({ open: false, trade: null });
      await loadInitialData(); // Refresh data
      
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
      
      // Step 1: Try to close via backend API first
      let backendSuccess = false;
      let backendResponse = null;
      
      try {
        backendResponse = await tradingAPI.closeTrade(tradeId, closePrice);
        
        if (backendResponse.success) {
          backendSuccess = true;
          showNotification(
            backendResponse.message || 'Trade closed successfully!',
            'success'
          );
        } else {
          throw new Error(backendResponse.message || 'Backend close failed');
        }
        
      } catch (apiError) {
        console.warn('Backend API failed, using localStorage fallback:', apiError);
        backendSuccess = false;
      }
      
      // Step 2: Fallback to localStorage if backend fails
      if (!backendSuccess) {
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

        // Update balance (return initial amount + P&L)
        const newBalance = accountBalance + trade.amount + pnl;
        setAccountBalance(newBalance);
        localStorage.setItem('userBalance', newBalance.toString());

        // Update local state
        setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
        setTradeHistory(prev => [updatedTrade, ...prev]);

        showNotification(
          `Trade closed with ${pnl >= 0 ? 'profit' : 'loss'} of $${Math.abs(pnl).toFixed(2)}`,
          pnl >= 0 ? 'success' : 'warning'
        );
      }
      
      await loadInitialData(); // Refresh data and stats
      
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

  // Handle asset selection
  const handleAssetChange = (asset) => {
    setSelectedAsset(asset);
    setCurrentPrice(asset.price);
    setPriceChange(asset.change);
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
          direction="row"
          spacing={{ xs: 1, sm: 1.5, md: 2 }}
          alignItems="center"
          sx={{
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'center', sm: 'flex-end' },
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 1.5 },
            minWidth: 0
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
        mb: 3,
        overflow: 'visible'
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, maxHeight: '400px', overflowY: 'auto' }}>
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
                  {tradingAssets.filter(asset => asset.type === 'crypto').map((asset) => (
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
                  {tradingAssets.filter(asset => asset.type === 'forex').map((asset) => (
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
                  {tradingAssets.filter(asset => asset.type === 'stock').map((asset) => (
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
                  key={selectedAsset.tvSymbol}
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
              boxShadow: 6,
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 2, sm: 2.5, md: 3 },
              minHeight: { xs: 110, sm: 120, md: 130 },
              flexDirection: { xs: 'row', sm: 'row' }
            }}>
              <Box sx={{
                mr: { xs: 1.5, sm: 2, md: 2.5 },
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AccountBalanceWallet sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }, color: 'primary.main' }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                >
                  Account Balance
                </Typography>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="white"
                    sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' } }}
                  >
                    ${accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Available Balance
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Today's P&L
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    +$320.50
                  </Typography>
                </Stack>
              </Box>
            </Card>

            {/* Active Trades */}
            <Card sx={{
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6,
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 2, sm: 2.5, md: 3 },
              minHeight: { xs: 110, sm: 120, md: 130 },
              flexDirection: { xs: 'row', sm: 'row' }
            }}>
              <Box sx={{
                mr: { xs: 1.5, sm: 2, md: 2.5 },
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Timeline sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }, color: 'primary.main' }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ textAlign: 'center', py: 1 }}>
                    No active trades
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {activeTrades.slice(0, 2).map((trade) => (
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
                              {trade.symbol} {trade.multiplier}
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
                            sx={{ fontSize: '0.6rem', py: 0.25, px: 1, minWidth: 'auto' }}
                          >
                            Close
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            </Card>

            {/* Recent Trades */}
            <Card sx={{
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6,
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 2, sm: 2.5, md: 3 },
              minHeight: { xs: 110, sm: 120, md: 130 },
              flexDirection: { xs: 'row', sm: 'row' }
            }}>
              <Box sx={{
                mr: { xs: 1.5, sm: 2, md: 2.5 },
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <History sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }, color: 'primary.main' }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                >
                  Recent Trades
                </Typography>

                {tradeHistory.length === 0 ? (
                  <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ textAlign: 'center', py: 1 }}>
                    No recent trades
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {tradeHistory.slice(0, 2).map((trade) => (
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
                              {trade.symbol} {trade.multiplier}
                            </Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ fontSize: '0.7rem' }}>
                              {trade.type} • ${trade.amount}
                            </Typography>
                          </Box>
                          <Chip
                            label={trade.pnl > 0 ? 'PROFIT' : 'LOSS'}
                            color={trade.pnl > 0 ? 'success' : 'error'}
                            size="small"
                            sx={{ fontSize: '0.6rem', height: 20 }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ fontSize: '0.7rem' }}>
                            Exit: ${trade.exitPrice.toLocaleString()}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={trade.pnl > 0 ? 'success.main' : 'error.main'}
                            fontWeight={600}
                            sx={{ fontSize: '0.7rem' }}
                          >
                            {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
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
            onClick={submitTrade}
            variant="contained"
            color="primary"
            disabled={loading.trade}
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
