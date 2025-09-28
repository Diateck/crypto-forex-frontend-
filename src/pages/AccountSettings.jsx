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
  Divider,
  IconButton,
  Tabs,
  Tab,
  InputAdornment,
  FormHelperText,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Person,
  Email,
  Settings,
  VerifiedUser,
  Phone,
  LocationOn,
  Home,
  Flag,
  Security,
  Visibility,
  VisibilityOff,
  PhotoCamera,
  Upload,
  Save,
  Cancel,
  Edit,
  Lock,
  Notifications,
  Language,
  AccountBalance,
  CreditCard,
  Support,
  Info,
  CheckCircle,
  Warning,
  Error,
  ContentCopy,
  Share,
  QrCode,
  TrendingUp,
  AccountBalanceWallet,
  Business,
  School,
  Work
} from '@mui/icons-material';

export default function AccountSettings() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: 'Theophilus Ogunjimiolusegun',
    username: 'theophilus',
    email: 'ogunjimiolusegun807@gmail.com',
    phone: '8134567890',
    country: 'Nigeria',
    state: 'Lagos',
    zipCode: '100001',
    address: '123 Victoria Island, Lagos',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    tradingAlerts: true,
    marketUpdates: true,
    twoFactorAuth: true,
    loginAlerts: true
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSettingChange = (setting) => (event) => {
    setAccountSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Handle profile save logic
    setIsEditing(false);
    console.log('Profile saved:', formData);
  };

  const handlePasswordChange = () => {
    // Handle password change logic
    console.log('Password change requested');
    setFormData(prev => ({
      ...prev,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText('https://elonbroker.com/ref/theophilus');
  };

  const countries = [
    'United States', 'United Kingdom', 'Nigeria', 'Ghana', 'South Africa', 
    'Kenya', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China'
  ];

  const accountTypes = [
    { type: 'Standard', description: 'Basic trading features', color: 'info' },
    { type: 'Premium', description: 'Enhanced features & lower fees', color: 'warning' },
    { type: 'VIP', description: 'All features & priority support', color: 'success' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Container maxWidth="xl" sx={{ p: { xs: 1, sm: 3 } }}>
        {/* Header */}
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
          
          {/* Top Stats */}
          <Grid container spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Grid item xs={4} sm="auto">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  $15,750
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  Profit
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sm="auto">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  $28,430
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  Total Balance
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sm="auto">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  $5,680
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  Total Bonus
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Button 
            variant="contained" 
            startIcon={<AccountBalance />}
            sx={{ 
              bgcolor: '#4A90E2', 
              '&:hover': { bgcolor: '#357ABD' }
            }}
          >
            Account
          </Button>
          <Button 
            variant="contained" 
            startIcon={<CreditCard />}
            sx={{ 
              bgcolor: '#5CB85C', 
              '&:hover': { bgcolor: '#449D44' }
            }}
          >
            Make Deposit
          </Button>
          <Button 
            variant="contained" 
            startIcon={<TrendingUp />}
            sx={{ 
              bgcolor: '#F0AD4E', 
              '&:hover': { bgcolor: '#EC971F' }
            }}
          >
            Withdraw Funds
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Email />}
            sx={{ 
              bgcolor: '#5BC0DE', 
              '&:hover': { bgcolor: '#46B8DA' }
            }}
          >
            Mail Us
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Settings />}
            sx={{ 
              bgcolor: '#D9534F', 
              '&:hover': { bgcolor: '#C9302C' }
            }}
          >
            Settings
          </Button>
        </Box>

        {/* Main Content */}
        <Card sx={{
          bgcolor: '#232742',
          color: '#fff',
          borderRadius: 3,
          boxShadow: 6,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 3 }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    minWidth: 140
                  },
                  '& .MuiTab-root.Mui-selected': {
                    color: '#4DD0E1',
                    bgcolor: 'rgba(77, 208, 225, 0.1)'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#4DD0E1'
                  }
                }}
              >
                <Tab label="Personal Profile" />
                <Tab label="Account Records" />
                <Tab label="Account Settings" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {currentTab === 0 && (
              <Box>
                <Typography variant="h4" gutterBottom sx={{ color: '#fff', mb: 4 }}>
                  Personal Profile Info
                </Typography>
                
                <Grid container spacing={4}>
                  {/* Form Fields */}
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={formData.fullName}
                          onChange={handleInputChange('fullName')}
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: 'rgba(255,255,255,0.7)' }} />
                              </InputAdornment>
                            ),
                            sx: { color: '#fff' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Username"
                          value={formData.username}
                          onChange={handleInputChange('username')}
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: 'rgba(255,255,255,0.7)' }} />
                              </InputAdornment>
                            ),
                            sx: { color: '#fff' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                              </InputAdornment>
                            ),
                            sx: { color: '#fff' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange('phone')}
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone sx={{ color: 'rgba(255,255,255,0.7)' }} />
                              </InputAdornment>
                            ),
                            sx: { color: '#fff' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth disabled={!isEditing}>
                          <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Country</InputLabel>
                          <Select
                            value={formData.country}
                            onChange={handleInputChange('country')}
                            label="Country"
                            startAdornment={
                              <InputAdornment position="start">
                                <Flag sx={{ color: 'rgba(255,255,255,0.7)' }} />
                              </InputAdornment>
                            }
                            sx={{
                              color: '#fff',
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                            }}
                            MenuProps={{
                              PaperProps: { sx: { bgcolor: '#232742', color: '#fff' } }
                            }}
                          >
                            {countries.map((country) => (
                              <MenuItem key={country} value={country}>
                                {country}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="State/Province"
                          value={formData.state}
                          onChange={handleInputChange('state')}
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOn sx={{ color: 'rgba(255,255,255,0.7)' }} />
                              </InputAdornment>
                            ),
                            sx: { color: '#fff' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Postal/Zip Code"
                          value={formData.zipCode}
                          onChange={handleInputChange('zipCode')}
                          disabled={!isEditing}
                          InputProps={{
                            sx: { color: '#fff' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          value={formData.address}
                          onChange={handleInputChange('address')}
                          disabled={!isEditing}
                          multiline
                          rows={3}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Home sx={{ color: 'rgba(255,255,255,0.7)', mt: -2 }} />
                              </InputAdornment>
                            ),
                            sx: { color: '#fff' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      {isEditing ? (
                        <>
                          <Button 
                            variant="contained" 
                            startIcon={<Save />}
                            onClick={handleSaveProfile}
                            sx={{ 
                              bgcolor: '#4DD0E1',
                              '&:hover': { bgcolor: '#26C6DA' }
                            }}
                          >
                            Update Profile
                          </Button>
                          <Button 
                            variant="outlined" 
                            startIcon={<Cancel />}
                            onClick={() => setIsEditing(false)}
                            sx={{ 
                              color: '#fff',
                              borderColor: 'rgba(255,255,255,0.3)'
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="contained" 
                          startIcon={<Edit />}
                          onClick={() => setIsEditing(true)}
                          sx={{ 
                            bgcolor: '#4DD0E1',
                            '&:hover': { bgcolor: '#26C6DA' }
                          }}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </Box>
                  </Grid>

                  {/* Right Sidebar */}
                  <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                      {/* Account Status */}
                      <Paper sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        borderRadius: 2 
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <AccountBalance sx={{ color: 'primary.main' }} />
                          <Typography variant="h6" color="primary.main">
                            Account Status
                          </Typography>
                        </Box>
                        <Stack spacing={1}>
                          <Chip 
                            icon={<CheckCircle />} 
                            label="Account Verified" 
                            color="success" 
                            variant="outlined" 
                            size="small"
                          />
                          <Chip 
                            icon={<VerifiedUser />} 
                            label="KYC Completed" 
                            color="success" 
                            variant="outlined" 
                            size="small"
                          />
                          <Chip 
                            icon={<Security />} 
                            label="2FA Enabled" 
                            color="info" 
                            variant="outlined" 
                            size="small"
                          />
                        </Stack>
                      </Paper>

                      {/* Account Type */}
                      <Paper sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        borderRadius: 2 
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Business sx={{ color: 'primary.main' }} />
                          <Typography variant="h6" color="primary.main">
                            Account Type
                          </Typography>
                        </Box>
                        <Chip 
                          label="Premium Trading" 
                          color="warning" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            height: 32
                          }}
                        />
                        <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mt: 1 }}>
                          Enhanced features & lower trading fees
                        </Typography>
                      </Paper>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Referral Link Section */}
                <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Box>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    Your Referral Link
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      value="https://elonbroker.com/ref/theophilus"
                      InputProps={{
                        readOnly: true,
                        sx: { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                        }
                      }}
                    />
                    <Tooltip title="Copy Link">
                      <Button 
                        variant="contained" 
                        onClick={copyReferralLink}
                        sx={{ 
                          bgcolor: '#4DD0E1',
                          '&:hover': { bgcolor: '#26C6DA' },
                          minWidth: 120
                        }}
                      >
                        Copy Referral Link
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            )}

            {currentTab === 1 && (
              <Box>
                <Typography variant="h4" gutterBottom sx={{ color: '#fff', mb: 4 }}>
                  Account Records
                </Typography>
                
                <Grid container spacing={3}>
                  {[
                    { type: 'Total Investment', amount: '$25,430.00' },
                    { type: 'Total Earnings', amount: '$8,750.50' },
                    { type: 'Total Balance', amount: '$28,430.00' },
                    { type: 'Total Referral', amount: '$1,250.00' },
                    { type: 'Total Bonus', amount: '$5,680.00' }
                  ].map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper sx={{ 
                        p: 3, 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body1" color="rgba(255,255,255,0.9)">
                          {item.type}
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          {item.amount}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      bgcolor: '#4DD0E1',
                      '&:hover': { bgcolor: '#26C6DA' }
                    }}
                  >
                    View Transactions
                  </Button>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      bgcolor: '#4DD0E1',
                      '&:hover': { bgcolor: '#26C6DA' }
                    }}
                  >
                    View Trade History
                  </Button>
                </Box>
              </Box>
            )}

            {currentTab === 2 && (
              <Box>
                <Typography variant="h4" gutterBottom sx={{ color: '#fff', mb: 4 }}>
                  Account Settings
                </Typography>
                
                <Grid container spacing={4}>
                  {/* Password Change */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <Typography variant="h6" color="primary.main" gutterBottom>
                        Change Password
                      </Typography>
                      
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Old Password"
                          type={showPassword.old ? 'text' : 'password'}
                          value={formData.oldPassword}
                          onChange={handleInputChange('oldPassword')}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => togglePasswordVisibility('old')}
                                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                                >
                                  {showPassword.old ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: { color: '#fff' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          label="New Password"
                          type={showPassword.new ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={handleInputChange('newPassword')}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => togglePasswordVisibility('new')}
                                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                                >
                                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: { color: '#fff' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Rewrite New Password"
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange('confirmPassword')}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => togglePasswordVisibility('confirm')}
                                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                                >
                                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: { color: '#fff' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' }
                          }}
                        />
                      </Stack>
                      
                      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button 
                          variant="outlined" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.7)',
                            borderColor: 'rgba(255,255,255,0.3)'
                          }}
                        >
                          Clear
                        </Button>
                        <Button 
                          variant="contained" 
                          onClick={handlePasswordChange}
                          sx={{ 
                            bgcolor: '#4DD0E1',
                            '&:hover': { bgcolor: '#26C6DA' }
                          }}
                        >
                          Change Password
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Profile Image Upload */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <Typography variant="h6" color="primary.main" gutterBottom>
                        Change Profile Image
                      </Typography>
                      
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Avatar
                          src={profileImage}
                          sx={{
                            width: 120,
                            height: 120,
                            margin: '0 auto',
                            mb: 2,
                            bgcolor: 'primary.main'
                          }}
                        >
                          <Person sx={{ fontSize: 48 }} />
                        </Avatar>
                        
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="profile-image-upload"
                          type="file"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="profile-image-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PhotoCamera />}
                            sx={{
                              color: '#fff',
                              borderColor: 'rgba(255,255,255,0.3)',
                              mb: 1
                            }}
                          >
                            Choose File
                          </Button>
                        </label>
                        <Typography variant="caption" display="block" color="rgba(255,255,255,0.6)">
                          No file chosen
                        </Typography>
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        fullWidth
                        sx={{ 
                          bgcolor: '#4DD0E1',
                          '&:hover': { bgcolor: '#26C6DA' }
                        }}
                      >
                        Change Profile Image
                      </Button>
                    </Paper>
                  </Grid>

                  {/* Notification Settings */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <Typography variant="h6" color="primary.main" gutterBottom>
                        Notification Preferences
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', icon: <Email /> },
                          { key: 'smsNotifications', label: 'SMS Notifications', icon: <Phone /> },
                          { key: 'tradingAlerts', label: 'Trading Alerts', icon: <TrendingUp /> },
                          { key: 'marketUpdates', label: 'Market Updates', icon: <Info /> },
                          { key: 'twoFactorAuth', label: '2FA Authentication', icon: <Security /> },
                          { key: 'loginAlerts', label: 'Login Alerts', icon: <Warning /> }
                        ].map((setting) => (
                          <Grid item xs={12} sm={6} key={setting.key}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={accountSettings[setting.key]}
                                  onChange={handleSettingChange(setting.key)}
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#4DD0E1'
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: '#4DD0E1'
                                    }
                                  }}
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {setting.icon}
                                  {setting.label}
                                </Box>
                              }
                              sx={{ color: '#fff' }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
