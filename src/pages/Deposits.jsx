import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTheme } from '@mui/material/styles';

// Default deposit methods
const defaultDepositMethods = [
  {
    id: 'btc',
    name: 'Bitcoin',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
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
    currency: 'LTC',
    minAmount: 0.1,
    maxAmount: 500,
    processingTime: '10-20 minutes',
    status: 'active'
  },
];

const otherDepositMethods = [
  'Bank Transfer',
  'Bitcoin Cash',
  'USDT',
  'PayPal',
  'Stellar',
  'Western Union',
  'Skrill',
  'MoneyGram'
];

export default function Deposits() {
  const theme = useTheme();
  
  // State management
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [depositForm, setDepositForm] = useState({
    amount: '',
    proofFile: null,
    depositType: '',
    notes: ''
  });
  const [validation, setValidation] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [loading, setLoading] = useState(false);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleFormChange = (field, value) => {
    setDepositForm(prev => ({ ...prev, [field]: value }));
    if (validation[field]) {
      setValidation(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
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

  const validateForm = () => {
    const errors = {};
    
    if (!depositForm.amount || parseFloat(depositForm.amount) <= 0) {
      errors.amount = 'Amount is required and must be greater than 0';
    }
    
    if (selectedMethod === 'other' && !depositForm.depositType) {
      errors.depositType = 'Deposit type is required';
    }
    
    if (selectedMethod !== 'other' && !depositForm.proofFile) {
      errors.proofFile = 'Payment proof is required';
    }
    
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const submitDeposit = async () => {
    if (!validateForm()) {
      showNotification('Please fix the form errors', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare deposit data for admin approval
      const depositData = {
        id: Date.now().toString(),
        userId: 'user123',
        userName: 'Theophilus Crown',
        userEmail: 'theophiluscrown693@gmail.com',
        amount: parseFloat(depositForm.amount),
        method: selectedMethod === 'other' ? depositForm.depositType : selectedMethod.name,
        currency: selectedMethod === 'other' ? 'USD' : selectedMethod.currency,
        walletAddress: selectedMethod === 'other' ? null : selectedMethod.address,
        notes: depositForm.notes,
        proofFile: depositForm.proofFile?.name || null,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        type: 'deposit'
      };
      
      // Store in localStorage for admin to see
      const existingDeposits = JSON.parse(localStorage.getItem('pendingDeposits') || '[]');
      existingDeposits.push(depositData);
      localStorage.setItem('pendingDeposits', JSON.stringify(existingDeposits));
      
      // Also store in user's deposit history
      const userDeposits = JSON.parse(localStorage.getItem('userDeposits') || '[]');
      userDeposits.push(depositData);
      localStorage.setItem('userDeposits', JSON.stringify(userDeposits));
      
      showNotification('Deposit submitted successfully! Waiting for admin approval.', 'success');
      handleCloseModal();
      
    } catch (error) {
      console.error('Error submitting deposit:', error);
      showNotification('Error submitting deposit. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (method) => {
    setSelectedMethod(method);
    setModalOpen(true);
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

  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        p: { xs: 1, sm: 2, md: 3 }, 
        minHeight: '100vh',
        bgcolor: theme.palette.background.default
      }}>

      {/* Header */}
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
              User: <span style={{ color: theme.palette.primary.main }}>Theophilus Crown</span>
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
            label="KYC Verified" 
            color="success" 
            variant="outlined" 
            size="small"
            sx={{ 
              height: { xs: 28, sm: 32 },
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              fontWeight: 600
            }}
          />
          <Button 
            variant="outlined"
            color="primary" 
            startIcon={<RefreshIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
            size="small"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 32, sm: 36 },
              px: { xs: 1.5, sm: 2, md: 3 },
              fontWeight: 600
            }}
          >
            Refresh
          </Button>
        </Stack>
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
        {defaultDepositMethods.map((method) => (
          <Card key={method.id} sx={{ 
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
              Min: {method.minAmount} {method.currency} | Max: {method.maxAmount} {method.currency}
            </Typography>
            <Typography sx={{ 
              mb: 2, 
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
              lineHeight: 1.4,
              color: 'text.secondary'
            }}>
              Processing Time: {method.processingTime}
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
            Other Deposit Methods
          </Typography>
          <Typography sx={{ 
            mb: 1, 
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            lineHeight: 1.4
          }}>
            Request other available deposit methods
          </Typography>
          <Typography sx={{ 
            mb: 2, 
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            lineHeight: 1.4,
            color: 'text.secondary'
          }}>
            Bank Transfer, PayPal, Western Union, and more...
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
          overflowY: 'auto'
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
              
              <Typography sx={{ mb: 1, fontSize: { xs: '0.85rem', sm: '0.9rem' }, fontWeight: 500 }}>
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
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  fontFamily: 'monospace',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  p: 1,
                  borderRadius: 1,
                  flex: 1,
                  mr: { xs: 0, sm: 1 }
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
              
              <TextField 
                label="Amount" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={depositForm.amount} 
                onChange={e => handleFormChange('amount', e.target.value)}
                size="medium"
                type="number"
                inputProps={{ min: selectedMethod.minAmount, max: selectedMethod.maxAmount }}
                error={!!validation.amount}
                helperText={validation.amount}
              />
              
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ mb: 1, fontSize: { xs: '0.85rem', sm: '0.9rem' }, fontWeight: 500 }}>
                  Upload Payment Proof:
                </Typography>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileUpload}
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
                {validation.proofFile && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {validation.proofFile}
                  </Typography>
                )}
              </Box>
              
              <TextField 
                label="Notes (Optional)" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={depositForm.notes} 
                onChange={e => handleFormChange('notes', e.target.value)}
                multiline
                rows={2}
                size="small"
              />
              
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
                  sx={{ fontWeight: 600, py: { xs: 1, sm: 1.25 } }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={submitDeposit}
                  disabled={loading}
                  fullWidth
                  sx={{ fontWeight: 600, py: { xs: 1, sm: 1.25 } }}
                >
                  {loading ? 'Submitting...' : 'Submit for Approval'}
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
                Full Name: Theophilus Crown
              </Typography>
              <Typography 
                variant="subtitle2" 
                fontWeight={700} 
                sx={{ 
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  mb: 1
                }}
              >
                Email: theophiluscrown693@gmail.com
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
                label="Notes" 
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
                  sx={{ fontWeight: 600, py: { xs: 1, sm: 1.25 } }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={submitDeposit}
                  disabled={loading}
                  fullWidth
                  sx={{ fontWeight: 600, py: { xs: 1, sm: 1.25 } }}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Box>
            </>
          ) : null}
        </Box>
      </Modal>

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
    </Container>
  );
}
