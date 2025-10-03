
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Divider, 
  MenuItem, 
  Card, 
  Avatar, 
  Stack, 
  Chip,
  Container,
  Alert,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTheme } from '@mui/material/styles';
import { useUser } from '../contexts/UserContext';
import { useBalance } from '../contexts/BalanceContext';
import { useNotifications } from '../contexts/NotificationContext';

// Backend API configuration - Use live deployed backend
const API_BASE_URL = 'https://crypto-forex-backend-9mme.onrender.com/api';

const withdrawalsAPI = {
  // Submit withdrawal request to backend
  submitWithdrawal: async (withdrawalData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/withdrawals/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(withdrawalData)
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'API connection failed' };
    }
  },

  // Get user's withdrawal history
  getWithdrawalHistory: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/withdrawals/history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'API connection failed' };
    }
  },

  // Get withdrawal limits and fees
  getWithdrawalLimits: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/withdrawals/limits`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'API connection failed' };
    }
  },

  // Verify account balance
  verifyBalance: async (userId, amount) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/verify-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ amount })
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'API connection failed' };
    }
  }
};

const tickerData = [
  { label: 'Nasdaq 100', value: '24,344.8', change: '+98.90 (+0.41%)', color: 'success.main' },
  { label: 'EUR/USD', value: '1.18099', change: '-0.00059 (-0.05%)', color: 'error.main' },
  { label: 'BTC/USD', value: '116,747', change: '+270.00 (+0.23%)', color: 'success.main' },
  { label: 'ETH/USD', value: '4,620.8', change: '+28.50', color: 'success.main' },
];

const withdrawalOptions = [
  { 
    value: 'bank', 
    label: 'Bank Transfer',
    minAmount: 100,
    maxAmount: 50000,
    processingTime: '3-5 business days',
    fee: '2.5% + $5'
  },
  { 
    value: 'bitcoin', 
    label: 'Bitcoin (BTC)',
    minAmount: 0.001,
    maxAmount: 5,
    processingTime: '30-60 minutes',
    fee: '0.0005 BTC'
  },
  { 
    value: 'ethereum', 
    label: 'Ethereum (ETH)',
    minAmount: 0.01,
    maxAmount: 50,
    processingTime: '15-30 minutes',
    fee: '0.005 ETH'
  },
  { 
    value: 'litecoin', 
    label: 'Litecoin (LTC)',
    minAmount: 0.1,
    maxAmount: 200,
    processingTime: '20-40 minutes',
    fee: '0.01 LTC'
  }
];

export default function Withdrawals() {
  const theme = useTheme();
  const { user } = useUser();
  const { balance, deductBalance, refreshBalance } = useBalance();
  const { addNotification } = useNotifications();
  
  // Enhanced state management for backend integration
  const [withdrawalForm, setWithdrawalForm] = useState({
    type: '',
    amount: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    swiftCode: '',
    walletAddress: '',
    notes: ''
  });
  const [validation, setValidation] = useState({});
  // Using shared notification context - removed local notification state
  const [loading, setLoading] = useState({
    page: false,
    submit: false,
    balance: false
  });
  // Using shared balance from BalanceContext - removed local userBalance state
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [withdrawalLimits, setWithdrawalLimits] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    data: null
  });

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, [user?.id]);

  const loadInitialData = async () => {
    try {
      setLoading(prev => ({ ...prev, page: true }));
      
      // Try to load from backend first, fallback to localStorage
      const [limitsResult, historyResult] = await Promise.all([
        withdrawalsAPI.getWithdrawalLimits(),
        user?.id ? withdrawalsAPI.getWithdrawalHistory(user.id) : Promise.resolve({ success: false })
      ]);
      
      // Handle withdrawal limits
      if (limitsResult.success) {
        setWithdrawalLimits(limitsResult.data || {});
      }
      
      // Handle withdrawal history
      if (historyResult.success) {
        setWithdrawalHistory(historyResult.data || []);
      } else {
        // Fallback to localStorage
        const localHistory = JSON.parse(localStorage.getItem('userWithdrawals') || '[]');
        setWithdrawalHistory(localHistory);
      }

      // Balance is now managed by shared BalanceContext
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      addNotification('Error loading data. Using local data.', 'warning');
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  };

  // Using shared notification context - removed local showNotification function

  // Form change handler
  const handleFormChange = (field, value) => {
    setWithdrawalForm(prev => ({ ...prev, [field]: value }));
    if (validation[field]) {
      setValidation(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Enhanced form validation with backend requirements
  const validateForm = () => {
    const errors = {};
    const selectedMethod = withdrawalOptions.find(opt => opt.value === withdrawalForm.type);
    
    // Withdrawal type validation
    if (!withdrawalForm.type) {
      errors.type = 'Please select a withdrawal method';
    }
    
    // Amount validation
    if (!withdrawalForm.amount || isNaN(withdrawalForm.amount) || parseFloat(withdrawalForm.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    } else {
      const amount = parseFloat(withdrawalForm.amount);
      
      // Check balance
      if (amount > balance) {
        errors.amount = 'Insufficient balance';
      }
      
      // Check limits if method is selected
      if (selectedMethod) {
        if (amount < selectedMethod.minAmount) {
          errors.amount = `Minimum amount is ${selectedMethod.minAmount}`;
        }
        if (amount > selectedMethod.maxAmount) {
          errors.amount = `Maximum amount is ${selectedMethod.maxAmount}`;
        }
      }
    }
    
    // Method-specific validation
    if (withdrawalForm.type === 'bank') {
      if (!withdrawalForm.bankName.trim()) {
        errors.bankName = 'Bank name is required';
      }
      if (!withdrawalForm.accountName.trim()) {
        errors.accountName = 'Account name is required';
      }
      if (!withdrawalForm.accountNumber.trim()) {
        errors.accountNumber = 'Account number is required';
      }
    } else if (['bitcoin', 'ethereum', 'litecoin'].includes(withdrawalForm.type)) {
      if (!withdrawalForm.walletAddress.trim()) {
        errors.walletAddress = 'Wallet address is required';
      } else {
        // Basic wallet address validation
        const address = withdrawalForm.walletAddress.trim();
        if (withdrawalForm.type === 'bitcoin' && !address.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
          errors.walletAddress = 'Invalid Bitcoin address format';
        } else if (withdrawalForm.type === 'ethereum' && !address.match(/^0x[a-fA-F0-9]{40}$/)) {
          errors.walletAddress = 'Invalid Ethereum address format';
        }
      }
    }
    
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle withdrawal submission with confirmation
  const handleWithdrawalRequest = () => {
    if (!validateForm()) {
      addNotification('Please fix the form errors', 'error');
      return;
    }
    
    const selectedMethod = withdrawalOptions.find(opt => opt.value === withdrawalForm.type);
    setConfirmDialog({
      open: true,
      data: {
        method: selectedMethod,
        amount: parseFloat(withdrawalForm.amount),
        details: withdrawalForm
      }
    });
  };

  // Submit withdrawal to backend and admin dashboard
  const submitWithdrawal = async () => {
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      
      // Prepare comprehensive withdrawal data for backend
      const withdrawalData = {
        // User Information
        userId: user?.id || null,
        userName: user?.name || user?.username || null,
        userEmail: user?.email || null,
        
        // Withdrawal Details
        type: withdrawalForm.type,
        amount: parseFloat(withdrawalForm.amount),
        currency: ['bitcoin', 'ethereum', 'litecoin'].includes(withdrawalForm.type) 
          ? withdrawalForm.type.toUpperCase() 
          : 'USD',
        
        // Method-specific details
        bankDetails: withdrawalForm.type === 'bank' ? {
          bankName: withdrawalForm.bankName,
          accountName: withdrawalForm.accountName,
          accountNumber: withdrawalForm.accountNumber,
          swiftCode: withdrawalForm.swiftCode
        } : null,
        
        walletAddress: ['bitcoin', 'ethereum', 'litecoin'].includes(withdrawalForm.type) 
          ? withdrawalForm.walletAddress 
          : null,
        
        notes: withdrawalForm.notes,
        
        // Status and metadata
        status: 'pending',
        submittedAt: new Date().toISOString(),
        expectedProcessingTime: withdrawalOptions.find(opt => opt.value === withdrawalForm.type)?.processingTime,
        fee: withdrawalOptions.find(opt => opt.value === withdrawalForm.type)?.fee,
        
        // Additional metadata for backend
        ipAddress: null, // Will be set by backend
        userAgent: navigator.userAgent,
        sessionId: localStorage.getItem('sessionId') || null,
        userBalance: balance
      };

      // Step 1: Try to submit to backend API first
      let backendSuccess = false;
      let backendResponse = null;
      
      try {
        // Verify balance first
        const balanceCheck = await withdrawalsAPI.verifyBalance(
          withdrawalData.userId, 
          withdrawalData.amount
        );
        
        if (!balanceCheck.success) {
          throw new Error('Balance verification failed');
        }
        
        backendResponse = await withdrawalsAPI.submitWithdrawal(withdrawalData);
        
        if (backendResponse.success) {
          backendSuccess = true;
          addNotification(
            backendResponse.message || 'Withdrawal request submitted successfully! Processing will begin shortly.',
            'success'
          );
        } else {
          throw new Error(backendResponse.message || 'Backend submission failed');
        }
        
      } catch (apiError) {
        console.warn('Backend API failed, using localStorage fallback:', apiError);
        backendSuccess = false;
      }
      
      // Step 2: Fallback to localStorage if backend fails (for development/demo)
      if (!backendSuccess) {
        const localWithdrawalData = {
          ...withdrawalData,
          id: `local_${Date.now()}`,
          backendStatus: 'offline',
          localSubmission: true
        };
        
        // Store for admin dashboard
        const existingWithdrawals = JSON.parse(localStorage.getItem('pendingWithdrawals') || '[]');
        existingWithdrawals.push(localWithdrawalData);
        localStorage.setItem('pendingWithdrawals', JSON.stringify(existingWithdrawals));
        
        // Store in user's withdrawal history
        const userWithdrawals = JSON.parse(localStorage.getItem('userWithdrawals') || '[]');
        userWithdrawals.push(localWithdrawalData);
        localStorage.setItem('userWithdrawals', JSON.stringify(userWithdrawals));
        
        // Update user balance using shared context (deducts across all pages)
        deductBalance(parseFloat(withdrawalForm.amount));
        
        addNotification(
          'Withdrawal request submitted successfully! Waiting for admin approval.',
          'success'
        );
      }
      
      // Step 3: Reset form and close dialog
      setConfirmDialog({ open: false, data: null });
      setWithdrawalForm({
        type: '',
        amount: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        swiftCode: '',
        walletAddress: '',
        notes: ''
      });
      setValidation({});
      await loadInitialData(); // Refresh data
      
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      addNotification(
        'Error submitting withdrawal. Please try again or contact support.',
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  return (
    <Container maxWidth="xl">
      {loading.page && (
        <LinearProgress 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 9999,
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4CAF50'
            }
          }} 
        />
      )}
      
      <Box sx={{ 
        p: { xs: 1, sm: 2, md: 3 }, 
        minHeight: '100vh',
        bgcolor: theme.palette.background.default
      }}>
      {/* Professional Header - same as Dashboard */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 2, 
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
            <AccountBalanceWalletIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem' } }} />
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
              Withdraw Funds
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
              User: <span style={{ color: theme.palette.primary.main }}>{user?.name || user?.username || 'Not Available'}</span>
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
            icon={<VerifiedUserIcon />} 
            label="KYC" 
            color="primary" 
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
            startIcon={<EmailIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
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
            Mail Us
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<SettingsIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
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
            Settings
          </Button>
        </Stack>
      </Box>

      {/* Ticker Bar - same as Dashboard */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 1.5, sm: 2, md: 3 }, 
        bgcolor: '#181A20', 
        p: { xs: 1, sm: 1.5 }, 
        borderRadius: 2, 
        mb: 3, 
        overflowX: 'auto', 
        boxShadow: 1,
        '&::-webkit-scrollbar': { 
          height: { xs: 4, sm: 6 }
        },
        '&::-webkit-scrollbar-track': { 
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: 2
        },
        '&::-webkit-scrollbar-thumb': { 
          bgcolor: 'primary.main', 
          borderRadius: 2,
          '&:hover': {
            bgcolor: 'primary.dark'
          }
        },
        scrollbarWidth: 'thin',
        scrollbarColor: 'primary.main rgba(255,255,255,0.1)'
      }}>
        {tickerData.map((item, idx) => (
          <Box 
            key={idx} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 1 },
              minWidth: { xs: 140, sm: 160, md: 180 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' },
              py: { xs: 0.5, sm: 0 },
              px: { xs: 1, sm: 0 }
            }}
          >
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              fontWeight={600}
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8125rem' } }}
            >
              {item.label}
            </Typography>
            <Typography 
              variant="body1" 
              color="#fff" 
              fontWeight={700}
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' } }}
            >
              {item.value}
            </Typography>
            <Typography 
              variant="body2" 
              color={item.color} 
              fontWeight={700}
              sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}
            >
              {item.change}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Withdraw Form - centered and professional */}
      <Box maxWidth={{ xs: '100%', sm: 500 }} mx="auto" sx={{ px: { xs: 1, sm: 0 } }}>
        <Typography 
          variant="h4" 
          fontWeight={900} 
          color={theme.palette.primary.main} 
          sx={{ 
            mb: 2, 
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
          }}
        >
          Withdraw
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' },
          gap: { xs: 0.5, sm: 0 }
        }}>
          <Typography 
            variant="subtitle1" 
            fontWeight={700} 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' }, 
              color: '#888' 
            }}
          >
            Request Withdrawal
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              ml: { xs: 0, sm: 2 }, 
              color: theme.palette.primary.main, 
              fontWeight: 700,
              fontSize: { xs: '0.85rem', sm: '0.9rem' }
            }}
          >
            (Balance: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography 
          variant="h5" 
          fontWeight={800} 
          sx={{ 
            mb: 2, 
            textAlign: 'center',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}
        >
          Payment Details
        </Typography>
        <Card sx={{ 
          p: { xs: 2, sm: 2.5, md: 3 }, 
          borderRadius: 3, 
          boxShadow: 3, 
          bgcolor: theme.palette.background.paper,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: { xs: 'none', sm: 'translateY(-2px)' },
            boxShadow: { xs: 3, sm: 6 }
          }
        }}>
          <Typography 
            variant="subtitle2" 
            fontWeight={700} 
            sx={{ 
              mb: 1,
              fontSize: { xs: '0.85rem', sm: '0.9rem' }
            }}
          >
            Withdrawal Type
          </Typography>
          <TextField
            select
            fullWidth
            label="Select withdrawal method"
            value={withdrawalForm.type}
            onChange={e => handleFormChange('type', e.target.value)}
            sx={{ mb: 2 }}
            size="medium"
            error={!!validation.type}
            helperText={validation.type}
            SelectProps={{
              sx: {
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }
            }}
            InputLabelProps={{
              sx: {
                fontSize: { xs: '0.85rem', sm: '0.9rem' }
              }
            }}
          >
            {withdrawalOptions.map(option => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Min: {option.minAmount} | Max: {option.maxAmount} | Fee: {option.fee}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {/* Conditional Form Fields */}
          {withdrawalForm.type === 'bank' && (
            <>
              <TextField 
                label="Bank Name" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={withdrawalForm.bankName} 
                onChange={e => handleFormChange('bankName', e.target.value)}
                size="medium"
                error={!!validation.bankName}
                helperText={validation.bankName}
                InputProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
                }}
              />
              <TextField 
                label="Account Name" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={withdrawalForm.accountName} 
                onChange={e => handleFormChange('accountName', e.target.value)}
                size="medium"
                error={!!validation.accountName}
                helperText={validation.accountName}
                InputProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
                }}
              />
              <TextField 
                label="Account Number" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={withdrawalForm.accountNumber} 
                onChange={e => handleFormChange('accountNumber', e.target.value)}
                size="medium"
                error={!!validation.accountNumber}
                helperText={validation.accountNumber}
                InputProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
                }}
              />
              <TextField 
                label="SWIFT/BIC Code (Optional)" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={withdrawalForm.swiftCode} 
                onChange={e => handleFormChange('swiftCode', e.target.value)}
                size="medium"
                InputProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
                }}
              />
            </>
          )}
          {['bitcoin', 'ethereum', 'litecoin'].includes(withdrawalForm.type) && (
            <TextField 
              label={`${withdrawalForm.type.charAt(0).toUpperCase() + withdrawalForm.type.slice(1)} Wallet Address`}
              fullWidth 
              sx={{ mb: 2 }} 
              value={withdrawalForm.walletAddress} 
              onChange={e => handleFormChange('walletAddress', e.target.value)}
              size="medium"
              error={!!validation.walletAddress}
              helperText={validation.walletAddress || `Enter your ${withdrawalForm.type} wallet address`}
              InputProps={{
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
              }}
            />
          )}

          <TextField
            label="Amount $"
            fullWidth
            sx={{ mb: 2 }}
            value={withdrawalForm.amount}
            onChange={e => handleFormChange('amount', e.target.value)}
            type="number"
            inputProps={{ min: 0, max: balance }}
            size="medium"
            error={!!validation.amount}
            helperText={validation.amount || `Available balance: $${balance.toLocaleString()}`}
            InputProps={{
              sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
            }}
            InputLabelProps={{
              sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
            }}
          />
          
          <TextField 
            label="Notes (Optional)" 
            fullWidth 
            sx={{ mb: 2 }} 
            value={withdrawalForm.notes} 
            onChange={e => handleFormChange('notes', e.target.value)}
            multiline
            rows={2}
            size="small"
            placeholder="Any additional information for this withdrawal..."
            InputProps={{
              sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
            }}
            InputLabelProps={{
              sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
            }}
          />
          
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large" 
            onClick={handleWithdrawalRequest}
            disabled={loading.submit || !withdrawalForm.type || !withdrawalForm.amount}
            sx={{ 
              fontWeight: 700,
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              mt: 1
            }}
          >
            {loading.submit ? 'Processing...' : 'Request Withdrawal'}
          </Button>
        </Card>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ open: false, data: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Confirm Withdrawal Request
        </DialogTitle>
        <DialogContent>
          {confirmDialog.data && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Withdrawal Details:
              </Typography>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography><strong>Method:</strong> {confirmDialog.data.method.label}</Typography>
                <Typography><strong>Amount:</strong> ${confirmDialog.data.amount.toLocaleString()}</Typography>
                <Typography><strong>Processing Time:</strong> {confirmDialog.data.method.processingTime}</Typography>
                <Typography><strong>Fee:</strong> {confirmDialog.data.method.fee}</Typography>
                
                {withdrawalForm.type === 'bank' && (
                  <Box sx={{ mt: 1 }}>
                    <Typography><strong>Bank:</strong> {withdrawalForm.bankName}</Typography>
                    <Typography><strong>Account:</strong> {withdrawalForm.accountName}</Typography>
                    <Typography><strong>Account #:</strong> {withdrawalForm.accountNumber}</Typography>
                  </Box>
                )}
                
                {['bitcoin', 'ethereum', 'litecoin'].includes(withdrawalForm.type) && (
                  <Typography sx={{ mt: 1, wordBreak: 'break-all' }}>
                    <strong>Wallet:</strong> {withdrawalForm.walletAddress}
                  </Typography>
                )}
              </Box>
              
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please verify all details carefully. Withdrawal requests cannot be cancelled once submitted.
              </Alert>
              
              <Alert severity="info">
                Your withdrawal will be processed by our admin team and you will receive email notifications about the status.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ open: false, data: null })}
            color="secondary"
          >
            Cancel
          </Button>
          <Button 
            onClick={submitWithdrawal}
            variant="contained"
            color="primary"
            disabled={loading.submit}
          >
            {loading.submit ? 'Submitting...' : 'Confirm Withdrawal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Using shared notification system - removed local Snackbar */}
      </Box>
    </Container>
  );
}
