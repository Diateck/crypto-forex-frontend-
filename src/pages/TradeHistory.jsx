import React, { useState } from 'react';
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
  Tooltip
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
  AttachMoney
} from '@mui/icons-material';

// Mock transaction data
const mockTransactions = [
  {
    id: 'TXN001',
    date: '2024-03-15',
    time: '14:30:25',
    type: 'Deposit',
    description: 'Bitcoin Deposit',
    amount: '+$1,500.00',
    status: 'Completed',
    balance: '$12,500.00',
    reference: 'DEP-BTC-001'
  },
  {
    id: 'TXN002',
    date: '2024-03-14',
    time: '09:15:42',
    type: 'Trade',
    description: 'BTC/USDT Buy Order',
    amount: '-$850.00',
    status: 'Completed',
    balance: '$11,000.00',
    reference: 'TRD-BTC-002'
  },
  {
    id: 'TXN003',
    date: '2024-03-14',
    time: '08:22:17',
    type: 'Withdrawal',
    description: 'Ethereum Withdrawal',
    amount: '-$750.00',
    status: 'Pending',
    balance: '$11,850.00',
    reference: 'WTD-ETH-003'
  },
  {
    id: 'TXN004',
    date: '2024-03-13',
    time: '16:45:33',
    type: 'Trade',
    description: 'EUR/USD Position Close',
    amount: '+$320.50',
    status: 'Completed',
    balance: '$12,600.00',
    reference: 'TRD-EUR-004'
  },
  {
    id: 'TXN005',
    date: '2024-03-12',
    time: '11:20:08',
    type: 'Deposit',
    description: 'Wire Transfer',
    amount: '+$2,000.00',
    status: 'Completed',
    balance: '$12,279.50',
    reference: 'DEP-WIRE-005'
  },
  {
    id: 'TXN006',
    date: '2024-03-11',
    time: '13:15:22',
    type: 'Trade',
    description: 'AAPL Stock Purchase',
    amount: '-$1,200.00',
    status: 'Completed',
    balance: '$10,279.50',
    reference: 'TRD-AAPL-006'
  },
  {
    id: 'TXN007',
    date: '2024-03-10',
    time: '10:30:15',
    type: 'Bonus',
    description: 'Welcome Bonus',
    amount: '+$100.00',
    status: 'Completed',
    balance: '$11,479.50',
    reference: 'BON-WEL-007'
  },
  {
    id: 'TXN008',
    date: '2024-03-09',
    time: '15:45:30',
    type: 'Withdrawal',
    description: 'Bank Transfer',
    amount: '-$500.00',
    status: 'Failed',
    balance: '$11,379.50',
    reference: 'WTD-BANK-008'
  }
];

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
    case 'Completed': return 'success';
    case 'Pending': return 'warning';
    case 'Failed': return 'error';
    default: return 'default';
  }
};

export default function AccountHistory() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter transactions based on search and filters
  const filteredTransactions = mockTransactions.filter(transaction => {
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
              Username: <span style={{ color: theme.palette.primary.main }}>theophilus</span>
            </Typography>
          </Box>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Chip icon={<VerifiedUser />} label="KYC" color="primary" variant="outlined" />
          <Button variant="contained" color="primary" startIcon={<Email />} size="small">
            Mail Us
          </Button>
          <Button variant="contained" color="secondary" startIcon={<Settings />} size="small">
            Settings
          </Button>
        </Stack>
      </Box>

      {/* Page Title and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Account History
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View your complete transaction and trading history
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="outlined" startIcon={<Refresh />} size="small">
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Download />} size="small">
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
                    $4,120.50
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
                    $1,250.00
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
                    24
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
                    $12,500.00
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Current Balance
                  </Typography>
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
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { color: '#fff', borderColor: 'rgba(255,255,255,0.1)' } }}>
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 700, bgcolor: 'rgba(255,255,255,0.05)' } }}>
                <TableCell>Date & Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell align="right">Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                  <TableCell>
                    <Box>
                      <Typography color="#fff" fontWeight={600}>
                        {transaction.date}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        {transaction.time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTypeIcon(transaction.type)}
                      <Typography color="#fff" fontWeight={600}>
                        {transaction.type}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color="#fff">
                      {transaction.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      color={transaction.amount.startsWith('+') ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {transaction.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="rgba(255,255,255,0.8)">
                      {transaction.reference}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="#fff" fontWeight={600}>
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
            '& .MuiTablePagination-toolbar': { color: '#fff' },
            '& .MuiTablePagination-selectLabel': { color: '#fff' },
            '& .MuiTablePagination-displayedRows': { color: '#fff' },
            '& .MuiTablePagination-select': { color: '#fff' },
            '& .MuiIconButton-root': { color: '#fff' }
          }}
        />
      </Card>
    </Box>
  );
}
