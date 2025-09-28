import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Stack,
  useTheme,
  Chip,
  Container,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Badge,
  Tabs,
  Tab,
  DatePicker,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Email,
  Settings,
  VerifiedUser,
  MonetizationOn,
  AccountBalance,
  Assignment,
  Schedule,
  TrendingUp,
  Security,
  Speed,
  Support,
  CheckCircle,
  Info,
  Warning,
  Business,
  Home,
  DirectionsCar,
  School,
  ShoppingCart,
  LocalHospital,
  Agriculture,
  Build,
  History,
  ExpandMore,
  ExpandLess,
  Cancel,
  AccessTime,
  Close,
  Search,
  FilterList,
  GetApp,
  Visibility,
  SwapHoriz,
  AccountBalanceWallet,
  CreditCard,
  Send,
  CallReceived,
  CallMade,
  Receipt,
  Print,
  FileDownload,
  AttachMoney,
  TrendingDown
} from '@mui/icons-material';

// Mock Transaction History Data
const mockTransactionHistory = [
  {
    id: 'TXN001',
    date: '2024-09-28',
    time: '14:35:22',
    type: 'deposit',
    category: 'Bank Transfer',
    description: 'Deposit via Bank Transfer',
    amount: 5000.00,
    balance: 15750.00,
    status: 'completed',
    reference: 'DEP-2024-001',
    method: 'Chase Bank ****1234',
    fee: 0.00,
    currency: 'USD'
  },
  {
    id: 'TXN002',
    date: '2024-09-27',
    time: '09:45:15',
    type: 'trade',
    category: 'Crypto Trading',
    description: 'BTC/USD Buy Order',
    amount: -2500.00,
    balance: 10750.00,
    status: 'completed',
    reference: 'TRD-2024-089',
    method: 'Spot Trading',
    fee: 12.50,
    currency: 'USD',
    tradingPair: 'BTC/USD',
    quantity: 0.0385,
    price: 64935.00
  },
  {
    id: 'TXN003',
    date: '2024-09-26',
    time: '16:22:08',
    type: 'withdrawal',
    category: 'Bank Transfer',
    description: 'Withdrawal to Bank Account',
    amount: -1200.00,
    balance: 13250.00,
    status: 'pending',
    reference: 'WTH-2024-045',
    method: 'Bank of America ****5678',
    fee: 15.00,
    currency: 'USD'
  },
  {
    id: 'TXN004',
    date: '2024-09-25',
    time: '11:18:33',
    type: 'trade',
    category: 'Forex Trading',
    description: 'EUR/USD Sell Order',
    amount: 875.50,
    balance: 14450.00,
    status: 'completed',
    reference: 'TRD-2024-088',
    method: 'Forex Trading',
    fee: 8.75,
    currency: 'USD',
    tradingPair: 'EUR/USD',
    quantity: 10000,
    price: 1.0876
  },
  {
    id: 'TXN005',
    date: '2024-09-24',
    time: '13:05:41',
    type: 'deposit',
    category: 'Card Payment',
    description: 'Deposit via Credit Card',
    amount: 3000.00,
    balance: 13574.50,
    status: 'completed',
    reference: 'DEP-2024-002',
    method: 'Visa ****9876',
    fee: 45.00,
    currency: 'USD'
  },
  {
    id: 'TXN006',
    date: '2024-09-23',
    time: '08:30:12',
    type: 'trade',
    category: 'Stock Trading',
    description: 'AAPL Stock Purchase',
    amount: -2250.00,
    balance: 10574.50,
    status: 'completed',
    reference: 'TRD-2024-087',
    method: 'Stock Trading',
    fee: 5.00,
    currency: 'USD',
    tradingPair: 'AAPL',
    quantity: 15,
    price: 150.00
  },
  {
    id: 'TXN007',
    date: '2024-09-22',
    time: '19:42:55',
    type: 'withdrawal',
    category: 'Crypto Transfer',
    description: 'ETH Withdrawal to Wallet',
    amount: -1500.00,
    balance: 12824.50,
    status: 'failed',
    reference: 'WTH-2024-046',
    method: 'External Wallet',
    fee: 25.00,
    currency: 'USD',
    failureReason: 'Invalid wallet address'
  },
  {
    id: 'TXN008',
    date: '2024-09-21',
    time: '15:15:27',
    type: 'dividend',
    category: 'Investment Income',
    description: 'MSFT Dividend Payment',
    amount: 125.80,
    balance: 14324.50,
    status: 'completed',
    reference: 'DIV-2024-012',
    method: 'Dividend Payout',
    fee: 0.00,
    currency: 'USD'
  },
  {
    id: 'TXN009',
    date: '2024-09-20',
    time: '12:08:19',
    type: 'fee',
    category: 'Platform Fee',
    description: 'Monthly Account Maintenance',
    amount: -25.00,
    balance: 14198.70,
    status: 'completed',
    reference: 'FEE-2024-009',
    method: 'Account Deduction',
    fee: 0.00,
    currency: 'USD'
  },
  {
    id: 'TXN010',
    date: '2024-09-19',
    time: '10:33:41',
    type: 'trade',
    category: 'Crypto Trading',
    description: 'ETH/USD Buy Order',
    amount: -1800.00,
    balance: 14223.70,
    status: 'completed',
    reference: 'TRD-2024-086',
    method: 'Spot Trading',
    fee: 9.00,
    currency: 'USD',
    tradingPair: 'ETH/USD',
    quantity: 0.75,
    price: 2400.00
  }
];

export default function AccountHistory() {
  const theme = useTheme();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentTab, setCurrentTab] = useState(0);

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    switch(newValue) {
      case 0:
        setFilterType('all');
        break;
      case 1:
        setFilterType('trade');
        break;
      case 2:
        setFilterType('deposit');
        break;
      case 3:
        setFilterType('withdrawal');
        break;
      default:
        setFilterType('all');
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <CallReceived sx={{ color: 'success.main' }} />;
      case 'withdrawal':
        return <CallMade sx={{ color: 'error.main' }} />;
      case 'trade':
        return <SwapHoriz sx={{ color: 'info.main' }} />;
      case 'dividend':
        return <AttachMoney sx={{ color: 'success.main' }} />;
      case 'fee':
        return <Receipt sx={{ color: 'warning.main' }} />;
      default:
        return <History sx={{ color: 'primary.main' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'pending':
        return <AccessTime />;
      case 'failed':
        return <Cancel />;
      default:
        return <Info />;
    }
  };

  const filteredTransactions = mockTransactionHistory.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // Calculate summary statistics
  const totalDeposits = mockTransactionHistory
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawals = mockTransactionHistory
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const totalTrades = mockTransactionHistory.filter(t => t.type === 'trade').length;

  const currentBalance = mockTransactionHistory[0]?.balance || 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Container maxWidth="xl" sx={{ p: { xs: 1, sm: 3 } }}>
        {/* Header matching the style from other pages */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3, 
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
              label="KYC Verified" 
              color="success" 
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
              startIcon={<FileDownload sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
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
              Export
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<Print sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
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
              Print
            </Button>
            <Button 
              variant="contained" 
              color="info" 
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
              Support
            </Button>
          </Stack>
        </Box>

        {/* Account Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ bgcolor: '#232742', color: '#fff', borderRadius: 3 }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <AccountBalanceWallet sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  ${currentBalance.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Current Balance
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ bgcolor: '#232742', color: '#fff', borderRadius: 3 }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <CallReceived sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  ${totalDeposits.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Total Deposits
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ bgcolor: '#232742', color: '#fff', borderRadius: 3 }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <CallMade sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  ${totalWithdrawals.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Total Withdrawals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ bgcolor: '#232742', color: '#fff', borderRadius: 3 }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <SwapHoriz sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {totalTrades}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Total Trades
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Transaction History Table */}
          <Grid item xs={12}>
            <Card sx={{
              bgcolor: '#232742',
              color: '#fff',
              borderRadius: 3,
              boxShadow: 6,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 }
                }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    Account History
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                      size="small"
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: 'rgba(255,255,255,0.7)' }} />
                          </InputAdornment>
                        ),
                        sx: { color: '#fff', minWidth: 250 }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: 'primary.main' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        }
                      }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Status</InputLabel>
                      <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        label="Status"
                        sx={{
                          color: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                        }}
                        MenuProps={{
                          PaperProps: { sx: { bgcolor: '#232742', color: '#fff' } }
                        }}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {/* Transaction Type Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 3 }}>
                  <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange}
                    sx={{
                      '& .MuiTab-root': {
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 600
                      },
                      '& .MuiTab-root.Mui-selected': {
                        color: 'primary.main'
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: 'primary.main'
                      }
                    }}
                  >
                    <Tab label="All Transactions" />
                    <Tab label="Trades" />
                    <Tab label="Deposits" />
                    <Tab label="Withdrawals" />
                  </Tabs>
                </Box>

                {/* Transactions Table */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date & Time</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Transaction</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Amount</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Balance</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow 
                          key={transaction.id}
                          sx={{ 
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                            borderBottom: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {new Date(transaction.date).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" color="rgba(255,255,255,0.6)">
                                {transaction.time}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              {getTransactionIcon(transaction.type)}
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {transaction.description}
                                </Typography>
                                <Typography variant="caption" color="rgba(255,255,255,0.6)">
                                  {transaction.reference}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              fontWeight={700}
                              color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                            >
                              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                            </Typography>
                            {transaction.fee > 0 && (
                              <Typography variant="caption" color="rgba(255,255,255,0.6)">
                                Fee: ${transaction.fee}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>
                            ${transaction.balance.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(transaction.status)}
                              label={transaction.status.toUpperCase()}
                              color={getStatusColor(transaction.status)}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleViewTransaction(transaction)}
                              sx={{ color: 'primary.main' }}
                              size="small"
                            >
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {filteredTransactions.length === 0 && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    bgcolor: 'rgba(255,255,255,0.02)',
                    borderRadius: 2,
                    mt: 2
                  }}>
                    <History sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                    <Typography variant="h6" color="rgba(255,255,255,0.6)">
                      No transactions found
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.4)">
                      Try adjusting your filters or search criteria
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Transaction Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#232742',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'primary.main', 
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {selectedTransaction && getTransactionIcon(selectedTransaction.type)}
            Transaction Details
          </Box>
          <IconButton onClick={() => setDialogOpen(false)} sx={{ color: '#fff' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedTransaction && (
            <Box sx={{ p: 3 }}>
              {/* Transaction Summary */}
              <Paper sx={{ 
                p: 3, 
                mb: 3, 
                bgcolor: 'rgba(0, 179, 134, 0.1)',
                border: '1px solid rgba(0, 179, 134, 0.3)',
                borderRadius: 2
              }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {selectedTransaction.description}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.8)">
                      Reference: {selectedTransaction.reference}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Typography 
                      variant="h4" 
                      fontWeight="bold"
                      color={selectedTransaction.amount > 0 ? 'success.main' : 'error.main'}
                    >
                      {selectedTransaction.amount > 0 ? '+' : ''}${Math.abs(selectedTransaction.amount).toLocaleString()}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(selectedTransaction.status)}
                      label={selectedTransaction.status.toUpperCase()}
                      color={getStatusColor(selectedTransaction.status)}
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Transaction Details */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Transaction Information
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Date & Time</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(selectedTransaction.date).toLocaleDateString()} at {selectedTransaction.time}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Category</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedTransaction.category}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Method</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedTransaction.method}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Currency</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedTransaction.currency}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Financial Details
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Amount</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedTransaction.amount > 0 ? '+' : ''}${Math.abs(selectedTransaction.amount).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Fee</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ${selectedTransaction.fee.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Balance After</Typography>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        ${selectedTransaction.balance.toLocaleString()}
                      </Typography>
                    </Box>
                    {selectedTransaction.tradingPair && (
                      <>
                        <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">Trading Pair</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedTransaction.tradingPair}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">Quantity</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedTransaction.quantity}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">Price</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            ${selectedTransaction.price?.toLocaleString()}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Paper>
                </Grid>

                {/* Failure Reason for Failed Transactions */}
                {selectedTransaction.status === 'failed' && selectedTransaction.failureReason && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      <Typography variant="body2">
                        <strong>Failure Reason:</strong> {selectedTransaction.failureReason}
                      </Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 3 }}>
          <Button 
            onClick={() => setDialogOpen(false)} 
            variant="outlined" 
            color="inherit"
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Print />}
          >
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
