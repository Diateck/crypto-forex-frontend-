import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import adminAuthAPI from '../services/adminAuthAPI';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token is still valid
      adminAuthAPI.verifyToken().then(response => {
        if (response.success) {
          navigate('/admin-dashboard');
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        }
      });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loginAttempts >= 10) {
      setError('Too many failed attempts. Please refresh the page and try again.');
      return;
    }
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await adminAuthAPI.login(formData.username, formData.password);
      
      if (response.success) {
        // Store token and admin data
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        
        // Reset attempts and redirect
        setLoginAttempts(0);
        navigate('/admin-dashboard');
      } else {
        // Check error type from backend response
        if (response.errorType === 'credentials') {
          setError(response.error || 'Invalid credentials');
        } else if (response.error.includes('Network error') || response.error.includes('fetch')) {
          setError('Server is currently busy. Please try again in a few minutes.');
        } else if (response.error.includes('Server is currently busy')) {
          setError('Server is currently busy. Please try again in a few minutes.');
        } else {
          setError(response.error || 'Login failed');
        }
        setLoginAttempts(prev => prev + 1);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Server is currently busy. Please try again in a few minutes.');
      setLoginAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Card elevation={24} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                color: 'white',
                textAlign: 'center',
                py: 4
              }}
            >
              <AdminIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" component="h1" fontWeight="bold">
                Admin Portal
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
                Elon Investment Broker
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" color="primary.main">
                  Secure Administrator Access
                </Typography>
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              {loginAttempts >= 10 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  Multiple failed attempts detected. Please verify your credentials.
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username or Email"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !formData.username || !formData.password}
                  startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    }
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Secure Admin Access
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                  Use your admin credentials to access the control panel
                </Typography>
                <Typography variant="caption" color="info.main" sx={{ mt: 2, display: 'block', bgcolor: 'info.main', color: 'white', p: 1, borderRadius: 1 }}>
                  📝 Current Credentials: Username: admin | Password: admin123
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            © 2025 Elon Investment Broker. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default AdminLogin;