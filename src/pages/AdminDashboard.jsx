import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Grid,
  Divider,
  Stack,
  Tabs,
  Tab,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  CheckCircle,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminIcon,
  AccountBalance as DepositIcon,
  AccountBalanceWallet as WithdrawIcon,
  PendingActions as PendingIcon,
  TrendingUp as TrendingIcon,
  Menu as MenuIcon,
  ContactMail as ContactMailIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import AdminContactManager from '../components/AdminContactManager';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

// Deposit Management Component
function DepositManagement() {
  const theme = useTheme();
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', deposit: null });
  const [actionReason, setActionReason] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [stats, setStats] = useState({
    totalPending: 0,
    totalAmount: 0,
    todayDeposits: 0
  });

  // Load pending deposits from localStorage
  useEffect(() => {
    loadPendingDeposits();
    const interval = setInterval(loadPendingDeposits, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPendingDeposits = () => {
    try {
      const deposits = JSON.parse(localStorage.getItem('pendingDeposits') || '[]');
      const pendingOnly = deposits.filter(d => d.status === 'pending');
      setPendingDeposits(pendingOnly);
      
      // Calculate stats
      const totalAmount = pendingOnly.reduce((sum, d) => sum + d.amount, 0);
      const today = new Date().toDateString();
      const todayDeposits = pendingOnly.filter(d => 
        new Date(d.submittedAt).toDateString() === today
      ).length;
      
      setStats({
        totalPending: pendingOnly.length,
        totalAmount: totalAmount,
        todayDeposits: todayDeposits
      });
    } catch (error) {
      console.error('Error loading deposits:', error);
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleAction = (deposit, action) => {
    setActionDialog({ open: true, type: action, deposit });
    setActionReason('');
  };

  const confirmAction = async () => {
    const { type, deposit } = actionDialog;
    
    try {
      // Update deposit status
      const allDeposits = JSON.parse(localStorage.getItem('pendingDeposits') || '[]');
      const updatedDeposits = allDeposits.map(d => 
        d.id === deposit.id 
          ? { 
              ...d, 
              status: type,
              processedAt: new Date().toISOString(),
              adminNotes: actionReason,
              processedBy: 'Admin'
            }
          : d
      );
      
      localStorage.setItem('pendingDeposits', JSON.stringify(updatedDeposits));
      
      // Add to user's transaction history with status update
      const userTransactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
      const transactionUpdate = {
        id: `txn_${Date.now()}`,
        type: 'deposit',
        amount: deposit.amount,
        currency: deposit.currency || 'USD',
        status: type,
        method: deposit.method,
        date: new Date().toISOString(),
        description: `Deposit ${type} - ${deposit.method}`,
        adminNotes: actionReason,
        originalDepositId: deposit.id
      };
      
      userTransactions.push(transactionUpdate);
      localStorage.setItem('userTransactions', JSON.stringify(userTransactions));
      
      // If approved, update user balance (simulate)
      if (type === 'approved') {
        const userBalance = JSON.parse(localStorage.getItem('userBalance') || '{"balance": 0}');
        userBalance.balance += deposit.amount;
        userBalance.lastUpdated = new Date().toISOString();
        localStorage.setItem('userBalance', JSON.stringify(userBalance));
      }
      
      // Send notification to user dashboard
      const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
      const notification = {
        id: `notif_${Date.now()}`,
        type: 'deposit_update',
        title: `Deposit ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        message: `Your ${deposit.method} deposit of ${deposit.currency || 'USD'} ${deposit.amount} has been ${type}.`,
        timestamp: new Date().toISOString(),
        read: false,
        severity: type === 'approved' ? 'success' : 'error'
      };
      
      userNotifications.unshift(notification);
      localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
      
      loadPendingDeposits();
      setActionDialog({ open: false, type: '', deposit: null });
      showNotification(
        `Deposit ${type} successfully! User has been notified.`, 
        type === 'approved' ? 'success' : 'info'
      );
      
    } catch (error) {
      console.error('Error processing action:', error);
      showNotification('Error processing request. Please try again.', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount, currency = 'USD') => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: '#232742', 
            color: '#fff',
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <PendingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {stats.totalPending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Deposits
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: '#232742', 
            color: '#fff',
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <DepositIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700} color="success.main">
                    ${stats.totalAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Pending Amount
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: '#232742', 
            color: '#fff',
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <TrendingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {stats.todayDeposits}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Deposits
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Deposits Table */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge badgeContent={stats.totalPending} color="warning">
                <PendingIcon color="primary" />
              </Badge>
              Pending Deposits
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadPendingDeposits}
              sx={{ fontWeight: 600 }}
            >
              Refresh
            </Button>
          </Box>
          
          {pendingDeposits.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No pending deposits at the moment.
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell><strong>Method</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Submitted</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingDeposits.map((deposit) => (
                    <TableRow key={deposit.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                      <TableCell>
                        <Box>
                          <Typography fontWeight={600}>{deposit.userName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {deposit.userEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography fontWeight={500}>{deposit.method}</Typography>
                          {deposit.walletAddress && (
                            <Typography variant="caption" color="text.secondary">
                              {deposit.walletAddress.substring(0, 20)}...
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600} color="primary.main">
                          {formatAmount(deposit.amount, deposit.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(deposit.submittedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={deposit.status.toUpperCase()} 
                          color="warning" 
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => setSelectedDeposit(deposit)}
                              color="info"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Approve">
                            <IconButton 
                              size="small" 
                              onClick={() => handleAction(deposit, 'approved')}
                              color="success"
                            >
                              <ApproveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton 
                              size="small" 
                              onClick={() => handleAction(deposit, 'rejected')}
                              color="error"
                            >
                              <RejectIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      {selectedDeposit && (
        <Dialog 
          open={Boolean(selectedDeposit)} 
          onClose={() => setSelectedDeposit(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={700}>
              Deposit Details
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">User Name</Typography>
                  <Typography fontWeight={600}>{selectedDeposit.userName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography fontWeight={600}>{selectedDeposit.userEmail}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Method</Typography>
                  <Typography fontWeight={600}>{selectedDeposit.method}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                  <Typography fontWeight={600} color="primary.main">
                    {formatAmount(selectedDeposit.amount, selectedDeposit.currency)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Wallet Address</Typography>
                  <Typography fontWeight={500} sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                    {selectedDeposit.walletAddress || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                  <Typography>{selectedDeposit.notes || 'No additional notes'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Submitted At</Typography>
                  <Typography>{formatDate(selectedDeposit.submittedAt)}</Typography>
                </Grid>
                {selectedDeposit.proofFile && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Payment Proof</Typography>
                    <Typography color="primary.main">{selectedDeposit.proofFile}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedDeposit(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: '', deposit: null })}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            {actionDialog.type === 'approved' ? 'Approve' : 'Reject'} Deposit
          </Typography>
        </DialogTitle>
        <DialogContent>
          {actionDialog.deposit && (
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ mb: 2 }}>
                Are you sure you want to <strong>{actionDialog.type}</strong> this deposit from{' '}
                <strong>{actionDialog.deposit.userName}</strong> for{' '}
                <strong>{formatAmount(actionDialog.deposit.amount, actionDialog.deposit.currency)}</strong>?
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Admin Notes (Optional)"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Add any notes for this action..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, type: '', deposit: null })}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            color={actionDialog.type === 'approved' ? 'success' : 'error'}
            sx={{ fontWeight: 600 }}
          >
            {actionDialog.type === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Withdrawal Management Component
function WithdrawalManagement() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Load withdrawals from localStorage (backend fallback)
  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = () => {
    const pendingWithdrawals = JSON.parse(localStorage.getItem('pendingWithdrawals') || '[]');
    setWithdrawals(pendingWithdrawals);
  };

  const handleApproveWithdrawal = async (withdrawal) => {
    try {
      setLoading(true);
      
      // Update withdrawal status
      const updatedWithdrawal = {
        ...withdrawal,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        adminNotes: 'Approved by admin'
      };

      // Update pending withdrawals
      const allWithdrawals = JSON.parse(localStorage.getItem('pendingWithdrawals') || '[]');
      const updatedWithdrawals = allWithdrawals.map(w => 
        w.id === withdrawal.id ? updatedWithdrawal : w
      );
      localStorage.setItem('pendingWithdrawals', JSON.stringify(updatedWithdrawals));

      // Update user's withdrawal history
      const userWithdrawals = JSON.parse(localStorage.getItem('userWithdrawals') || '[]');
      const updatedUserWithdrawals = userWithdrawals.map(w => 
        w.id === withdrawal.id ? updatedWithdrawal : w
      );
      localStorage.setItem('userWithdrawals', JSON.stringify(updatedUserWithdrawals));

      // Store notification for user dashboard
      const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
      notifications.push({
        id: Date.now(),
        type: 'withdrawal_approved',
        title: 'Withdrawal Approved',
        message: `Your withdrawal of $${withdrawal.amount.toLocaleString()} has been approved and is being processed.`,
        timestamp: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('userNotifications', JSON.stringify(notifications));

      loadWithdrawals();
      setNotification({
        open: true,
        message: 'Withdrawal approved successfully!',
        severity: 'success'
      });

    } catch (error) {
      console.error('Error approving withdrawal:', error);
      setNotification({
        open: true,
        message: 'Error approving withdrawal',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectWithdrawal = async (withdrawal) => {
    try {
      setLoading(true);
      
      // Update withdrawal status
      const updatedWithdrawal = {
        ...withdrawal,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        adminNotes: 'Rejected by admin'
      };

      // Update pending withdrawals
      const allWithdrawals = JSON.parse(localStorage.getItem('pendingWithdrawals') || '[]');
      const updatedWithdrawals = allWithdrawals.map(w => 
        w.id === withdrawal.id ? updatedWithdrawal : w
      );
      localStorage.setItem('pendingWithdrawals', JSON.stringify(updatedWithdrawals));

      // Update user's withdrawal history
      const userWithdrawals = JSON.parse(localStorage.getItem('userWithdrawals') || '[]');
      const updatedUserWithdrawals = userWithdrawals.map(w => 
        w.id === withdrawal.id ? updatedWithdrawal : w
      );
      localStorage.setItem('userWithdrawals', JSON.stringify(updatedUserWithdrawals));

      // Restore user balance (since withdrawal was rejected)
      const currentBalance = parseFloat(localStorage.getItem('userBalance') || '0');
      const newBalance = currentBalance + withdrawal.amount;
      localStorage.setItem('userBalance', newBalance.toString());

      // Store notification for user dashboard
      const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
      notifications.push({
        id: Date.now(),
        type: 'withdrawal_rejected',
        title: 'Withdrawal Rejected',
        message: `Your withdrawal of $${withdrawal.amount.toLocaleString()} has been rejected. Funds have been returned to your balance.`,
        timestamp: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('userNotifications', JSON.stringify(notifications));

      loadWithdrawals();
      setNotification({
        open: true,
        message: 'Withdrawal rejected and funds restored to user balance',
        severity: 'info'
      });

    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      setNotification({
        open: true,
        message: 'Error rejecting withdrawal',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'processing': return 'info';
      default: return 'default';
    }
  };

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const processedWithdrawals = withdrawals.filter(w => w.status !== 'pending');

  return (
    <Box>
      {/* Withdrawal Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#232742', color: '#fff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#ff9800' }}>
                  <PendingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Pending Withdrawals
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#ff9800">
                    {pendingWithdrawals.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#232742', color: '#fff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#4caf50' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Total Amount Pending
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#4caf50">
                    ${pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#232742', color: '#fff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#2196f3' }}>
                  <TrendingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Processed Today
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="#2196f3">
                    {processedWithdrawals.filter(w => {
                      const today = new Date().toDateString();
                      const withdrawalDate = new Date(w.submittedAt).toDateString();
                      return today === withdrawalDate;
                    }).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Withdrawal Management Table */}
      <Card sx={{ bgcolor: '#232742', color: '#fff' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              💰 Withdrawal Management
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadWithdrawals}
              sx={{ borderColor: '#1976d2', color: '#1976d2' }}
            >
              Refresh
            </Button>
          </Box>

          {withdrawals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No withdrawal requests found
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: '#181A20' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1a1d2b' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>User</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Method</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id} sx={{ '&:hover': { bgcolor: '#232742' } }}>
                      <TableCell sx={{ color: '#fff' }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {withdrawal.userName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {withdrawal.userEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#fff' }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {withdrawal.type.charAt(0).toUpperCase() + withdrawal.type.slice(1)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {withdrawal.currency}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#fff' }}>
                        <Typography variant="body1" fontWeight={700} color="#4caf50">
                          ${withdrawal.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={withdrawal.status.toUpperCase()} 
                          color={getStatusColor(withdrawal.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#fff' }}>
                        <Typography variant="body2">
                          {new Date(withdrawal.submittedAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(withdrawal.submittedAt).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => setSelectedWithdrawal(withdrawal)}
                              sx={{ color: '#2196f3' }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          {withdrawal.status === 'pending' && (
                            <>
                              <Tooltip title="Approve Withdrawal">
                                <IconButton
                                  size="small"
                                  onClick={() => handleApproveWithdrawal(withdrawal)}
                                  disabled={loading}
                                  sx={{ color: '#4caf50' }}
                                >
                                  <ApproveIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject Withdrawal">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRejectWithdrawal(withdrawal)}
                                  disabled={loading}
                                  sx={{ color: '#f44336' }}
                                >
                                  <RejectIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      {selectedWithdrawal && (
        <Dialog 
          open={Boolean(selectedWithdrawal)} 
          onClose={() => setSelectedWithdrawal(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#232742', color: '#fff' }}>
            Withdrawal Details
          </DialogTitle>
          <DialogContent sx={{ bgcolor: '#232742', color: '#fff' }}>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">User</Typography>
                  <Typography variant="body1" fontWeight={600}>{selectedWithdrawal.userName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{selectedWithdrawal.userEmail}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Method</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedWithdrawal.type.charAt(0).toUpperCase() + selectedWithdrawal.type.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Amount</Typography>
                  <Typography variant="body1" fontWeight={700} color="#4caf50">
                    ${selectedWithdrawal.amount.toLocaleString()} {selectedWithdrawal.currency}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip 
                    label={selectedWithdrawal.status.toUpperCase()} 
                    color={getStatusColor(selectedWithdrawal.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Submitted</Typography>
                  <Typography variant="body2">
                    {new Date(selectedWithdrawal.submittedAt).toLocaleString()}
                  </Typography>
                </Grid>
                
                {/* Method-specific details */}
                {selectedWithdrawal.type === 'bank' && selectedWithdrawal.bankDetails && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1, bgcolor: '#444' }} />
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Bank Details
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">Bank Name</Typography>
                      <Typography variant="body1">{selectedWithdrawal.bankDetails.bankName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">Account Name</Typography>
                      <Typography variant="body1">{selectedWithdrawal.bankDetails.accountName}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">Account Number</Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                        {selectedWithdrawal.bankDetails.accountNumber}
                      </Typography>
                    </Grid>
                    {selectedWithdrawal.bankDetails.swiftCode && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">SWIFT Code</Typography>
                        <Typography variant="body1">{selectedWithdrawal.bankDetails.swiftCode}</Typography>
                      </Grid>
                    )}
                  </>
                )}
                
                {selectedWithdrawal.walletAddress && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">Wallet Address</Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace', 
                          wordBreak: 'break-all',
                          bgcolor: '#181A20',
                          p: 1,
                          borderRadius: 1
                        }}
                      >
                        {selectedWithdrawal.walletAddress}
                      </Typography>
                    </Grid>
                  </>
                )}
                
                {selectedWithdrawal.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                    <Typography variant="body2">{selectedWithdrawal.notes}</Typography>
                  </Grid>
                )}
                
                {selectedWithdrawal.expectedProcessingTime && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Processing Time</Typography>
                    <Typography variant="body2">{selectedWithdrawal.expectedProcessingTime}</Typography>
                  </Grid>
                )}
                
                {selectedWithdrawal.fee && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Fee</Typography>
                    <Typography variant="body2">{selectedWithdrawal.fee}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#232742' }}>
            <Button onClick={() => setSelectedWithdrawal(null)} color="inherit">
              Close
            </Button>
            {selectedWithdrawal.status === 'pending' && (
              <>
                <Button 
                  onClick={() => {
                    handleApproveWithdrawal(selectedWithdrawal);
                    setSelectedWithdrawal(null);
                  }}
                  color="success"
                  variant="contained"
                  disabled={loading}
                >
                  Approve
                </Button>
                <Button 
                  onClick={() => {
                    handleRejectWithdrawal(selectedWithdrawal);
                    setSelectedWithdrawal(null);
                  }}
                  color="error"
                  variant="contained"
                  disabled={loading}
                >
                  Reject
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Trading Management Component
function TradingManagement() {
  const theme = useTheme();
  const [allTrades, setAllTrades] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [stats, setStats] = useState({
    totalTrades: 0,
    activeTrades: 0,
    completedTrades: 0,
    totalVolume: 0,
    todayTrades: 0
  });

  // Load all trades from localStorage
  useEffect(() => {
    loadAllTrades();
    const interval = setInterval(loadAllTrades, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAllTrades = () => {
    try {
      const trades = JSON.parse(localStorage.getItem('allUserTrades') || '[]');
      setAllTrades(trades.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      
      // Calculate statistics
      const today = new Date().toDateString();
      const todayTrades = trades.filter(t => new Date(t.timestamp).toDateString() === today);
      const activeTrades = trades.filter(t => t.status === 'ACTIVE' || t.status === 'pending');
      const completedTrades = trades.filter(t => t.status === 'CLOSED');
      const totalVolume = trades.reduce((sum, t) => sum + (t.amount || 0), 0);
      
      setStats({
        totalTrades: trades.length,
        activeTrades: activeTrades.length,
        completedTrades: completedTrades.length,
        totalVolume: totalVolume,
        todayTrades: todayTrades.length
      });
    } catch (error) {
      console.error('Error loading trades:', error);
      showNotification('Error loading trades data', 'error');
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const getTradeStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'pending':
        return 'primary';
      case 'CLOSED':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTradeTypeColor = (type) => {
    return type === 'BUY' ? 'success' : 'error';
  };

  const formatPnL = (pnl) => {
    if (!pnl && pnl !== 0) return 'N/A';
    const value = parseFloat(pnl);
    return `${value >= 0 ? '+' : ''}$${value.toFixed(2)}`;
  };

  const getPnLColor = (pnl) => {
    if (!pnl && pnl !== 0) return 'text.secondary';
    return parseFloat(pnl) >= 0 ? 'success.main' : 'error.main';
  };

  return (
    <Box>
      {/* Trading Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, bgcolor: '#232742', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#4caf50', mb: 1 }}>
              Total Trades
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#fff' }}>
              {stats.totalTrades}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, bgcolor: '#232742', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#2196f3', mb: 1 }}>
              Active
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#fff' }}>
              {stats.activeTrades}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, bgcolor: '#232742', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#ff9800', mb: 1 }}>
              Completed
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#fff' }}>
              {stats.completedTrades}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, bgcolor: '#232742', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#e91e63', mb: 1 }}>
              Total Volume
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#fff' }}>
              ${stats.totalVolume.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, bgcolor: '#232742', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#9c27b0', mb: 1 }}>
              Today's Trades
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#fff' }}>
              {stats.todayTrades}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Header */}
      <Paper sx={{ p: 2, bgcolor: '#1a1d2b', mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={700} sx={{ color: '#fff' }}>
            🔄 Trading Management ({allTrades.length} total trades)
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={loadAllTrades}
            disabled={loading}
            sx={{ bgcolor: '#1976d2' }}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Trades Table */}
      <Paper sx={{ bgcolor: '#1a1d2b' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#232742' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Trade ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Asset</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Multiplier</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Entry Price</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Exit Price</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>P&L</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center" sx={{ color: 'rgba(255,255,255,0.7)', py: 4 }}>
                    No trades found
                  </TableCell>
                </TableRow>
              ) : (
                allTrades.map((trade) => (
                  <TableRow key={trade.id} sx={{ bgcolor: '#0a0e1a' }}>
                    <TableCell sx={{ color: '#fff', fontSize: '0.75rem' }}>
                      {trade.id?.substring(0, 8)}...
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {trade.userName || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {trade.userEmail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {trade.symbol}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {trade.assetName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={trade.type} 
                        color={getTradeTypeColor(trade.type)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>
                      ${trade.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      <Chip 
                        label={trade.multiplierLabel || `X${trade.multiplier}`}
                        color="secondary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      ${trade.entryPrice?.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      {trade.exitPrice ? `$${trade.exitPrice.toLocaleString()}` : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: getPnLColor(trade.pnl), fontWeight: 600 }}>
                      {formatPnL(trade.pnl)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={trade.status} 
                        color={getTradeStatusColor(trade.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {new Date(trade.timestamp).toLocaleDateString()}
                      <br />
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => setSelectedTrade(trade)}
                          sx={{ color: '#1976d2' }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Trade Details Dialog */}
      {selectedTrade && (
        <Dialog
          open={!!selectedTrade}
          onClose={() => setSelectedTrade(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { bgcolor: '#232742', color: '#fff' }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#1a1d2b', color: '#fff' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingIcon />
              Trade Details - {selectedTrade.symbol}
            </Box>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: '#232742' }}>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Trade ID</Typography>
                  <Typography variant="body2">{selectedTrade.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip 
                    label={selectedTrade.status} 
                    color={getTradeStatusColor(selectedTrade.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">User</Typography>
                  <Typography variant="body2">{selectedTrade.userName}</Typography>
                  <Typography variant="caption" color="textSecondary">{selectedTrade.userEmail}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Asset</Typography>
                  <Typography variant="body2">{selectedTrade.symbol} - {selectedTrade.assetName}</Typography>
                  <Typography variant="caption" color="textSecondary">{selectedTrade.assetCategory}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Trade Type</Typography>
                  <Chip 
                    label={selectedTrade.type} 
                    color={getTradeTypeColor(selectedTrade.type)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Amount</Typography>
                  <Typography variant="body2">${selectedTrade.amount?.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Multiplier</Typography>
                  <Typography variant="body2">{selectedTrade.multiplierLabel || `X${selectedTrade.multiplier}`}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Entry Price</Typography>
                  <Typography variant="body2">${selectedTrade.entryPrice?.toLocaleString()}</Typography>
                </Grid>
                {selectedTrade.exitPrice && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Exit Price</Typography>
                    <Typography variant="body2">${selectedTrade.exitPrice.toLocaleString()}</Typography>
                  </Grid>
                )}
                {selectedTrade.pnl !== undefined && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Profit/Loss</Typography>
                    <Typography variant="body2" sx={{ color: getPnLColor(selectedTrade.pnl), fontWeight: 600 }}>
                      {formatPnL(selectedTrade.pnl)}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Open Time</Typography>
                  <Typography variant="body2">{new Date(selectedTrade.timestamp).toLocaleString()}</Typography>
                </Grid>
                {selectedTrade.closedAt && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Close Time</Typography>
                    <Typography variant="body2">{new Date(selectedTrade.closedAt).toLocaleString()}</Typography>
                  </Grid>
                )}
                {selectedTrade.potentialProfit && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Potential Profit</Typography>
                    <Typography variant="body2">${selectedTrade.potentialProfit.toLocaleString()}</Typography>
                  </Grid>
                )}
                {selectedTrade.riskRewardRatio && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Risk/Reward Ratio</Typography>
                    <Typography variant="body2">{selectedTrade.riskRewardRatio}:1</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#232742' }}>
            <Button onClick={() => setSelectedTrade(null)} color="inherit">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleContactInfoSave = (contactData) => {
    console.log('Saving contact information:', contactData);
    // TODO: Implement actual save to backend
  };

  return (
    <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh', color: '#fff' }}>
      {/* Admin Header */}
      <AppBar position="static" sx={{ bgcolor: '#1a1d2b' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            🛠️ Elon Investment Broker - Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Admin Navigation */}
        <Paper sx={{ bgcolor: '#232742', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#fff'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1976d2'
              }
            }}
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Overview" 
              {...a11yProps(0)} 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<DepositIcon />} 
              label="Deposit Management" 
              {...a11yProps(1)} 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<WithdrawIcon />} 
              label="Withdrawal Management" 
              {...a11yProps(2)} 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<TrendingIcon />} 
              label="Trading Management" 
              {...a11yProps(3)} 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<ContactMailIcon />} 
              label="Contact Management" 
              {...a11yProps(4)} 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<PeopleIcon />} 
              label="User Management" 
              {...a11yProps(5)} 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<SettingsIcon />} 
              label="System Settings" 
              {...a11yProps(6)} 
              sx={{ minHeight: 72 }}
            />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={currentTab} index={0}>
          <Paper sx={{ p: 3, bgcolor: '#1a1d2b', color: '#fff' }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              📊 Admin Dashboard Overview
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Welcome to the admin panel. Use the tabs above to manage different aspects of the system.
            </Typography>
            
            <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
              <Paper sx={{ p: 3, bgcolor: '#232742', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#4caf50', mb: 1 }}>
                  Total Users
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#fff' }}>
                  1,247
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, bgcolor: '#232742', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#2196f3', mb: 1 }}>
                  Active Trades
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#fff' }}>
                  {(() => {
                    try {
                      const trades = JSON.parse(localStorage.getItem('allUserTrades') || '[]');
                      return trades.filter(t => t.status === 'ACTIVE' || t.status === 'pending').length;
                    } catch {
                      return '89';
                    }
                  })()}
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, bgcolor: '#232742', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#ff9800', mb: 1 }}>
                  Pending KYC
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#fff' }}>
                  23
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, bgcolor: '#232742', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#f44336', mb: 1 }}>
                  Support Tickets
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#fff' }}>
                  7
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <DepositManagement />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <WithdrawalManagement />
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <TradingManagement />
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          <AdminContactManager onSave={handleContactInfoSave} />
        </TabPanel>

        <TabPanel value={currentTab} index={5}>
          <Paper sx={{ p: 3, bgcolor: '#1a1d2b', color: '#fff' }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              👥 User Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              User management features will be implemented here.
            </Typography>
          </Paper>
        </TabPanel>

        <TabPanel value={currentTab} index={6}>
          <Paper sx={{ p: 3, bgcolor: '#1a1d2b', color: '#fff' }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              ⚙️ System Settings
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              System configuration settings will be available here.
            </Typography>
          </Paper>
        </TabPanel>
      </Container>
    </Box>
  );
}