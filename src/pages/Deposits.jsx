import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  Button, 
  Modal, 
  TextField, 
  Divider, 
  Avatar, 
  Stack, 
  Chip,
  Container,
  Alert,
  Snackbar,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  FormHelperText
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTheme } from '@mui/material/styles';
import { financialAPI, marketAPI } from '../services/api';
import { useUser } from '../contexts/UserContext';

// Default deposit methods (fallback)
const defaultDepositMethods = [
  {
    id: 'btc',
    name: 'Bitcoin',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    qr: 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    currency: 'BTC',
    minAmount: 0.001,
    maxAmount: 10,
    processingTime: '15-30 minutes',
    status: 'active'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    qr: 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=ethereum:0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    currency: 'ETH',
    minAmount: 0.01,
    maxAmount: 100,
    processingTime: '5-15 minutes',
    status: 'active'
  },
  {
    id: 'ltc',
    name: 'Litecoin',
    address: 'LcHKZQJQ8Qh6QJQ8Qh6QJQ8Qh6QJQ8Qh6Q',
    qr: 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=litecoin:LcHKZQJQ8Qh6QJQ8Qh6QJQ8Qh6QJQ8Qh6Q',
    currency: 'LTC',
    minAmount: 0.1,
    maxAmount: 500,
    processingTime: '10-20 minutes',
    status: 'active'
  },
];

// Tab panel component
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Deposits() {
  const theme = useTheme();
  const { user } = useUser();
  
  // State management
  const [currentTab, setCurrentTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [depositForm, setDepositForm] = useState({
    amount: '',
    proofFile: null,
    depositType: '',
    notes: ''
  });
  const [validation, setValidation] = useState({});
  const [tickerData, setTickerData] = useState([]);
  const [depositMethods, setDepositMethods] = useState(defaultDepositMethods);
  const [depositHistory, setDepositHistory] = useState([]);
  const [loading, setLoading] = useState({
    page: true,
    submit: false,
    refresh: false
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!depositForm.amount || parseFloat(depositForm.amount) <= 0) {
      errors.amount = 'Amount is required and must be greater than 0';
    }
    
    if (selectedMethod && selectedMethod !== 'other') {
      const method = depositMethods.find(m => m.id === selectedMethod.id);
      if (method) {
        if (parseFloat(depositForm.amount) < method.minAmount) {
          errors.amount = `Minimum amount is ${method.minAmount} ${method.currency}`;
        }
        if (parseFloat(depositForm.amount) > method.maxAmount) {
          errors.amount = `Maximum amount is ${method.maxAmount} ${method.currency}`;
        }
      }
    }
    
    if (selectedMethod === 'other' && !depositForm.depositType) {
      errors.depositType = 'Deposit type is required';
    }
    
    if (selectedMethod && selectedMethod !== 'other' && !depositForm.proofFile) {
      errors.proofFile = 'Payment proof is required';
    }
    
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  // Load ticker data and deposit methods from API
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(prev => ({ ...prev, page: true }));
      
      const [tickerResponse, methodsResponse, historyResponse] = await Promise.all([
        marketAPI.getTickerData().catch(() => ({ success: false })),
        financialAPI.getPaymentMethods().catch(() => ({ success: false })),
        financialAPI.getDepositHistory(user?.id).catch(() => ({ success: false }))
      ]);
      
      // Handle ticker data
      if (tickerResponse.success) {
        setTickerData(tickerResponse.data);
      } else {
        setTickerData([
          { label: 'BTC/USD', value: '65,432.10', change: '+1,247.50 (+1.94%)', color: 'success.main' },
          { label: 'ETH/USD', value: '3,890.75', change: '-85.25 (-2.14%)', color: 'error.main' },
          { label: 'LTC/USD', value: '95.42', change: '+2.15 (+2.31%)', color: 'success.main' },
          { label: 'EUR/USD', value: '1.1809', change: '-0.0023 (-0.19%)', color: 'error.main' },
        ]);
      }
      
      // Handle deposit methods
      if (methodsResponse.success) {
        setDepositMethods(methodsResponse.data);
      }
      
      // Handle deposit history
      if (historyResponse.success) {
        setDepositHistory(historyResponse.data);
      } else {
        // Demo deposit history
        setDepositHistory([
          {
            id: '1',
            amount: '0.005',
            currency: 'BTC',
            usdValue: '325.50',
            status: 'completed',
            date: '2024-01-15T10:30:00Z',
            method: 'Bitcoin',
            txHash: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
          },
          {
            id: '2',
            amount: '0.15',
            currency: 'ETH',
            usdValue: '583.61',
            status: 'pending',
            date: '2024-01-14T14:20:00Z',
            method: 'Ethereum',
            txHash: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
          }
        ]);
      }
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      showNotification('Error loading data. Using demo data.', 'warning');
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  };

  const refreshData = async () => {
    setLoading(prev => ({ ...prev, refresh: true }));
    await loadInitialData();
    setLoading(prev => ({ ...prev, refresh: false }));
    showNotification('Data refreshed successfully', 'success');
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleFormChange = (field, value) => {
    setDepositForm(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validation[field]) {
      setValidation(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        showNotification('Please upload a valid image or PDF file', 'error');
        return;
      }
      
      if (file.size > maxSize) {
        showNotification('File size must be less than 5MB', 'error');
        return;
      }
      
      handleFormChange('proofFile', file);
      showNotification('File uploaded successfully', 'success');
    }
  };

  const submitDeposit = async () => {
    if (!validateForm()) {
      showNotification('Please fix the form errors', 'error');
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      
      // Prepare deposit data
      const depositData = {
        userId: user?.id,
        amount: parseFloat(depositForm.amount),
        method: selectedMethod === 'other' ? depositForm.depositType : selectedMethod.name,
        currency: selectedMethod === 'other' ? 'USD' : selectedMethod.currency,
        walletAddress: selectedMethod === 'other' ? null : selectedMethod.address,
        notes: depositForm.notes,
        proofFile: depositForm.proofFile
      };
      
      // Submit to backend
      const response = await financialAPI.submitDeposit(depositData);
      
      if (response.success) {
        showNotification('Deposit submitted successfully! You will receive confirmation shortly.', 'success');
        handleCloseModal();
        refreshData(); // Refresh deposit history
      } else {
        showNotification(response.message || 'Failed to submit deposit', 'error');
      }
      
    } catch (error) {
      console.error('Error submitting deposit:', error);
      showNotification('Network error. Please try again.', 'error');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleOpenModal = (method) => {
    setSelectedMethod(method);
    setModalOpen(true);
    // Reset form
    setDepositForm({
      amount: '',
      proofFile: null,
      depositType: '',
      notes: ''
    });
    setValidation({});
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMethod(null);
    setDepositForm({
      amount: '',
      proofFile: null,
      depositType: '',
      notes: ''
    });
    setValidation({});
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'failed':
      case 'rejected':
        return <CancelIcon color="error" />;
      default:
        return <PendingIcon color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'rejected':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        p: { xs: 1, sm: 2, md: 3 }, 
        minHeight: '100vh',
        bgcolor: theme.palette.background.default
      }}>
      
      {/* Loading Progress Bar */}
      {(loading.page || loading.submit || loading.refresh) && (
        <LinearProgress 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1301,
            height: 3
          }} 
        />
      )}

      {/* Header - Consistent with Dashboard */}
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
              Deposit Funds
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
              User: <span style={{ color: theme.palette.primary.main }}>{user?.username || 'theophilus'}</span>
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
            label={user?.kycStatus === 'verified' ? 'KYC Verified' : 'KYC Pending'} 
            color={user?.kycStatus === 'verified' ? 'success' : 'warning'} 
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
            variant="outlined"
            color="primary" 
            startIcon={<RefreshIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
            size="small"
            onClick={refreshData}
            disabled={loading.refresh}
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 32, sm: 36 },
              px: { xs: 1.5, sm: 2, md: 3 },
              fontWeight: 600,
              minWidth: { xs: 'auto', sm: 80 },
              whiteSpace: 'nowrap'
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Ticker Bar */}
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

      <Typography 
        variant="h4" 
        fontWeight={700} 
        sx={{ 
          mb: 3, 
          color: theme.palette.primary.main, 
          textAlign: 'center',
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
        }}
      >
        Deposit Using Bitcoin/Ethereum/Litecoin
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
        {depositMethods.map((method) => (
          <Card key={method.name} sx={{ 
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
              variant="h5" 
              fontWeight={700} 
              sx={{ 
                mb: 1,
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              {method.name} Deposit Method
            </Typography>
            <Typography sx={{ 
              mb: 1, 
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
              lineHeight: 1.4
            }}>
              Please make sure you upload your payment proof for quick payment verification
            </Typography>
            <Typography sx={{ 
              mb: 2, 
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
              lineHeight: 1.4
            }}>
              On confirmation, our system will automatically convert your {method.name} to live value of Dollars. Ensure that you deposit the actual {method.name} to the address specified on the payment Page.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleOpenModal(method)}
              fullWidth
              size="large"
              sx={{ 
                fontWeight: 600,
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Make Deposit
            </Button>
          </Card>
        ))}

        {/* Other Deposit Method */}
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
            variant="h5" 
            fontWeight={700} 
            sx={{ 
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            Other Deposit Method
          </Typography>
          <Typography sx={{ 
            mb: 1, 
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            lineHeight: 1.4
          }}>
            Request other available Deposit Method
          </Typography>
          <Typography sx={{ 
            mb: 1, 
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            lineHeight: 1.4
          }}>
            Once payment is made using this method you are to send your payment proof to our support mail <b>interspace@interspacebroker.com</b>
          </Typography>
          <Typography sx={{ 
            mb: 2, 
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            lineHeight: 1.4
          }}>
            Once requested, you will receive the payment details via our support mail....
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => handleOpenModal('other')}
            fullWidth
            size="large"
            sx={{ 
              fontWeight: 600,
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Proceed
          </Button>
        </Card>
      </Box>

      {/* Deposit Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          bgcolor: '#232742', 
          p: { xs: 2, sm: 3, md: 4 }, 
          borderRadius: 3, 
          boxShadow: 6, 
          minWidth: { xs: '95vw', sm: 400, md: 450 }, 
          maxWidth: { xs: '98vw', sm: 500, md: 550 },
          maxHeight: { xs: '90vh', sm: 'none' },
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: 6
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: 3
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'primary.main',
            borderRadius: 3
          }
        }}>
          {selectedMethod && selectedMethod !== 'other' ? (
            <>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  textAlign: 'center'
                }}
              >
                {selectedMethod.name} Deposit Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography sx={{ 
                mb: 1, 
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                fontWeight: 500
              }}>
                Deposit Address:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography sx={{ 
                  wordBreak: 'break-all', 
                  color: theme.palette.primary.main, 
                  mr: { xs: 0, sm: 1 },
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  textAlign: { xs: 'center', sm: 'left' },
                  fontFamily: 'monospace',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  p: 1,
                  borderRadius: 1,
                  flex: 1
                }}>
                  {selectedMethod.address}
                </Typography>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => {navigator.clipboard.writeText(selectedMethod.address)}}
                  sx={{ 
                    minWidth: { xs: '100%', sm: 'auto' },
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    fontWeight: 600
                  }}
                >
                  Copy
                </Button>
              </Box>
              <Box sx={{ 
                mb: 2, 
                display: 'flex', 
                justifyContent: 'center',
                p: 1
              }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${selectedMethod.address}`} 
                  alt="Deposit QR" 
                  style={{ 
                    width: 120, 
                    height: 120,
                    borderRadius: 8,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }} 
                />
              </Box>
              <TextField 
                label="Amount" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                size="medium"
                type="number"
                inputProps={{ min: 0 }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ 
                  mb: 1, 
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  fontWeight: 500
                }}>
                  Upload Payment Proof:
                </Typography>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setProof(e.target.files[0])}
                  style={{ 
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #444',
                    borderRadius: 6,
                    background: '#181A20',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleCloseModal}
                  fullWidth
                  sx={{ 
                    fontWeight: 600,
                    py: { xs: 1, sm: 1.25 }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleCloseModal}
                  fullWidth
                  sx={{ 
                    fontWeight: 600,
                    py: { xs: 1, sm: 1.25 }
                  }}
                >
                  Submit
                </Button>
              </Box>
            </>
          ) : selectedMethod === 'other' ? (
            <>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  textAlign: 'center'
                }}
              >
                Other Deposit Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography 
                variant="subtitle2" 
                fontWeight={700} 
                sx={{ 
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  mb: 1
                }}
              >
                Full Name: {user?.username || 'Theophilus Crown'}
              </Typography>
              <Typography 
                variant="subtitle2" 
                fontWeight={700} 
                sx={{ 
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  mb: 1
                }}
              >
                Email: {user?.email || 'theophiluscrown693@gmail.com'}
              </Typography>
              <Typography 
                variant="subtitle2" 
                fontWeight={700} 
                sx={{ 
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  mb: 2
                }}
              >
                Account Type: Deposit Type
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Deposit Type</InputLabel>
                <Select
                  value={depositForm.depositType}
                  onChange={(e) => handleFormChange('depositType', e.target.value)}
                  error={!!validation.depositType}
                >
                  {otherDepositMethods.map((method) => (
                    <MenuItem key={method} value={method}>{method}</MenuItem>
                  ))}
                </Select>
                {validation.depositType && (
                  <FormHelperText error>{validation.depositType}</FormHelperText>
                )}
              </FormControl>
              <TextField 
                label="Amount (USD)" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={depositForm.amount} 
                onChange={e => handleFormChange('amount', e.target.value)}
                size="medium"
                type="number"
                inputProps={{ min: 0 }}
                error={!!validation.amount}
                helperText={validation.amount}
              />
              
              <TextField 
                label="Notes (Optional)" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={depositForm.notes} 
                onChange={e => handleFormChange('notes', e.target.value)}
                multiline
                rows={3}
                placeholder="Please provide any additional details for your deposit request..."
              />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleCloseModal}
                  fullWidth
                  sx={{ 
                    fontWeight: 600,
                    py: { xs: 1, sm: 1.25 }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={submitDeposit}
                  disabled={loading.submit}
                  fullWidth
                  sx={{ 
                    fontWeight: 600,
                    py: { xs: 1, sm: 1.25 }
                  }}
                >
                  {loading.submit ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Box>
            </>
          ) : null}
        </Box>
      </Modal>
      </Box>
    </Container>
  );
}
