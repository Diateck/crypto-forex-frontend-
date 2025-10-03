import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Snackbar,
  Grid,
  Divider,
  Avatar,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility,
  VisibilityOff,
  Security as SecurityIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import adminAuthAPI from '../services/adminAuthAPI';

function AdminSettings({ showNotification }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [adminData, setAdminData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [logoutDialog, setLogoutDialog] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    username: '',
    email: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    loadAdminData();
    loadLoginHistory();
  }, []);

  const loadAdminData = async () => {
    try {
      const storedData = adminAuthAPI.getStoredAdminData();
      if (storedData) {
        setAdminData(storedData);
        setProfileForm({
          fullName: storedData.fullName || '',
          username: storedData.username || '',
          email: storedData.email || ''
        });
      }
      
      // Also fetch fresh data from API
      const response = await adminAuthAPI.getProfile();
      if (response.success) {
        setAdminData(response.data.admin);
        setProfileForm({
          fullName: response.data.admin.fullName || '',
          username: response.data.admin.username || '',
          email: response.data.admin.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const loadLoginHistory = async () => {
    try {
      const response = await adminAuthAPI.getLoginHistory();
      if (response.success) {
        setLoginHistory(response.data.loginHistory || []);
      }
    } catch (error) {
      console.error('Error loading login history:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminAuthAPI.updateProfile(profileForm);
      
      if (response.success) {
        setAdminData(response.data.admin);
        setEditMode(false);
        setNotification({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success'
        });
        showNotification?.('Profile updated successfully', 'success');
      } else {
        setNotification({
          open: true,
          message: response.error || 'Failed to update profile',
          severity: 'error'
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error updating profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({
        open: true,
        message: 'New passwords do not match',
        severity: 'error'
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setNotification({
        open: true,
        message: 'Password must be at least 6 characters long',
        severity: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await adminAuthAPI.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      if (response.success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setNotification({
          open: true,
          message: 'Password changed successfully',
          severity: 'success'
        });
        showNotification?.('Password changed successfully', 'success');
      } else {
        setNotification({
          open: true,
          message: response.error || 'Failed to change password',
          severity: 'error'
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error changing password',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminAuthAPI.logout();
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/admin-login');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const ProfileTab = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" display="flex" alignItems="center">
            <PersonIcon sx={{ mr: 1 }} />
            Profile Information
          </Typography>
          {!editMode && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mr: 3
            }}
          >
            {adminData?.fullName?.charAt(0) || 'A'}
          </Avatar>
          <Box>
            <Typography variant="h6">{adminData?.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {adminData?.role?.replace('_', ' ').toUpperCase()}
            </Typography>
            <Chip
              label={adminData?.isActive ? 'Active' : 'Inactive'}
              color={adminData?.isActive ? 'success' : 'error'}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Box component="form" onSubmit={handleProfileSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                disabled={!editMode || loading}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={profileForm.username}
                onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                disabled={!editMode || loading}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                disabled={!editMode || loading}
                required
              />
            </Grid>
          </Grid>

          {editMode && (
            <Box mt={3} display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setEditMode(false);
                  setProfileForm({
                    fullName: adminData?.fullName || '',
                    username: adminData?.username || '',
                    email: adminData?.email || ''
                  });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const SecurityTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" display="flex" alignItems="center" mb={3}>
          <SecurityIcon sx={{ mr: 1 }} />
          Security Settings
        </Typography>

        <Box component="form" onSubmit={handlePasswordSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('current')}
                        edge="end"
                      >
                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                disabled={loading}
                helperText="Minimum 6 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('new')}
                        edge="end"
                      >
                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                disabled={loading}
                error={passwordForm.newPassword !== passwordForm.confirmPassword && passwordForm.confirmPassword !== ''}
                helperText={
                  passwordForm.newPassword !== passwordForm.confirmPassword && passwordForm.confirmPassword !== ''
                    ? 'Passwords do not match'
                    : ''
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('confirm')}
                        edge="end"
                      >
                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
            >
              Change Password
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Account Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Last Login"
                secondary={adminData?.lastLogin ? new Date(adminData.lastLogin).toLocaleString() : 'Never'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Account Created"
                secondary={adminData?.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : 'Unknown'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Login Attempts"
                secondary={`${adminData?.loginAttempts || 0} failed attempts`}
              />
            </ListItem>
          </List>
        </Box>
      </CardContent>
    </Card>
  );

  const ActivityTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" display="flex" alignItems="center" mb={3}>
          <HistoryIcon sx={{ mr: 1 }} />
          Login History
        </Typography>

        <List>
          {loginHistory.map((login, index) => (
            <ListItem key={login.id || index} divider>
              <ListItemText
                primary={new Date(login.timestamp).toLocaleString()}
                secondary={`IP: ${login.ip} | ${login.userAgent?.substring(0, 50)}...`}
              />
              <ListItemSecondaryAction>
                <Chip
                  label={login.status}
                  color={login.status === 'success' ? 'success' : 'error'}
                  size="small"
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {loginHistory.length === 0 && (
            <ListItem>
              <ListItemText primary="No login history available" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" display="flex" alignItems="center">
          <SettingsIcon sx={{ mr: 2 }} />
          Admin Settings
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={() => setLogoutDialog(true)}
        >
          Logout
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="Activity" />
        </Tabs>
      </Paper>

      {activeTab === 0 && <ProfileTab />}
      {activeTab === 1 && <SecurityTab />}
      {activeTab === 2 && <ActivityTab />}

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

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
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminSettings;