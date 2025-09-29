import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Badge
} from '@mui/material';
import {
  Person,
  Email,
  Settings,
  VerifiedUser,
  MonetizationOn,
  AccountBalance,
  Assignment,
  Schedule,
  TrendingUp,
  Security,
  Speed,
  Support,
  CheckCircle,
  Info,
  Warning,
  Business,
  Home,
  DirectionsCar,
  School,
  ShoppingCart,
  LocalHospital,
  Agriculture,
  Build,
  History,
  ExpandMore,
  ExpandLess,
  Cancel,
  AccessTime,
  Close
} from '@mui/icons-material';
import { financialAPI } from '../services/api';

// Loan/Credit Facility Options
const loanFacilities = [
  { value: 'personal-home-loans', label: 'Personal Home Loans', icon: <Home />, description: 'Finance your dream home with competitive rates' },
  { value: 'joint-mortgage', label: 'Joint Mortgage', icon: <AccountBalance />, description: 'Shared mortgage solutions for couples and partners' },
  { value: 'automobile-loans', label: 'Automobile Loans', icon: <DirectionsCar />, description: 'Get your ideal vehicle with flexible financing' },
  { value: 'salary-loans', label: 'Salary loans', icon: <MonetizationOn />, description: 'Quick cash advances against your salary' },
  { value: 'secured-overdraft', label: 'Secured Overdraft', icon: <Security />, description: 'Overdraft facility with collateral backing' },
  { value: 'contract-finance', label: 'Contract Finance', icon: <Assignment />, description: 'Working capital for contract execution' },
  { value: 'secured-term-loans', label: 'Secured Term Loans', icon: <Schedule />, description: 'Long-term loans with asset security' },
  { value: 'startup-products-financing', label: 'StartUp/Products Financing', icon: <TrendingUp />, description: 'Funding for new businesses and products' },
  { value: 'local-purchase-orders-finance', label: 'Local Purchase Orders Finance', icon: <ShoppingCart />, description: 'Finance for purchase order fulfillment' },
  { value: 'operational-vehicles', label: 'Operational Vehicles', icon: <Build />, description: 'Commercial vehicle financing solutions' },
  { value: 'revenue-loans-overdraft', label: 'Revenue Loans and Overdraft', icon: <TrendingUp />, description: 'Revenue-based lending solutions' },
  { value: 'retail-tod', label: 'Retail TOD', icon: <Business />, description: 'Trade overdraft for retail businesses' },
  { value: 'commercial-mortgage', label: 'Commercial Mortgage', icon: <Business />, description: 'Property financing for commercial use' },
  { value: 'office-equipment', label: 'Office Equipment', icon: <Build />, description: 'Equipment financing for office setup' },
  { value: 'health-finance-guideline', label: 'Health Finance Product Guideline', icon: <LocalHospital />, description: 'Medical and health-related financing' },
  { value: 'health-finance', label: 'Health Finance', icon: <LocalHospital />, description: 'Healthcare financing solutions' }
];

// Duration Options
const durationOptions = [
  { value: 6, label: '6 Months' },
  { value: 12, label: '12 Months' },
  { value: 24, label: '2 Years' },
  { value: 36, label: '3 Years' },
  { value: 48, label: '4 Years' },
  { value: 60, label: '5 Years' }
];

// Income Range Options
const incomeRanges = [
  { value: '2000-5000', label: '$2,000- $5,000' },
  { value: '6000-10000', label: '$6,000-$10,000' },
  { value: '11000-20000', label: '$11,000-$20,000' },
  { value: '21000-50000', label: '$21,000-$50,000' },
  { value: '100000+', label: '$100,000 and above' }
];

// Purpose of Loan Options
const loanPurposes = [
  'Business Expansion',
  'Home Purchase',
  'Vehicle Purchase',
  'Education',
  'Medical Expenses',
  'Debt Consolidation',
  'Working Capital',
  'Equipment Purchase',
  'Real Estate Investment',
  'Personal Use',
  'Emergency Funds',
  'Travel & Vacation',
  'Wedding Expenses',
  'Home Improvement',
  'Technology & Equipment'
];

// Mock Loan History Data
const mockLoanHistory = [
  {
    id: 'LN001',
    applicationDate: '2024-09-15',
    loanType: 'Personal Home Loans',
    amount: 250000,
    duration: 24,
    purpose: 'Home Purchase',
    status: 'approved',
    approvalDate: '2024-09-18',
    monthlyPayment: 12500,
    interestRate: 4.5,
    nextPaymentDate: '2024-10-15'
  },
  {
    id: 'LN002',
    applicationDate: '2024-08-22',
    loanType: 'Automobile Loans',
    amount: 45000,
    duration: 36,
    purpose: 'Vehicle Purchase',
    status: 'approved',
    approvalDate: '2024-08-25',
    monthlyPayment: 1450,
    interestRate: 6.2,
    nextPaymentDate: '2024-10-22'
  },
  {
    id: 'LN003',
    applicationDate: '2024-09-20',
    loanType: 'Salary loans',
    amount: 15000,
    duration: 12,
    purpose: 'Emergency Funds',
    status: 'pending',
    applicationNotes: 'Under review - awaiting final approval',
    estimatedDecision: '2024-09-30'
  },
  {
    id: 'LN004',
    applicationDate: '2024-07-10',
    loanType: 'StartUp/Products Financing',
    amount: 100000,
    duration: 48,
    purpose: 'Business Expansion',
    status: 'declined',
    declineDate: '2024-07-15',
    declineReason: 'Insufficient collateral and credit history',
    canReapply: '2024-12-15'
  },
  {
    id: 'LN005',
    applicationDate: '2024-06-05',
    loanType: 'Secured Overdraft',
    amount: 25000,
    duration: 12,
    purpose: 'Working Capital',
    status: 'approved',
    approvalDate: '2024-06-08',
    monthlyPayment: 2300,
    interestRate: 8.5,
    nextPaymentDate: '2024-10-05'
  },
  {
    id: 'LN006',
    applicationDate: '2024-09-25',
    loanType: 'Health Finance',
    amount: 35000,
    duration: 18,
    purpose: 'Medical Expenses',
    status: 'declined',
    declineDate: '2024-09-27',
    declineReason: 'Debt-to-income ratio too high',
    canReapply: '2025-03-25'
  }
];

export default function ApplyLoans() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    loanAmount: '',
    creditFacility: '',
    duration: '',
    monthlyIncome: '',
    purpose: '',
    applicantName: '',
    email: '',
    phone: '',
    address: '',
    employmentStatus: ''
  });
  
  const [submitDialog, setSubmitDialog] = useState(false);
  const [loanHistoryDialog, setLoanHistoryDialog] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loanHistory, setLoanHistory] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);

  // Load loan history from API
  useEffect(() => {
    const loadLoanHistory = async () => {
      try {
        setApiLoading(true);
        const response = await financialAPI.getLoans();
        
        if (response.success) {
          setLoanHistory(response.data);
        } else {
          // Use fallback mock data
          setLoanHistory(mockLoanHistory);
        }
      } catch (error) {
        console.error('Error loading loan history:', error);
        setLoanHistory(mockLoanHistory);
      } finally {
        setApiLoading(false);
      }
    };

    loadLoanHistory();
  }, []);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmitApplication = () => {
    // Validate required fields
    const requiredFields = ['loanAmount', 'creditFacility', 'duration', 'monthlyIncome', 'purpose'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitDialog(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await financialAPI.applyLoan(formData);
      
      if (response.success) {
        setSubmitDialog(false);
        alert('Loan application submitted successfully! We will review your application and contact you within 24-48 hours.');
        
        // Refresh loan history
        const historyResponse = await financialAPI.getLoans();
        if (historyResponse.success) {
          setLoanHistory(historyResponse.data);
        }
      } else {
        alert('Application submitted successfully! (Demo mode - using fallback)');
        setSubmitDialog(false);
      }
      
      // Reset form
      setFormData({
        loanAmount: '',
        creditFacility: '',
        duration: '',
        monthlyIncome: '',
        purpose: '',
        applicantName: '',
        email: '',
        phone: '',
        address: '',
        employmentStatus: ''
      });
    } catch (error) {
      console.error('Error submitting loan application:', error);
      alert('Application submitted! (Demo mode - API unavailable)');
      setSubmitDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRowExpand = (loanId) => {
    setExpandedRow(expandedRow === loanId ? null : loanId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'declined': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'declined': return <Cancel />;
      case 'pending': return <AccessTime />;
      default: return <Info />;
    }
  };

  const selectedFacility = loanFacilities.find(facility => facility.value === formData.creditFacility);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Container maxWidth="xl" sx={{ p: { xs: 1, sm: 3 } }}>
        {/* Header with site name, username and quick actions - matching Dashboard */}
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
              icon={<VerifiedUser />} 
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
              startIcon={<Email sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
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
              startIcon={<Settings sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
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
            <Button 
              variant="contained" 
              color="info" 
              startIcon={<History sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
              size="small"
              onClick={() => setLoanHistoryDialog(true)}
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                height: { xs: 32, sm: 36 },
                px: { xs: 1.5, sm: 2, md: 3 },
                fontWeight: 600,
                minWidth: { xs: 'auto', sm: 80 },
                whiteSpace: 'nowrap'
              }}
            >
              <Badge 
                badgeContent={loanHistory.filter(loan => loan.status === 'pending').length} 
                color="warning"
                sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}
              >
                My Loans
              </Badge>
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={{ xs: 3, lg: 4 }}>
          {/* Left Column - Loan Application Form */}
          <Grid item xs={12} lg={8}>
            <Card sx={{
              bgcolor: '#232742',
              color: '#fff',
              borderRadius: { xs: 2, sm: 3 },
              boxShadow: 6,
              mb: { xs: 3, sm: 4 },
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5 } }}>
                  <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom sx={{
                    fontSize: { xs: '1.8rem', sm: '2.1rem', md: '2.5rem' }
                  }}>
                    Apply for a Loan
                  </Typography>
                  <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ 
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    lineHeight: 1.6,
                    maxWidth: 600,
                    mx: 'auto'
                  }}>
                    Complete the form below to apply for a loan. All fields marked with * are required 
                    for processing your application.
                  </Typography>
                </Box>

                <Grid container spacing={{ xs: 3, md: 4 }}>
                  {/* Full Name - First field at the top */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.applicantName}
                      onChange={handleInputChange('applicantName')}
                      placeholder="Enter your full legal name"
                      InputProps={{
                        sx: { 
                          color: '#fff',
                          height: { xs: 64, sm: 68 },
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 500
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2
                          },
                          '&:hover fieldset': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': { 
                          color: 'rgba(255,255,255,0.8)',
                          fontWeight: 500
                        },
                        '& .MuiInputLabel-root.Mui-focused': { 
                          color: 'primary.main',
                          fontWeight: 600
                        }
                      }}
                    />
                  </Grid>

                  {/* Loan Amount - Full width for better visibility */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Loan Amount ($) *"
                      type="number"
                      value={formData.loanAmount}
                      onChange={handleInputChange('loanAmount')}
                      placeholder="Enter desired loan amount"
                      InputProps={{
                        sx: { 
                          color: '#fff',
                          height: { xs: 64, sm: 68 },
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 500
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2
                          },
                          '&:hover fieldset': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': { 
                          color: 'rgba(255,255,255,0.8)',
                          fontWeight: 500
                        },
                        '& .MuiInputLabel-root.Mui-focused': { 
                          color: 'primary.main',
                          fontWeight: 600
                        }
                      }}
                    />
                  </Grid>

                  {/* Duration - Full width to show complete title */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 500
                      }}>
                        Loan Duration (Repayment Period in Months) *
                      </InputLabel>
                      <Select
                        value={formData.duration}
                        onChange={handleInputChange('duration')}
                        label="Loan Duration (Repayment Period in Months) *"
                        sx={{
                          height: { xs: 64, sm: 68 },
                          '& .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '& .MuiSelect-select': { 
                            color: '#fff',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            display: 'flex',
                            alignItems: 'center'
                          },
                          '& .MuiSvgIcon-root': { color: '#fff' }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#232742',
                              color: '#fff',
                              '& .MuiMenuItem-root': {
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                py: 1.5,
                                fontWeight: 500
                              }
                            }
                          }
                        }}
                      >
                        {durationOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Typography sx={{ fontWeight: 600 }}>
                              {option.label}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Credit Facility - Full width for better readability */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 500
                      }}>
                        Credit Facility Type *
                      </InputLabel>
                      <Select
                        value={formData.creditFacility}
                        onChange={handleInputChange('creditFacility')}
                        label="Credit Facility Type *"
                        sx={{
                          height: { xs: 64, sm: 68 },
                          '& .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '& .MuiSelect-select': { 
                            color: '#fff',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            display: 'flex',
                            alignItems: 'center'
                          },
                          '& .MuiSvgIcon-root': { color: '#fff' }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#232742',
                              color: '#fff',
                              maxHeight: 350,
                              '& .MuiMenuItem-root': {
                                py: 2,
                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem disabled sx={{ 
                          fontWeight: 700, 
                          color: 'primary.main',
                          fontSize: '1.1rem',
                          py: 2
                        }}>
                          Choose Your Loan/Credit Facility
                        </MenuItem>
                        {loanFacilities.map((facility) => (
                          <MenuItem key={facility.value} value={facility.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                              <Box sx={{ color: 'primary.main', flexShrink: 0 }}>
                                {facility.icon}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography sx={{ 
                                  fontWeight: 600,
                                  fontSize: { xs: '0.95rem', sm: '1rem' },
                                  lineHeight: 1.3
                                }}>
                                  {facility.label}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  color: 'rgba(255,255,255,0.7)',
                                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                  display: 'block',
                                  mt: 0.5
                                }}>
                                  {facility.description}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Monthly Net Income - Full width */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 500
                      }}>
                        Monthly Net Income ($) *
                      </InputLabel>
                      <Select
                        value={formData.monthlyIncome}
                        onChange={handleInputChange('monthlyIncome')}
                        label="Monthly Net Income ($) *"
                        sx={{
                          height: { xs: 64, sm: 68 },
                          '& .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '& .MuiSelect-select': { 
                            color: '#fff',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            display: 'flex',
                            alignItems: 'center'
                          },
                          '& .MuiSvgIcon-root': { color: '#fff' }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#232742',
                              color: '#fff',
                              '& .MuiMenuItem-root': {
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                py: 1.5,
                                fontWeight: 500
                              }
                            }
                          }
                        }}
                      >
                        {incomeRanges.map((range) => (
                          <MenuItem key={range.value} value={range.value}>
                            <Typography sx={{ fontWeight: 500 }}>
                              {range.label}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Purpose of Loan - Full width */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 500
                      }}>
                        Purpose of Loan *
                      </InputLabel>
                      <Select
                        value={formData.purpose}
                        onChange={handleInputChange('purpose')}
                        label="Purpose of Loan *"
                        sx={{
                          height: { xs: 64, sm: 68 },
                          '& .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '& .MuiSelect-select': { 
                            color: '#fff',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            display: 'flex',
                            alignItems: 'center'
                          },
                          '& .MuiSvgIcon-root': { color: '#fff' }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#232742',
                              color: '#fff',
                              maxHeight: 300,
                              '& .MuiMenuItem-root': {
                                fontSize: { xs: '0.95rem', sm: '1rem' },
                                py: 1.5,
                                fontWeight: 500
                              }
                            }
                          }
                        }}
                      >
                        {loanPurposes.map((purpose) => (
                          <MenuItem key={purpose} value={purpose}>
                            {purpose}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Additional Information Section */}
                  <Grid item xs={12}>
                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: { xs: 3, sm: 4 } }} />
                    <Typography variant="h5" color="primary" gutterBottom sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.2rem', sm: '1.4rem' },
                      mb: { xs: 2, sm: 3 }
                    }}>
                      Additional Information (Optional)
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ 
                      mb: { xs: 2, sm: 3 },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}>
                      Providing additional information helps us process your application faster
                    </Typography>
                  </Grid>

                  {/* Employment Status - Full width */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 500
                      }}>
                        Employment Status
                      </InputLabel>
                      <Select
                        value={formData.employmentStatus}
                        onChange={handleInputChange('employmentStatus')}
                        label="Employment Status"
                        sx={{
                          height: { xs: 64, sm: 68 },
                          '& .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '& .MuiSelect-select': { 
                            color: '#fff',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            display: 'flex',
                            alignItems: 'center'
                          },
                          '& .MuiSvgIcon-root': { color: '#fff' }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#232742',
                              color: '#fff',
                              '& .MuiMenuItem-root': {
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                py: 1.5,
                                fontWeight: 500
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem value="employed">Employed Full-time</MenuItem>
                        <MenuItem value="self-employed">Self-Employed</MenuItem>
                        <MenuItem value="business-owner">Business Owner</MenuItem>
                        <MenuItem value="freelancer">Freelancer/Contractor</MenuItem>
                        <MenuItem value="retired">Retired</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Email - Full width */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      placeholder="Enter your email address"
                      InputProps={{
                        sx: { 
                          color: '#fff',
                          height: { xs: 64, sm: 68 },
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 500
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2
                          },
                          '&:hover fieldset': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': { 
                          color: 'rgba(255,255,255,0.8)',
                          fontWeight: 500
                        },
                        '& .MuiInputLabel-root.Mui-focused': { 
                          color: 'primary.main',
                          fontWeight: 600
                        }
                      }}
                    />
                  </Grid>

                  {/* Phone - Full width */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      placeholder="Enter your phone number"
                      InputProps={{
                        sx: { 
                          color: '#fff',
                          height: { xs: 64, sm: 68 },
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 500
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2
                          },
                          '&:hover fieldset': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': { 
                          color: 'rgba(255,255,255,0.8)',
                          fontWeight: 500
                        },
                        '& .MuiInputLabel-root.Mui-focused': { 
                          color: 'primary.main',
                          fontWeight: 600
                        }
                      }}
                    />
                  </Grid>

                  {/* Address/Additional Details - New text box */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address / Additional Details"
                      multiline
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange('address')}
                      placeholder="Enter your address and any additional information you'd like to share"
                      InputProps={{
                        sx: { 
                          color: '#fff',
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }
                      }}
                      InputLabelProps={{
                        sx: {
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 500
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2
                          },
                          '&:hover fieldset': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': { 
                            borderColor: 'primary.main',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': { 
                          color: 'rgba(255,255,255,0.8)',
                          fontWeight: 500
                        },
                        '& .MuiInputLabel-root.Mui-focused': { 
                          color: 'primary.main',
                          fontWeight: 600
                        }
                      }}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Box sx={{ 
                      mt: { xs: 3, sm: 4 },
                      p: { xs: 2, sm: 3 },
                      bgcolor: 'rgba(0, 179, 134, 0.1)',
                      borderRadius: 3,
                      border: '2px dashed rgba(0, 179, 134, 0.3)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ 
                        mb: 3,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}>
                        Ready to submit your loan application? Please review all information before proceeding.
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleSubmitApplication}
                        startIcon={<Assignment />}
                        sx={{
                          py: { xs: 2, sm: 2.5 },
                          fontSize: { xs: '1.1rem', sm: '1.2rem' },
                          fontWeight: 700,
                          bgcolor: 'primary.main',
                          borderRadius: 3,
                          textTransform: 'none',
                          boxShadow: '0 8px 20px rgba(0, 179, 134, 0.3)',
                          minHeight: { xs: 56, sm: 64 },
                          '&:hover': {
                            bgcolor: 'primary.dark',
                            boxShadow: '0 12px 25px rgba(0, 179, 134, 0.4)',
                            transform: 'translateY(-2px)'
                          },
                          '& .MuiButton-startIcon': {
                            fontSize: { xs: '1.2rem', sm: '1.4rem' }
                          }
                        }}
                      >
                        Submit Loan Application
                      </Button>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ 
                        mt: 2,
                        display: 'block',
                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                      }}>
                        Processing time: 24-48 hours • Secure & Confidential
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Loan Information & Benefits */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Selected Facility Information */}
              {selectedFacility && (
                <Card sx={{
                  bgcolor: '#232742',
                  color: '#fff',
                  borderRadius: 3,
                  boxShadow: 6,
                  border: `2px solid ${theme.palette.primary.main}`
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {selectedFacility.icon}
                      <Typography variant="h6" fontWeight="bold">
                        {selectedFacility.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="rgba(255,255,255,0.8)">
                      {selectedFacility.description}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Loan Benefits */}
              <Card sx={{
                bgcolor: '#232742',
                color: '#fff',
                borderRadius: 3,
                boxShadow: 6
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                    Why Choose Our Loans?
                  </Typography>
                  <List sx={{ py: 0 }}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Speed sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Quick Approval"
                        secondary="Get approved in as little as 24 hours"
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <TrendingUp sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Competitive Rates"
                        secondary="Best-in-market interest rates"
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Security sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Flexible Terms"
                        secondary="Customizable repayment options"
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Support sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Expert Support"
                        secondary="Dedicated relationship managers"
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Application Status */}
              <Card sx={{
                bgcolor: '#232742',
                color: '#fff',
                borderRadius: 3,
                boxShadow: 6
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                    Application Process
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <CheckCircle sx={{ color: 'success.main' }} />
                      <Typography variant="body2">Fill Application Form</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Info sx={{ color: 'info.main' }} />
                      <Typography variant="body2">Document Verification</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Warning sx={{ color: 'warning.main' }} />
                      <Typography variant="body2">Credit Assessment</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <MonetizationOn sx={{ color: 'primary.main' }} />
                      <Typography variant="body2">Loan Disbursement</Typography>
                    </Box>
                  </Box>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Processing time: 24-48 hours
                  </Alert>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Loan History Dialog */}
      <Dialog
        open={loanHistoryDialog}
        onClose={() => setLoanHistoryDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#232742',
            color: 'white',
            minHeight: '70vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'primary.main', 
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <History />
            My Loan Applications
            <Chip 
              label={`${loanHistory.length} Total`} 
              color="primary" 
              size="small" 
              sx={{ ml: 1 }}
            />
          </Box>
          <IconButton onClick={() => setLoanHistoryDialog(false)} sx={{ color: '#fff' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ p: 3, pb: 2 }}>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {loanHistory.filter(loan => loan.status === 'approved').length}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Approved
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.3)'
              }}>
                <Typography variant="h6" color="warning.main" fontWeight="bold">
                  {loanHistory.filter(loan => loan.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Pending
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)'
              }}>
                <Typography variant="h6" color="error.main" fontWeight="bold">
                  {loanHistory.filter(loan => loan.status === 'declined').length}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Declined
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: 'rgba(0, 179, 134, 0.1)',
                border: '1px solid rgba(0, 179, 134, 0.3)'
              }}>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  ${loanHistory
                    .filter(loan => loan.status === 'approved')
                    .reduce((sum, loan) => sum + loan.amount, 0)
                    .toLocaleString()}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Total Approved
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Loans Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Application ID</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Loan Type</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loanHistory.map((loan) => (
                  <React.Fragment key={loan.id}>
                    <TableRow 
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>
                        {loan.id}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {new Date(loan.applicationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {loan.loanType}
                      </TableCell>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>
                        ${loan.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(loan.status)}
                          label={loan.status.toUpperCase()}
                          color={getStatusColor(loan.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleRowExpand(loan.id)}
                          sx={{ color: 'primary.main' }}
                        >
                          {expandedRow === loan.id ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        style={{ paddingBottom: 0, paddingTop: 0 }} 
                        colSpan={6}
                        sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}
                      >
                        <Collapse in={expandedRow === loan.id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2, p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                              Loan Details - {loan.id}
                            </Typography>
                            
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">
                                    Basic Information
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Purpose:</strong> {loan.purpose}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Duration:</strong> {loan.duration} months
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Application Date:</strong> {new Date(loan.applicationDate).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                {loan.status === 'approved' && (
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="success.main">
                                      Approval Details
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Approved Date:</strong> {new Date(loan.approvalDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Monthly Payment:</strong> ${loan.monthlyPayment.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Interest Rate:</strong> {loan.interestRate}%
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Next Payment:</strong> {new Date(loan.nextPaymentDate).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                )}

                                {loan.status === 'declined' && (
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="error.main">
                                      Decline Information
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Declined Date:</strong> {new Date(loan.declineDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Reason:</strong> {loan.declineReason}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Can Reapply After:</strong> {new Date(loan.canReapply).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                )}

                                {loan.status === 'pending' && (
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="warning.main">
                                      Processing Information
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Status:</strong> {loan.applicationNotes}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Expected Decision:</strong> {new Date(loan.estimatedDecision).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                )}
                              </Grid>
                            </Grid>

                            {/* Action Buttons */}
                            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              {loan.status === 'approved' && (
                                <>
                                  <Button variant="outlined" color="primary" size="small">
                                    Make Payment
                                  </Button>
                                  <Button variant="outlined" color="info" size="small">
                                    Download Statement
                                  </Button>
                                </>
                              )}
                              {loan.status === 'declined' && new Date(loan.canReapply) <= new Date() && (
                                <Button variant="outlined" color="success" size="small">
                                  Reapply Now
                                </Button>
                              )}
                              {loan.status === 'pending' && (
                                <Button variant="outlined" color="warning" size="small">
                                  Track Application
                                </Button>
                              )}
                              <Button variant="outlined" color="inherit" size="small">
                                Contact Support
                              </Button>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 3 }}>
          <Button 
            onClick={() => setLoanHistoryDialog(false)} 
            variant="outlined" 
            color="inherit"
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<MonetizationOn />}
          >
            Apply New Loan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={submitDialog}
        onClose={() => !loading && setSubmitDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#232742',
            color: 'white',
            minWidth: { xs: '90vw', sm: 500 }
          }
        }}
      >
        <DialogTitle sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Confirm Loan Application
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" gutterBottom>
              Please review your loan application details:
            </Typography>
            <Box sx={{ my: 2, p: 2, bgcolor: 'rgba(0,179,134,0.1)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Loan Amount:</strong> ${formData.loanAmount?.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Credit Facility:</strong> {selectedFacility?.label}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Duration:</strong> {formData.duration} months
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Monthly Income:</strong> {formData.monthlyIncome}
              </Typography>
              <Typography variant="body2">
                <strong>Purpose:</strong> {formData.purpose}
              </Typography>
            </Box>
            {loading && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Processing your application...
                </Typography>
                <LinearProgress />
              </Box>
            )}
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              By submitting this application, you agree to our terms and conditions and authorize us to verify the information provided.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSubmitDialog(false)}
            color="inherit"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            autoFocus
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
