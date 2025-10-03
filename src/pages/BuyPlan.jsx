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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container
} from '@mui/material';
import {
  Person,
  Email,
  Settings,
  VerifiedUser,
  Star,
  TrendingUp,
  Schedule,
  AccountBalanceWallet,
  Security,
  Support,
  Language,
  Copyright
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationContext';
import { getUserUsername } from '../utils/userStatus';
import { plansAPI } from '../services/api';

const investmentPlans = [
  {
    id: 'starter',
    name: 'Starter Plan',
    type: 'regular',
    roi: '15',
    minimumDeposit: 100,
    maximumDeposit: 999,
    profitPercentage: 15,
    duration: '7 days',
    color: '#CD7F32',
    gradient: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)',
    features: ['Basic trading signals', 'Email support', 'Market analysis'],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    type: 'VIP',
    roi: '25',
    minimumDeposit: 1000,
    maximumDeposit: 4999,
    profitPercentage: 25,
    duration: '14 days',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    features: ['Advanced trading signals', 'Priority support', 'Daily market updates', 'Risk management tools'],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    type: 'VIP',
    roi: '35',
    minimumDeposit: 5000,
    maximumDeposit: 19999,
    profitPercentage: 35,
    duration: '21 days',
    color: '#C0C0C0',
    gradient: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
    features: ['Premium signals', '24/7 support', 'Personal account manager', 'Exclusive webinars'],
    popular: false
  },
  {
    id: 'vip',
    name: 'VIP Plan',
    type: 'VIP',
    roi: '50',
    minimumDeposit: 20000,
    maximumDeposit: 100000,
    profitPercentage: 50,
    duration: '30 days',
    color: '#9932CC',
    gradient: 'linear-gradient(135deg, #9932CC 0%, #8A2BE2 100%)',
    features: ['VIP signals', 'Dedicated support', 'Custom strategies', 'Direct broker contact'],
    popular: false
  }
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

export default function BuyPlan() {
  const theme = useTheme();
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const [investDialogOpen, setInvestDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState(investmentPlans); // Start with local data as fallback
  const [userPlans, setUserPlans] = useState([]);

  // Load backend data on component mount
  React.useEffect(() => {
    loadPlansData();
    if (user) {
      loadUserPlans();
    }
  }, [user]);

  const loadPlansData = async () => {
    try {
      const response = await plansAPI.getPlans();
      if (response.success && response.data.plans) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.warn('Failed to load plans from backend, using fallback data:', error);
    }
  };

  const loadUserPlans = async () => {
    if (!user?.id) return;
    
    try {
      const response = await plansAPI.getUserPlans(user.id);
      if (response.success && response.data.plans) {
        setUserPlans(response.data.plans);
      }
    } catch (error) {
      console.warn('Failed to load user plans:', error);
    }
  };

  const handleInvestClick = (plan) => {
    setSelectedPlan(plan);
    setInvestDialogOpen(true);
  };

  const handleConfirmInvestment = async () => {
    if (!user || !selectedPlan || !investAmount || !paymentMethod) {
      addNotification('Please fill in all required fields', 'error');
      return;
    }

    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount < selectedPlan.minimumDeposit || amount > selectedPlan.maximumDeposit) {
      addNotification(`Amount must be between $${selectedPlan.minimumDeposit} and $${selectedPlan.maximumDeposit}`, 'error');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare plan purchase data
      const planData = {
        userId: user.id || getUserUsername(user),
        userName: user.name || getUserUsername(user),
        userEmail: user.email || 'user@example.com',
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: amount,
        paymentMethod: paymentMethod,
        expectedProfit: amount * (selectedPlan.profitPercentage / 100),
        duration: selectedPlan.duration
      };

      // Try backend first
      const response = await plansAPI.purchasePlan(planData);
      
      if (response.success) {
        addNotification(response.data.message || 'Investment plan purchased successfully!', 'success');
        
        // Reload user plans
        await loadUserPlans();
        
        // Close dialog and reset form
        setInvestDialogOpen(false);
        setInvestAmount('');
        setPaymentMethod('');
        
      } else {
        throw new Error(response.message || 'Purchase failed');
      }
      
    } catch (error) {
      console.error('Plan purchase error:', error);
      addNotification(error.message || 'Failed to purchase plan. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ p: { xs: 1, sm: 3 } }}>
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
                Username: <span style={{ color: theme.palette.primary.main }}>{getUserUsername(user)}</span>
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

        {/* Page Title */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
            Investment Plans
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Choose from our premium investment plans designed to maximize your returns with guaranteed profits and secure transactions.
          </Typography>
        </Box>

        {/* Investment Plans */}
        <Grid container spacing={3} sx={{ mb: 8, justifyContent: 'center' }}>
          {investmentPlans.map((plan) => (
            <Grid item xs={12} sm={6} lg={4} key={plan.id}>
              <Card sx={{ 
                height: '100%',
                minHeight: 400,
                maxHeight: 650,
                position: 'relative',
                background: plan.gradient,
                color: plan.name === 'Gold Plan' ? '#000' : '#fff',
                borderRadius: 3,
                boxShadow: 6,
                transition: 'transform 0.3s, boxShadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 12
                },
                border: plan.name === 'Gold Plan' ? '2px solid #FFD700' : 'none'
              }}>
                {plan.type === 'VIP' && (
                  <Chip
                    icon={<Star />}
                    label="VIP"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12,
                      bgcolor: '#FF6B6B',
                      color: '#fff',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}
                  />
                )}
                
                <CardContent sx={{ 
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  {/* Plan Header */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
                      {plan.type.toUpperCase()}
                    </Typography>

                    {/* ROI Display */}
                    <Box sx={{ 
                      mb: 3, 
                      p: 2, 
                      bgcolor: 'rgba(0,0,0,0.15)', 
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <Typography variant="h2" fontWeight="bold" color="inherit">
                        {plan.roi}%
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        Daily ROI
                      </Typography>
                    </Box>
                  </Box>

                  {/* Plan Details */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1
                    }}>
                      <Typography variant="body2" fontWeight="600">Minimum:</Typography>
                      <Typography variant="body2">${plan.minimumDeposit.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1
                    }}>
                      <Typography variant="body2" fontWeight="600">Maximum:</Typography>
                      <Typography variant="body2">${plan.maximumDeposit.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2
                    }}>
                      <Typography variant="body2" fontWeight="600">Duration:</Typography>
                      <Typography variant="body2">{plan.duration}</Typography>
                    </Box>
                    
                    {/* Features */}
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
                      Key Features:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <Typography key={index} variant="body2" sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 0.5,
                          fontSize: '0.85rem'
                        }}>
                          <VerifiedUser sx={{ fontSize: 14, mr: 1 }} />
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  {/* Invest Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => handleInvestClick(plan)}
                    sx={{ 
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      bgcolor: plan.name === 'Gold Plan' ? '#000' : '#fff',
                      color: plan.name === 'Gold Plan' ? '#FFD700' : plan.color,
                      borderRadius: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      '&:hover': {
                        bgcolor: plan.name === 'Gold Plan' ? '#333' : '#f5f5f5',
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    Invest Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Content Section */}
        <Paper sx={{ 
          p: 4, 
          mb: 6,
          background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
          color: '#fff',
          borderRadius: 4
        }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center" color="primary">
            Why Choose Elon Investment Broker?
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Secure & Safe
                </Typography>
                <Typography color="rgba(255,255,255,0.8)">
                  Your investments are protected with bank-level security and insurance coverage.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  High Returns
                </Typography>
                <Typography color="rgba(255,255,255,0.8)">
                  Guaranteed daily returns with our proven investment strategies and market expertise.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Support sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  24/7 Support
                </Typography>
                <Typography color="rgba(255,255,255,0.8)">
                  Round-the-clock customer support to assist you with all your investment needs.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Investment Dialog */}
        <Dialog 
          open={investDialogOpen} 
          onClose={() => setInvestDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              color: '#fff',
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h5" fontWeight="bold">
              Invest in {selectedPlan?.name}
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3 }}>
            {selectedPlan && (
              <Box>
                <Paper sx={{ 
                  p: 3, 
                  mb: 3,
                  background: selectedPlan.gradient,
                  color: selectedPlan.name === 'Gold Plan' ? '#000' : '#fff'
                }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Plan Details
                  </Typography>
                  <Typography>ROI: {selectedPlan.roi}% Daily</Typography>
                  <Typography>Duration: {selectedPlan.duration}</Typography>
                  <Typography>
                    Range: ${selectedPlan.minimumDeposit.toLocaleString()} - ${selectedPlan.maximumDeposit.toLocaleString()}
                  </Typography>
                </Paper>

                <TextField
                  fullWidth
                  label="Investment Amount"
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-input': { color: '#fff' },
                  }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: '#fff' }}>$</Typography>
                  }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                      '& .MuiSelect-select': { color: '#fff' },
                      '& .MuiSvgIcon-root': { color: '#fff' }
                    }}
                  >
                    <MenuItem value="bitcoin">Bitcoin (BTC)</MenuItem>
                    <MenuItem value="ethereum">Ethereum (ETH)</MenuItem>
                    <MenuItem value="usdt">Tether (USDT)</MenuItem>
                    <MenuItem value="bank">Bank Transfer</MenuItem>
                    <MenuItem value="card">Credit/Debit Card</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
            <Button onClick={() => setInvestDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmInvestment}
              variant="contained"
              disabled={!investAmount || !paymentMethod}
              sx={{ fontWeight: 700 }}
            >
              Confirm Investment
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: '#181A20', 
        py: 4, 
        mt: 6,
        borderTop: '1px solid #23272F'
      }}>
        <Container maxWidth="xl">
          {/* Language Selection */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
                Language
              </InputLabel>
              <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  '& .MuiSelect-select': { color: '#fff' },
                  '& .MuiSvgIcon-root': { color: '#fff' }
                }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          {/* Copyright */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Copyright sx={{ fontSize: 16 }} />
              {new Date().getFullYear()} Elon Investment Broker. All rights reserved.
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ mt: 1 }}>
              Licensed & Regulated Financial Services Provider
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
