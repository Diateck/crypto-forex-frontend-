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

const investmentPlans = [
  {
    id: 1,
    name: 'Bronze Plan',
    type: 'regular',
    roi: '500',
    minAmount: 4000,
    maxAmount: 10000,
    duration: '2 weeks',
    color: '#CD7F32',
    gradient: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)',
    features: [
      'Daily ROI of 500%',
      '24/7 Customer Support',
      'Secure Investment',
      'Quick Withdrawal',
      'Investment Protection'
    ]
  },
  {
    id: 2,
    name: 'Gold Plan',
    type: 'VIP',
    roi: '750',
    minAmount: 5200,
    maxAmount: 20000,
    duration: '2 weeks',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    features: [
      'Daily ROI of 750%',
      'VIP Customer Support',
      'Priority Withdrawal',
      'Advanced Security',
      'Dedicated Account Manager',
      'Investment Insurance'
    ]
  },
  {
    id: 3,
    name: 'Platinum Plan',
    type: 'VIP',
    roi: '1200',
    minAmount: 10000,
    maxAmount: 50000000,
    duration: '7 Days',
    color: '#E5E4E2',
    gradient: 'linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)',
    features: [
      'Daily ROI of 1200%',
      'Premium VIP Support',
      'Instant Withdrawal',
      'Maximum Security',
      'Personal Investment Advisor',
      'Full Investment Protection',
      'Exclusive Trading Signals'
    ]
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
  const [investDialogOpen, setInvestDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleInvestClick = (plan) => {
    setSelectedPlan(plan);
    setInvestDialogOpen(true);
  };

  const handleConfirmInvestment = () => {
    // Here you would implement the actual investment logic
    console.log('Investment:', {
      plan: selectedPlan,
      amount: investAmount,
      paymentMethod: paymentMethod
    });
    setInvestDialogOpen(false);
    setInvestAmount('');
    setPaymentMethod('');
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
            <Grid item xs={12} sm={6} lg={4} key={plan.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ 
                width: '100%',
                maxWidth: 380,
                aspectRatio: '1/1.2',
                position: 'relative',
                background: plan.gradient,
                color: plan.name === 'Gold Plan' ? '#000' : '#fff',
                borderRadius: 4,
                boxShadow: 8,
                transition: 'transform 0.3s, boxShadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 16
                },
                border: plan.name === 'Gold Plan' ? '3px solid #FFD700' : 'none',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {plan.type === 'VIP' && (
                  <Chip
                    icon={<Star />}
                    label="VIP"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16,
                      bgcolor: '#FF6B6B',
                      color: '#fff',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}
                  />
                )}
                
                <CardContent sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  textAlign: 'center', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between' 
                }}>
                  {/* Plan Header */}
                  <Box>
                    <Typography variant={{ xs: 'h5', sm: 'h4' }} fontWeight="bold" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
                      {plan.type.toUpperCase()}
                    </Typography>

                    {/* ROI Display */}
                    <Box sx={{ 
                      mb: 3, 
                      p: { xs: 2, sm: 3 }, 
                      bgcolor: 'rgba(0,0,0,0.1)', 
                      borderRadius: 3,
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}>
                      <Typography variant={{ xs: 'h3', sm: 'h2' }} fontWeight="bold" color="inherit">
                        {plan.roi}%
                      </Typography>
                      <Typography variant={{ xs: 'body1', sm: 'h6' }} fontWeight="bold">
                        ROI Daily
                      </Typography>
                    </Box>
                  </Box>

                  {/* Plan Details */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 1,
                      mb: 2,
                      textAlign: 'left',
                      fontSize: { xs: '0.8rem', sm: '0.9rem' }
                    }}>
                      <Typography fontWeight="bold">Minimum:</Typography>
                      <Typography>${plan.minAmount.toLocaleString()}</Typography>
                      <Typography fontWeight="bold">Maximum:</Typography>
                      <Typography>${plan.maxAmount.toLocaleString()}</Typography>
                      <Typography fontWeight="bold">Duration:</Typography>
                      <Typography>{plan.duration}</Typography>
                    </Box>
                    
                    {/* Amount Range Display */}
                    <Box sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      borderRadius: 2,
                      textAlign: 'center'
                    }}>
                      <Typography variant={{ xs: 'body1', sm: 'h6' }} fontWeight="bold">
                        ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Features List - Condensed for square format */}
                  <Box sx={{ mb: 3, flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                      Key Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature.length > 18 ? feature.substring(0, 15) + '...' : feature}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            color: 'inherit',
                            fontSize: '0.7rem',
                            height: 24
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Invest Button - Always at bottom */}
                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => handleInvestClick(plan)}
                      sx={{ 
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 'bold',
                        bgcolor: plan.name === 'Gold Plan' ? '#000' : '#fff',
                        color: plan.name === 'Gold Plan' ? '#FFD700' : plan.color,
                        '&:hover': {
                          bgcolor: plan.name === 'Gold Plan' ? '#333' : '#f0f0f0'
                        },
                        boxShadow: 3,
                        '&:hover': {
                          boxShadow: 6,
                          bgcolor: plan.name === 'Gold Plan' ? '#333' : '#f0f0f0'
                        }
                      }}
                    >
                      Invest Now
                    </Button>
                  </Box>
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
                    Range: ${selectedPlan.minAmount.toLocaleString()} - ${selectedPlan.maxAmount.toLocaleString()}
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
