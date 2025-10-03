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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Badge
} from '@mui/material';
import {
  Person,
  Email,
  Settings,
  VerifiedUser,
  CloudUpload,
  AccountBalance,
  Assignment,
  CheckCircle,
  Info,
  Warning,
  Business,
  Home,
  CameraAlt,
  Description,
  Security,
  Fingerprint,
  LocationOn,
  Phone,
  PhotoCamera,
  Upload,
  InsertDriveFile,
  Edit,
  Visibility,
  Delete,
  Close
} from '@mui/icons-material';

// KYC Document Types
const documentTypes = [
  { value: 'passport', label: 'International Passport', description: 'Valid international passport' },
  { value: 'drivers_license', label: 'Driver\'s License', description: 'Valid driver\'s license' },
  { value: 'national_id', label: 'National ID Card', description: 'Government issued ID card' },
  { value: 'voter_id', label: 'Voter\'s Card', description: 'Valid voter\'s identification card' }
];

// Address Document Types
const addressDocuments = [
  { value: 'utility_bill', label: 'Utility Bill', description: 'Recent utility bill (not older than 3 months)' },
  { value: 'bank_statement', label: 'Bank Statement', description: 'Bank statement (not older than 3 months)' },
  { value: 'tax_document', label: 'Tax Document', description: 'Recent tax assessment or receipt' },
  { value: 'rental_agreement', label: 'Rental Agreement', description: 'Current rental/lease agreement' }
];

// Country Options
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Nigeria', 'South Africa', 'India', 'Brazil', 'Mexico', 'Spain', 'Italy', 'Netherlands', 'Other'
];

export default function VerifyAccount() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    nationality: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    documentType: '',
    documentNumber: '',
    addressDocumentType: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    identityDocument: null,
    addressDocument: null,
    selfiePhoto: null
  });
  const [submitDialog, setSubmitDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleFileUpload = (fileType) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmitKYC = () => {
    setSubmitDialog(true);
  };

  const confirmSubmit = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitDialog(false);
      alert('KYC verification submitted successfully! We will review your documents and update your account status within 24-48 hours.');
    }, 2000);
  };

  const steps = [
    {
      label: 'Personal Information',
      description: 'Provide your basic personal details'
    },
    {
      label: 'Address Verification',
      description: 'Enter your residential address information'
    },
    {
      label: 'Document Upload',
      description: 'Upload required identification documents'
    },
    {
      label: 'Review & Submit',
      description: 'Review all information and submit for verification'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Container maxWidth="xl" sx={{ p: { xs: 1, sm: 3 } }}>
        {/* Header matching the style from other pages */}
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
                Username: <span style={{ color: theme.palette.primary.main }}>{user?.name || user?.username || 'Not Available'}</span>
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
              label="KYC Pending" 
              color="warning" 
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
              Support
            </Button>
            <Button 
              variant="contained" 
              color="info" 
              startIcon={<Security sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
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
              Help
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={{ xs: 3, lg: 4 }}>
          {/* Main KYC Form */}
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
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: 2,
                    mb: 3
                  }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(0, 179, 134, 0.1)', 
                      color: 'primary.main',
                      width: 80, 
                      height: 80,
                      border: '2px solid rgba(0, 179, 134, 0.3)'
                    }}>
                      <VerifiedUser sx={{ fontSize: '2.5rem' }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom sx={{
                    fontSize: { xs: '1.8rem', sm: '2.1rem', md: '2.5rem' }
                  }}>
                    KYC Verification
                  </Typography>
                  <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ 
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    lineHeight: 1.6,
                    maxWidth: 600,
                    mx: 'auto'
                  }}>
                    To comply with regulation, each participant will have to go through identity 
                    verification (KYC/AML) to prevent fraud causes.
                  </Typography>
                </Box>

                {/* Progress Stepper */}
                <Box sx={{ mb: 4 }}>
                  <Stepper activeStep={activeStep} orientation="vertical" sx={{
                    '& .MuiStepLabel-root': {
                      color: 'rgba(255,255,255,0.7)'
                    },
                    '& .MuiStepLabel-label.Mui-active': {
                      color: 'primary.main',
                      fontWeight: 600
                    },
                    '& .MuiStepLabel-label.Mui-completed': {
                      color: 'success.main'
                    },
                    '& .MuiStepConnector-line': {
                      borderColor: 'rgba(255,255,255,0.3)'
                    }
                  }}>
                    {steps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel>
                          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            {step.label}
                          </Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.6)">
                            {step.description}
                          </Typography>
                        </StepLabel>
                        <StepContent>
                          {/* Step Content */}
                          {index === 0 && (
                            <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="First Name *"
                                    value={formData.firstName}
                                    onChange={handleInputChange('firstName')}
                                    InputProps={{ sx: { color: '#fff', height: 56 } }}
                                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="Last Name *"
                                    value={formData.lastName}
                                    onChange={handleInputChange('lastName')}
                                    InputProps={{ sx: { color: '#fff', height: 56 } }}
                                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="Middle Name"
                                    value={formData.middleName}
                                    onChange={handleInputChange('middleName')}
                                    InputProps={{ sx: { color: '#fff', height: 56 } }}
                                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="Date of Birth *"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange('dateOfBirth')}
                                    InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.8)' } }}
                                    InputProps={{ sx: { color: '#fff', height: 56 } }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Nationality *</InputLabel>
                                    <Select
                                      value={formData.nationality}
                                      onChange={handleInputChange('nationality')}
                                      label="Nationality *"
                                      sx={{
                                        color: '#fff',
                                        height: 56,
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                                      }}
                                      MenuProps={{
                                        PaperProps: { sx: { bgcolor: '#232742', color: '#fff' } }
                                      }}
                                    >
                                      {countries.map((country) => (
                                        <MenuItem key={country} value={country}>{country}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="Phone Number *"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange('phoneNumber')}
                                    InputProps={{ sx: { color: '#fff', height: 56 } }}
                                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                      }
                                    }}
                                  />
                                </Grid>
                              </Grid>
                              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ minWidth: 120 }}
                                >
                                  Next
                                </Button>
                              </Box>
                            </Box>
                          )}

                          {index === 1 && (
                            <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                              <Grid container spacing={3}>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Street Address *"
                                    multiline
                                    rows={2}
                                    value={formData.address}
                                    onChange={handleInputChange('address')}
                                    InputProps={{ sx: { color: '#fff' } }}
                                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="City *"
                                    value={formData.city}
                                    onChange={handleInputChange('city')}
                                    InputProps={{ sx: { color: '#fff', height: 56 } }}
                                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="State/Province *"
                                    value={formData.state}
                                    onChange={handleInputChange('state')}
                                    InputProps={{ sx: { color: '#fff', height: 56 } }}
                                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="ZIP/Postal Code *"
                                    value={formData.zipCode}
                                    onChange={handleInputChange('zipCode')}
                                    InputProps={{ sx: { color: '#fff', height: 56 } }}
                                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Country *</InputLabel>
                                    <Select
                                      value={formData.country}
                                      onChange={handleInputChange('country')}
                                      label="Country *"
                                      sx={{
                                        color: '#fff',
                                        height: 56,
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                                      }}
                                      MenuProps={{
                                        PaperProps: { sx: { bgcolor: '#232742', color: '#fff' } }
                                      }}
                                    >
                                      {countries.map((country) => (
                                        <MenuItem key={country} value={country}>{country}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                              </Grid>
                              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={handleBack} sx={{ minWidth: 120 }}>
                                  Back
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ minWidth: 120 }}
                                >
                                  Next
                                </Button>
                              </Box>
                            </Box>
                          )}

                          {index === 2 && (
                            <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                              {/* Document Upload Section */}
                              <Grid container spacing={4}>
                                {/* Identity Document */}
                                <Grid item xs={12}>
                                  <Typography variant="h6" color="primary" gutterBottom>
                                    1. Identity Document
                                  </Typography>
                                  <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Document Type *</InputLabel>
                                    <Select
                                      value={formData.documentType}
                                      onChange={handleInputChange('documentType')}
                                      label="Document Type *"
                                      sx={{
                                        color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                                      }}
                                      MenuProps={{
                                        PaperProps: { sx: { bgcolor: '#232742', color: '#fff' } }
                                      }}
                                    >
                                      {documentTypes.map((doc) => (
                                        <MenuItem key={doc.value} value={doc.value}>
                                          <Box>
                                            <Typography>{doc.label}</Typography>
                                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                                              {doc.description}
                                            </Typography>
                                          </Box>
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <Paper sx={{ 
                                    p: 3, 
                                    bgcolor: 'rgba(0, 179, 134, 0.1)', 
                                    border: '2px dashed rgba(0, 179, 134, 0.3)',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'rgba(0, 179, 134, 0.15)' }
                                  }}>
                                    <input
                                      accept="image/*,.pdf"
                                      style={{ display: 'none' }}
                                      id="identity-upload"
                                      type="file"
                                      onChange={handleFileUpload('identityDocument')}
                                    />
                                    <label htmlFor="identity-upload">
                                      <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                      <Typography variant="h6" color="primary">
                                        {uploadedFiles.identityDocument ? uploadedFiles.identityDocument.name : 'Upload Identity Document'}
                                      </Typography>
                                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                        JPG, PNG or PDF (Max 5MB)
                                      </Typography>
                                    </label>
                                  </Paper>
                                </Grid>

                                {/* Address Document */}
                                <Grid item xs={12}>
                                  <Typography variant="h6" color="primary" gutterBottom>
                                    2. Address Verification
                                  </Typography>
                                  <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Address Document Type *</InputLabel>
                                    <Select
                                      value={formData.addressDocumentType}
                                      onChange={handleInputChange('addressDocumentType')}
                                      label="Address Document Type *"
                                      sx={{
                                        color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                                      }}
                                      MenuProps={{
                                        PaperProps: { sx: { bgcolor: '#232742', color: '#fff' } }
                                      }}
                                    >
                                      {addressDocuments.map((doc) => (
                                        <MenuItem key={doc.value} value={doc.value}>
                                          <Box>
                                            <Typography>{doc.label}</Typography>
                                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                                              {doc.description}
                                            </Typography>
                                          </Box>
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <Paper sx={{ 
                                    p: 3, 
                                    bgcolor: 'rgba(0, 179, 134, 0.1)', 
                                    border: '2px dashed rgba(0, 179, 134, 0.3)',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'rgba(0, 179, 134, 0.15)' }
                                  }}>
                                    <input
                                      accept="image/*,.pdf"
                                      style={{ display: 'none' }}
                                      id="address-upload"
                                      type="file"
                                      onChange={handleFileUpload('addressDocument')}
                                    />
                                    <label htmlFor="address-upload">
                                      <Upload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                      <Typography variant="h6" color="primary">
                                        {uploadedFiles.addressDocument ? uploadedFiles.addressDocument.name : 'Upload Address Document'}
                                      </Typography>
                                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                        JPG, PNG or PDF (Max 5MB)
                                      </Typography>
                                    </label>
                                  </Paper>
                                </Grid>

                                {/* Selfie Photo */}
                                <Grid item xs={12}>
                                  <Typography variant="h6" color="primary" gutterBottom>
                                    3. Selfie Verification
                                  </Typography>
                                  <Paper sx={{ 
                                    p: 3, 
                                    bgcolor: 'rgba(0, 179, 134, 0.1)', 
                                    border: '2px dashed rgba(0, 179, 134, 0.3)',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'rgba(0, 179, 134, 0.15)' }
                                  }}>
                                    <input
                                      accept="image/*"
                                      style={{ display: 'none' }}
                                      id="selfie-upload"
                                      type="file"
                                      onChange={handleFileUpload('selfiePhoto')}
                                    />
                                    <label htmlFor="selfie-upload">
                                      <PhotoCamera sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                      <Typography variant="h6" color="primary">
                                        {uploadedFiles.selfiePhoto ? uploadedFiles.selfiePhoto.name : 'Upload Selfie Photo'}
                                      </Typography>
                                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                        Clear photo of yourself holding your ID document
                                      </Typography>
                                    </label>
                                  </Paper>
                                </Grid>
                              </Grid>
                              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={handleBack} sx={{ minWidth: 120 }}>
                                  Back
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ minWidth: 120 }}
                                >
                                  Review
                                </Button>
                              </Box>
                            </Box>
                          )}

                          {index === 3 && (
                            <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                              <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
                                Review Your Information
                              </Typography>
                              
                              {/* Summary Cards */}
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                                    <Typography variant="subtitle1" color="primary" gutterBottom>
                                      Personal Information
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Name:</strong> {formData.firstName} {formData.lastName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Date of Birth:</strong> {formData.dateOfBirth}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Nationality:</strong> {formData.nationality}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Phone:</strong> {formData.phoneNumber}
                                    </Typography>
                                  </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                                    <Typography variant="subtitle1" color="primary" gutterBottom>
                                      Address Information
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Address:</strong> {formData.address}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>City:</strong> {formData.city}, {formData.state}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Country:</strong> {formData.country}
                                    </Typography>
                                  </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                                    <Typography variant="subtitle1" color="primary" gutterBottom>
                                      Uploaded Documents
                                    </Typography>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} sm={4}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                          <InsertDriveFile sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                          <Typography variant="body2">
                                            {uploadedFiles.identityDocument ? 'Identity Document ✓' : 'Identity Document ✗'}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                          <InsertDriveFile sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                          <Typography variant="body2">
                                            {uploadedFiles.addressDocument ? 'Address Document ✓' : 'Address Document ✗'}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                          <PhotoCamera sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                          <Typography variant="body2">
                                            {uploadedFiles.selfiePhoto ? 'Selfie Photo ✓' : 'Selfie Photo ✗'}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Paper>
                                </Grid>
                              </Grid>

                              <Alert severity="info" sx={{ mt: 3 }}>
                                Please review all information carefully. Once submitted, you cannot modify your KYC application.
                              </Alert>

                              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={handleBack} sx={{ minWidth: 120 }}>
                                  Back
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={handleSubmitKYC}
                                  sx={{ 
                                    minWidth: 150,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600
                                  }}
                                >
                                  Submit for Verification
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                {/* Completion Message */}
                {activeStep === steps.length && (
                  <Box sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                    borderRadius: 3,
                    border: '2px solid rgba(76, 175, 80, 0.3)'
                  }}>
                    <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" color="success.main" gutterBottom>
                      KYC Verification Submitted!
                    </Typography>
                    <Typography variant="body1" color="rgba(255,255,255,0.8)">
                      Thank you for completing your KYC verification. We will review your documents and 
                      update your account status within 24-48 hours.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Information & Guidelines */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* KYC Requirements */}
              <Card sx={{
                bgcolor: '#232742',
                color: '#fff',
                borderRadius: 3,
                boxShadow: 6
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                    Required Documents
                  </Typography>
                  <List sx={{ py: 0 }}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Assignment sx={{ color: 'primary.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Government ID"
                        secondary="Passport, Driver's License, or National ID"
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <LocationOn sx={{ color: 'primary.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Proof of Address"
                        secondary="Utility bill or bank statement (within 3 months)"
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <PhotoCamera sx={{ color: 'primary.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Selfie with ID"
                        secondary="Clear photo holding your identification document"
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Processing Time */}
              <Card sx={{
                bgcolor: '#232742',
                color: '#fff',
                borderRadius: 3,
                boxShadow: 6
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                    Verification Process
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <CheckCircle sx={{ color: 'success.main' }} />
                      <Typography variant="body2">Submit Documents</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Info sx={{ color: 'info.main' }} />
                      <Typography variant="body2">Document Review (24-48 hours)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Warning sx={{ color: 'warning.main' }} />
                      <Typography variant="body2">Identity Verification</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <VerifiedUser sx={{ color: 'primary.main' }} />
                      <Typography variant="body2">Account Approval</Typography>
                    </Box>
                  </Box>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Average processing time: 24-48 hours
                  </Alert>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card sx={{
                bgcolor: '#232742',
                color: '#fff',
                borderRadius: 3,
                boxShadow: 6,
                border: '2px solid rgba(255, 193, 7, 0.3)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color="warning.main" gutterBottom>
                    Security & Privacy
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 2 }}>
                    Your documents are encrypted and stored securely. We comply with international 
                    data protection regulations and will never share your information with third parties 
                    without your consent.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security sx={{ color: 'warning.main' }} />
                    <Typography variant="body2" fontWeight="600">
                      SSL Encrypted • GDPR Compliant
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={submitDialog}
        onClose={() => !loading && setSubmitDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#232742',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Confirm KYC Submission
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to submit your KYC verification? 
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mt: 2 }}>
              Once submitted, you cannot modify your application. Our team will review your 
              documents and contact you within 24-48 hours with the verification status.
            </Typography>
            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Submitting your KYC verification...
                </Typography>
              </Box>
            )}
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
            {loading ? 'Submitting...' : 'Confirm Submission'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
