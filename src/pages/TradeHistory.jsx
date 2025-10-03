import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Button,
  Stack,
  useTheme,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Divider,
  TablePagination,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Person,
  Email,
  Settings,
  VerifiedUser,
  Search,
  FilterList,
  Download,
  Refresh,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  SwapHoriz,
  CreditCard,
  AttachMoney,
  History,
  CalendarToday
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useBalance } from '../contexts/BalanceContext';
import { useNotifications } from '../contexts/NotificationContext';
import { getUserKYCLabel, getUserKYCColor } from '../utils/userStatus';
import useLiveTrading from '../hooks/useLiveTrading';

// Backend API configuration
const API_BASE_URL = 'https://crypto-forex-backend-9mme.onrender.com/api';

// API functions for comprehensive activity data
const activityAPI = {
  // Get all user activities (trades, deposits, withdrawals)
  getAllActivities: async (userId) => {
    try {
      const [tradesResponse, depositsResponse, withdrawalsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/trading/history/${userId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        }),
        fetch(`${API_BASE_URL}/deposits/history/${userId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        }),
        fetch(`${API_BASE_URL}/withdrawals/history/${userId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        })
      ]);

      const results = await Promise.all([
        tradesResponse.ok ? tradesResponse.json() : { success: false },
        depositsResponse.ok ? depositsResponse.json() : { success: false },
        withdrawalsResponse.ok ? withdrawalsResponse.json() : { success: false }
      ]);

      return {
        success: true,
        data: {
          trades: results[0].success ? results[0].data : [],
          deposits: results[1].success ? results[1].data : [],
          withdrawals: results[2].success ? results[2].data : []
        }
      };
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Transform activities into unified transaction format
const transformToTransactions = (activities, balance) => {
  const transactions = [];

  // Transform trades
  activities.trades?.forEach(trade => {
    transactions.push({
      id: trade.id || `TRD-${Date.now()}`,
      date: new Date(trade.createdAt || trade.timestamp).toLocaleDateString(),
      time: new Date(trade.createdAt || trade.timestamp).toLocaleTimeString(),
      type: 'Trade',
      description: `${trade.type} ${trade.multiplierLabel || ''} ${trade.symbol}`,
      amount: trade.status === 'CLOSED' 
        ? (trade.realizedPnl >= 0 ? `+$${trade.realizedPnl.toFixed(2)}` : `-$${Math.abs(trade.realizedPnl).toFixed(2)}`)
        : `-$${trade.amount.toFixed(2)}`,
      status: trade.status === 'ACTIVE' ? 'Open' : 'Closed',
      balance: `$${balance.toFixed(2)}`,
      reference: `TRD-${trade.symbol}-${trade.id?.slice(-6) || '000'}`,
      originalData: trade
    });
  });

  // Transform deposits
  activities.deposits?.forEach(deposit => {
    transactions.push({
      id: deposit.id || `DEP-${Date.now()}`,
      date: new Date(deposit.createdAt || deposit.timestamp).toLocaleDateString(),
      time: new Date(deposit.createdAt || deposit.timestamp).toLocaleTimeString(),
      type: 'Deposit',
      description: `${deposit.method || 'Deposit'} - ${deposit.amount}`,
      amount: `+$${deposit.amount.toFixed(2)}`,
      status: deposit.status === 'approved' ? 'Completed' : 
              deposit.status === 'pending' ? 'Pending' : 'Failed',
      balance: `$${balance.toFixed(2)}`,
      reference: `DEP-${deposit.method?.slice(0,3).toUpperCase() || 'GEN'}-${deposit.id?.slice(-6) || '000'}`,
      originalData: deposit
    });
  });

  // Transform withdrawals
  activities.withdrawals?.forEach(withdrawal => {
    transactions.push({
      id: withdrawal.id || `WTD-${Date.now()}`,
      date: new Date(withdrawal.createdAt || withdrawal.timestamp).toLocaleDateString(),
      time: new Date(withdrawal.createdAt || withdrawal.timestamp).toLocaleTimeString(),
      type: 'Withdrawal',
      description: `${withdrawal.method || 'Withdrawal'} - ${withdrawal.amount}`,
      amount: `-$${withdrawal.amount.toFixed(2)}`,
      status: withdrawal.status === 'completed' ? 'Completed' : 
              withdrawal.status === 'pending' ? 'Pending' : 'Failed',
      balance: `$${balance.toFixed(2)}`,
      reference: `WTD-${withdrawal.method?.slice(0,3).toUpperCase() || 'GEN'}-${withdrawal.id?.slice(-6) || '000'}`,
      originalData: withdrawal
    });
  });

  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
  
  return transactions;
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'Deposit': return <TrendingUp color="success" />;
    case 'Withdrawal': return <TrendingDown color="error" />;
    case 'Trade': return <SwapHoriz color="primary" />;
    case 'Bonus': return <AttachMoney color="warning" />;
    default: return <AccountBalanceWallet color="info" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
    case 'Closed': return 'success';
    case 'Pending':
    case 'Open': return 'warning';
    case 'Failed': return 'error';
    default: return 'default';
  }
};

export default function AccountHistory() {
  const theme = useTheme();
  const { user } = useUser();
  const { balance, refreshBalance } = useBalance();
  const { addNotification } = useNotifications();
  
  // Use live trading hook for real-time data
  const {
    activeTrades,
    tradeHistory,
    tradingStats,
    isLive,
    lastUpdated,
    loading: tradingLoading,
    error: tradingError,
    refreshData
  } = useLiveTrading(user?.id, 15000);

  // Local state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allActivities, setAllActivities] = useState({
    trades: [],
    deposits: [],
    withdrawals: []
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityStats, setActivityStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalTrades: 0,
    currentBalance: 0
  });

  // Load all activities from backend and localStorage
  const loadAllActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      let activities = {
        trades: [],
        deposits: [],
        withdrawals: []
      };

      // Try to load from backend first
      if (user?.id) {
        const backendResult = await activityAPI.getAllActivities(user.id);
        if (backendResult.success) {
          activities = backendResult.data;
        }
      }

      // Fallback to localStorage data
      if (!activities.trades.length) {
        activities.trades = [
          ...JSON.parse(localStorage.getItem('userTradeHistory') || '[]'),
          ...activeTrades.map(trade => ({ ...trade, status: 'ACTIVE' }))
        ];
      }

      if (!activities.deposits.length) {
        activities.deposits = JSON.parse(localStorage.getItem('userDeposits') || '[]');
      }

      if (!activities.withdrawals.length) {
        activities.withdrawals = JSON.parse(localStorage.getItem('userWithdrawals') || '[]');
      }

      setAllActivities(activities);

      // Transform to unified transaction format
      const unifiedTransactions = transformToTransactions(activities, balance);
      setTransactions(unifiedTransactions);

      // Calculate activity statistics
      calculateActivityStats(activities);

    } catch (error) {
      console.error('Error loading activities:', error);
      setError('Failed to load activity data');
      addNotification({
        message: 'Error loading activity history',
        type: 'error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate activity statistics
  const calculateActivityStats = (activities) => {
    const stats = {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalTrades: 0,
      currentBalance: balance
    };

    // Calculate deposits total
    activities.deposits?.forEach(deposit => {
      if (deposit.status === 'approved' || deposit.status === 'completed') {
        stats.totalDeposits += parseFloat(deposit.amount || 0);
      }
    });

    // Calculate withdrawals total
    activities.withdrawals?.forEach(withdrawal => {
      if (withdrawal.status === 'completed') {
        stats.totalWithdrawals += parseFloat(withdrawal.amount || 0);
      }
    });

    // Count total trades
    stats.totalTrades = activities.trades?.length || 0;

    setActivityStats(stats);
  };

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadAllActivities();
  }, [user?.id, balance, activeTrades, tradeHistory]);

  // Refresh data function
  const handleRefresh = async () => {
    await Promise.all([
      loadAllActivities(),
      refreshData(),
      refreshBalance()
    ]);
    
    addNotification({
      message: 'Activity history refreshed',
      type: 'success',
      timestamp: new Date().toISOString()
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === '' || transaction.type === filterType;
    const matchesStatus = filterStatus === '' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get current page transactions
  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, minHeight: '100vh' }}>
      {/* Loading indicator */}
      {(loading || tradingLoading) && (
        <LinearProgress 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 9999,
            height: 3,
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4CAF50'
            }
          }} 
        />
      )}

      {/* Error Alert */}
      {(error || tradingError) && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error || tradingError} - Using available data.
        </Alert>
      )}

      {/* Header with site name, username and quick actions */}
      {/* Header with site name, username and quick actions - matching Dashboard */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 3, 
        bgcolor: '#232742', 
        p: 2, 
        borderRadius: 3, 
        boxShadow: 3,
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 0 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <Person fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={900} color={theme.palette.primary.main}>
              Elon Investment Broker
            </Typography>
            <Typography variant="h6" fontWeight={700} color="#fff">
              Username: <span style={{ color: theme.palette.primary.main }}>{user?.name || user?.username || 'Not Available'}</span>
            </Typography>
            {!isLive && (
              <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 0.5 }}>
                Offline Mode
              </Typography>
            )}
          </Box>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Chip icon={<VerifiedUser />} label={getUserKYCLabel(user)} color={getUserKYCColor(user)} variant="outlined" />
          <Button variant="contained" color="primary" startIcon={<Email />} size="small">
            Mail Us
          </Button>
          <Button variant="contained" color="secondary" startIcon={<Settings />} size="small">
            Settings
          </Button>
        </Stack>
      </Box>

      {/* Page Title and Actions */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant={{ xs: 'h5', sm: 'h4' }} gutterBottom fontWeight="bold" color="primary">
            Account History
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View your complete transaction and trading history
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />} 
            size="small" 
            fullWidth={{ xs: true, sm: false }}
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="contained" startIcon={<Download />} size="small" fullWidth={{ xs: true, sm: false }}>
            Export
          </Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
            borderRadius: 3,
            boxShadow: 6,
            color: '#fff'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    ${activityStats.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Total Deposits
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
            borderRadius: 3,
            boxShadow: 6,
            color: '#fff'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingDown color="error" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    ${activityStats.totalWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Total Withdrawals
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
            borderRadius: 3,
            boxShadow: 6,
            color: '#fff'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SwapHoriz color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    {activityStats.totalTrades}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Total Trades
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
            borderRadius: 3,
            boxShadow: 6,
            color: '#fff'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccountBalanceWallet color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="#fff">
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Current Balance
                  </Typography>
                  {lastUpdated && (
                    <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ display: 'block', mt: 0.5 }}>
                      Updated: {new Date(lastUpdated).toLocaleTimeString()}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ 
        background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
        borderRadius: 3,
        boxShadow: 6,
        mb: 3
      }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiOutlinedInput-input': { color: '#fff' },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                    '& .MuiSelect-select': { color: '#fff' },
                    '& .MuiSvgIcon-root': { color: '#fff' }
                  }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Deposit">Deposit</MenuItem>
                  <MenuItem value="Withdrawal">Withdrawal</MenuItem>
                  <MenuItem value="Trade">Trade</MenuItem>
                  <MenuItem value="Bonus">Bonus</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                    '& .MuiSelect-select': { color: '#fff' },
                    '& .MuiSvgIcon-root': { color: '#fff' }
                  }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setFilterType('');
                  setFilterStatus('');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card sx={{ 
        background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
        borderRadius: 3,
        boxShadow: 6
      }}>
        <TableContainer sx={{ 
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-track': { bgcolor: 'rgba(255,255,255,0.1)' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.main', borderRadius: 4 }
        }}>
          <Table sx={{ 
            '& .MuiTableCell-root': { 
              color: '#fff', 
              borderColor: 'rgba(255,255,255,0.1)',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              padding: { xs: '8px', sm: '16px' }
            },
            minWidth: 800
          }}>
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 700, bgcolor: 'rgba(255,255,255,0.05)' } }}>
                <TableCell>Date & Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Reference</TableCell>
                <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                  <TableCell>
                    <Box>
                      <Typography color="#fff" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {transaction.date}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                        {transaction.time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTypeIcon(transaction.type)}
                      <Typography color="#fff" fontWeight={600} sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        display: { xs: 'none', sm: 'block' }
                      }}>
                        {transaction.type}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Typography color="#fff" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {transaction.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      color={transaction.amount.startsWith('+') ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {transaction.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                      size="small"
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '0.6rem', sm: '0.75rem' },
                        height: { xs: 20, sm: 24 }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                      {transaction.reference}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Typography color="#fff" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {transaction.balance}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <TablePagination
          component="div"
          count={filteredTransactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-toolbar': { 
              color: '#fff',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 16px', sm: '16px' }
            },
            '& .MuiTablePagination-selectLabel': { color: '#fff', fontSize: { xs: '0.75rem', sm: '0.875rem' } },
            '& .MuiTablePagination-displayedRows': { color: '#fff', fontSize: { xs: '0.75rem', sm: '0.875rem' } },
            '& .MuiTablePagination-select': { color: '#fff', fontSize: { xs: '0.75rem', sm: '0.875rem' } },
            '& .MuiIconButton-root': { color: '#fff', padding: { xs: '4px', sm: '8px' } }
          }}
        />
      </Card>
    </Box>
  );
}
