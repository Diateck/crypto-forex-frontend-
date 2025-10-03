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
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminIcon,
  AccountBalance as DepositIcon,
  AccountBalanceWallet as WithdrawIcon,
  PendingActions as PendingIcon,
  TrendingUp as TradingIcon,
  Menu as MenuIcon,
  ContactMail as ContactMailIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Verified as VerifiedIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import AdminContactManager from '../components/AdminContactManager';
import AdminSettings from '../components/AdminSettings';
import adminAPI from '../services/adminAPI';
import adminAuthAPI from '../services/adminAuthAPI';
import { useNavigate } from 'react-router-dom';

// Main Admin Dashboard Component
function AdminDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [adminData, setAdminData] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = adminAuthAPI.isAuthenticated();
      if (!isAuth) {
        navigate('/admin-login');
        return;
      }

      // Verify token is still valid
      const response = await adminAuthAPI.verifyToken();
      if (!response.success) {
        navigate('/admin-login');
        return;
      }

      // Load admin data
      const storedData = adminAuthAPI.getStoredAdminData();
      setAdminData(storedData);
    };

    checkAuth();
  }, [navigate]);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const drawerWidth = 280;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <DashboardIcon /> },
    { id: 'users', label: 'User Management', icon: <PeopleIcon /> },
    { id: 'kyc', label: 'KYC Verification', icon: <VerifiedIcon /> },
    { id: 'deposits', label: 'Deposit Management', icon: <DepositIcon /> },
    { id: 'withdrawals', label: 'Withdrawal Management', icon: <WithdrawIcon /> },
    { id: 'trading', label: 'Trading Activity', icon: <TradingIcon /> },
    { id: 'reports', label: 'Reports & Analytics', icon: <AssessmentIcon /> },
    { id: 'contact', label: 'Contact Management', icon: <ContactMailIcon /> },
    { id: 'settings', label: 'System Settings', icon: <SettingsIcon /> }
  ];

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardOverview showNotification={showNotification} />;
      case 'users':
        return <UserManagement showNotification={showNotification} />;
      case 'kyc':
        return <KYCManagement showNotification={showNotification} />;
      case 'deposits':
        return <DepositManagement showNotification={showNotification} />;
      case 'withdrawals':
        return <WithdrawalManagement showNotification={showNotification} />;
      case 'trading':
        return <TradingManagement showNotification={showNotification} />;
      case 'contact':
        return <AdminContactManager />;
      case 'settings':
        return <AdminSettings showNotification={showNotification} />;
      default:
        return <DashboardOverview showNotification={showNotification} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: '#1976d2'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <AdminIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Elon Investment Broker - Admin Panel
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mr: 2 }}>
            Welcome, {adminData?.fullName || 'Admin'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 1 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.id}
                onClick={() => {
                  setCurrentSection(item.id);
                  setDrawerOpen(false);
                }}
                sx={{
                  backgroundColor: currentSection === item.id ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <ListItemIcon sx={{ color: currentSection === item.id ? '#1976d2' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{ color: currentSection === item.id ? '#1976d2' : 'inherit' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderCurrentSection()}
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Dashboard Overview Component
function DashboardOverview({ showNotification }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        showNotification('Failed to load dashboard data', 'error');
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      showNotification('Error loading dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const data = dashboardData || {
    overview: { totalUsers: 0, activeUsers: 0, totalBalance: 0, totalTrades: 0 },
    kyc: { pending: 0, verified: 0, rejected: 0 },
    financial: { pendingDeposits: 0, pendingWithdrawals: 0, dailyVolume: 0 }
  };

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard Overview
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4" component="div">
                {data.overview.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="success.main">
                {data.overview.activeUsers} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Balance
              </Typography>
              <Typography variant="h4" component="div">
                ${data.overview.totalBalance.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="info.main">
                Platform funds
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending KYC
              </Typography>
              <Typography variant="h4" component="div">
                {data.kyc.pending}
              </Typography>
              <Typography variant="body2" color="warning.main">
                Requires review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Deposits
              </Typography>
              <Typography variant="h4" component="div">
                {data.financial.pendingDeposits}
              </Typography>
              <Typography variant="body2" color="warning.main">
                Needs approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Summary */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Overview
              </Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Pending Deposits:</Typography>
                  <Typography fontWeight="bold">{data.financial.pendingDeposits}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Pending Withdrawals:</Typography>
                  <Typography fontWeight="bold">{data.financial.pendingWithdrawals}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Daily Volume:</Typography>
                  <Typography fontWeight="bold">${data.financial.dailyVolume.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                KYC Status
              </Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Verified:</Typography>
                  <Chip label={data.kyc.verified} color="success" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Pending:</Typography>
                  <Chip label={data.kyc.pending} color="warning" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Rejected:</Typography>
                  <Chip label={data.kyc.rejected} color="error" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

// KYC Management Component
function KYCManagement({ showNotification }) {
  const [kycApplications, setKycApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', application: null });
  const [actionReason, setActionReason] = useState('');

  useEffect(() => {
    loadKYCApplications();
  }, []);

  const loadKYCApplications = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getKYCApplications({ status: 'pending' });
      if (response.success) {
        setKycApplications(response.data.applications || []);
      } else {
        showNotification('Failed to load KYC applications', 'error');
      }
    } catch (error) {
      console.error('KYC load error:', error);
      showNotification('Error loading KYC applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKYCAction = async (type) => {
    if (!actionDialog.application) return;
    
    try {
      const application = actionDialog.application;
      let response;
      
      if (type === 'approved') {
        response = await adminAPI.approveKYC(application.id, actionReason);
      } else {
        response = await adminAPI.rejectKYC(application.id, actionReason, actionReason);
      }
      
      if (response.success) {
        setKycApplications(prev => prev.filter(app => app.id !== application.id));
        showNotification(`KYC ${type} successfully`, 'success');
      } else {
        showNotification(response.error || 'Failed to process KYC', 'error');
      }
      
      setActionDialog({ open: false, type: '', application: null });
      setActionReason('');
    } catch (error) {
      console.error('KYC action error:', error);
      showNotification('Error processing KYC action', 'error');
    }
  };

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          KYC Verification Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadKYCApplications}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kycApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>
                        {application.username.charAt(0).toUpperCase()}
                      </Avatar>
                      {application.username}
                    </Box>
                  </TableCell>
                  <TableCell>{application.fullName}</TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Chip 
                        label="ID Document" 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label="Proof of Address" 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />}
                        onClick={() => setActionDialog({ 
                          open: true, 
                          type: 'approved', 
                          application 
                        })}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<RejectIcon />}
                        onClick={() => setActionDialog({ 
                          open: true, 
                          type: 'rejected', 
                          application 
                        })}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Action Dialog */}
      <Dialog 
        open={actionDialog.open} 
        onClose={() => setActionDialog({ open: false, type: '', application: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionDialog.type === 'approved' ? 'Approve KYC' : 'Reject KYC'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Admin Notes"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            placeholder={
              actionDialog.type === 'approved' 
                ? 'Optional approval notes...' 
                : 'Rejection reason (required)...'
            }
            required={actionDialog.type === 'rejected'}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setActionDialog({ open: false, type: '', application: null })}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleKYCAction(actionDialog.type)}
            variant="contained"
            color={actionDialog.type === 'approved' ? 'success' : 'error'}
            disabled={actionDialog.type === 'rejected' && !actionReason.trim()}
          >
            Confirm {actionDialog.type === 'approved' ? 'Approval' : 'Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// Placeholder components for other sections
function UserManagement({ showNotification }) {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Alert severity="info">
        User management functionality will be implemented here.
      </Alert>
    </Container>
  );
}

function DepositManagement({ showNotification }) {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', deposit: null });
  const [actionReason, setActionReason] = useState('');

  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDeposits({ status: 'pending' });
      if (response.success) {
        setDeposits(response.data.deposits || []);
      } else {
        showNotification('Failed to load deposits', 'error');
      }
    } catch (error) {
      console.error('Deposits load error:', error);
      showNotification('Error loading deposits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDepositAction = async (type) => {
    if (!actionDialog.deposit) return;
    
    try {
      const deposit = actionDialog.deposit;
      let response;
      
      if (type === 'approved') {
        response = await adminAPI.approveDeposit(deposit.id, actionReason);
      } else {
        response = await adminAPI.rejectDeposit(deposit.id, actionReason);
      }
      
      if (response.success) {
        setDeposits(prev => prev.filter(d => d.id !== deposit.id));
        showNotification(`Deposit ${type} successfully`, 'success');
      } else {
        showNotification(response.error || 'Failed to process deposit', 'error');
      }
      
      setActionDialog({ open: false, type: '', deposit: null });
      setActionReason('');
    } catch (error) {
      console.error('Deposit action error:', error);
      showNotification('Error processing deposit action', 'error');
    }
  };

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Deposit Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDeposits}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deposits.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>{deposit.username || deposit.fullName || 'N/A'}</TableCell>
                  <TableCell>${deposit.amount}</TableCell>
                  <TableCell>{deposit.method}</TableCell>
                  <TableCell>
                    <Chip 
                      label={deposit.status} 
                      color={deposit.status === 'pending' ? 'warning' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(deposit.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />}
                        onClick={() => setActionDialog({ 
                          open: true, 
                          type: 'approved', 
                          deposit 
                        })}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<RejectIcon />}
                        onClick={() => setActionDialog({ 
                          open: true, 
                          type: 'rejected', 
                          deposit 
                        })}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Action Dialog */}
      <Dialog 
        open={actionDialog.open} 
        onClose={() => setActionDialog({ open: false, type: '', deposit: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionDialog.type === 'approved' ? 'Approve Deposit' : 'Reject Deposit'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Admin Notes"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            placeholder="Optional notes..."
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setActionDialog({ open: false, type: '', deposit: null })}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleDepositAction(actionDialog.type)}
            variant="contained"
            color={actionDialog.type === 'approved' ? 'success' : 'error'}
          >
            Confirm {actionDialog.type === 'approved' ? 'Approval' : 'Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function WithdrawalManagement({ showNotification }) {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Withdrawal Management
      </Typography>
      <Alert severity="info">
        Withdrawal management functionality will be implemented here.
      </Alert>
    </Container>
  );
}

function TradingManagement({ showNotification }) {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Trading Activity Monitor
      </Typography>
      <Alert severity="info">
        Trading activity monitoring will be implemented here.
      </Alert>
    </Container>
  );
}

export default AdminDashboard;