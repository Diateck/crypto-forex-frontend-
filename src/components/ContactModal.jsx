import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
  Stack,
  Link,
  useTheme,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { contactAPI } from '../services/api';

const ContactModal = ({ open, onClose, contactInfo }) => {
  const theme = useTheme();
  const [copiedField, setCopiedField] = useState('');
  const [currentContactInfo, setCurrentContactInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Default contact information (fallback)
  const defaultContactInfo = {
    companyName: 'Elon Investment Broker',
    supportEmail: 'support@eloninvestmentbroker.com',
    salesEmail: 'sales@eloninvestmentbroker.com',
    phone: '+1 (555) 123-4567',
    whatsapp: '+1 (555) 123-4567',
    telegram: '@eloninvestmentbroker',
    address: '123 Financial District, New York, NY 10004',
    businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM (EST)',
    responseTime: 'We typically respond within 2-4 hours during business hours',
    emergencySupport: '24/7 for critical trading issues'
  };

  // Load contact information when modal opens
  useEffect(() => {
    if (open && !contactInfo) {
      loadContactInfo();
    } else if (contactInfo) {
      setCurrentContactInfo(contactInfo);
    }
  }, [open, contactInfo]);

  const loadContactInfo = async () => {
    setLoading(true);
    try {
      // Try to get contact info from API
      const data = await contactAPI.getContactInfo();
      setCurrentContactInfo(data);
    } catch (error) {
      console.log('Using default contact info due to API error:', error);
      // Fallback to default contact info
      const data = await contactAPI.getDefaultContactInfo();
      setCurrentContactInfo(data);
    } finally {
      setLoading(false);
    }
  };

  const displayContactInfo = currentContactInfo || defaultContactInfo;

  const handleCopyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    });
  };

  const contactMethods = [
    {
      icon: <EmailIcon sx={{ color: '#1976d2' }} />,
      label: 'General Support',
      value: displayContactInfo.supportEmail,
      action: `mailto:${displayContactInfo.supportEmail}`,
      copyable: true
    },
    {
      icon: <EmailIcon sx={{ color: '#2e7d32' }} />,
      label: 'Sales & Partnerships',
      value: displayContactInfo.salesEmail,
      action: `mailto:${displayContactInfo.salesEmail}`,
      copyable: true
    },
    {
      icon: <PhoneIcon sx={{ color: '#ed6c02' }} />,
      label: 'Phone Support',
      value: displayContactInfo.phone,
      action: `tel:${displayContactInfo.phone}`,
      copyable: true
    },
    {
      icon: <WhatsAppIcon sx={{ color: '#25d366' }} />,
      label: 'WhatsApp',
      value: displayContactInfo.whatsapp,
      action: `https://wa.me/${displayContactInfo.whatsapp.replace(/[^0-9]/g, '')}`,
      copyable: true
    },
    {
      icon: <TelegramIcon sx={{ color: '#0088cc' }} />,
      label: 'Telegram',
      value: displayContactInfo.telegram,
      action: `https://t.me/${displayContactInfo.telegram.replace('@', '')}`,
      copyable: true
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1a1d2b 0%, #232742 100%)',
          color: '#fff'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SupportAgentIcon sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#fff' }}>
              Contact {displayContactInfo.companyName}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              We're here to help you 24/7
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
        {/* Contact Methods */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#fff' }}>
          📞 Contact Methods
        </Typography>
        
        <Stack spacing={2} sx={{ mb: 3 }}>
          {contactMethods.map((method, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {method.icon}
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#fff' }}>
                    {method.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {method.value}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {method.copyable && (
                  <IconButton
                    size="small"
                    onClick={() => handleCopyToClipboard(method.value, method.label)}
                    sx={{
                      color: copiedField === method.label ? '#4caf50' : 'rgba(255,255,255,0.7)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  component={method.action.startsWith('http') ? 'a' : 'button'}
                  href={method.action.startsWith('http') ? method.action : undefined}
                  onClick={method.action.startsWith('http') ? undefined : () => window.location.href = method.action}
                  target={method.action.startsWith('http') ? '_blank' : undefined}
                  sx={{
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: `${theme.palette.primary.main}20`
                    }
                  }}
                >
                  Contact
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Business Information */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#fff' }}>
          🏢 Business Information
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <LocationOnIcon sx={{ color: '#f44336', mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#fff' }}>
                Office Address
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {displayContactInfo.address}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <AccessTimeIcon sx={{ color: '#2196f3', mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#fff' }}>
                Business Hours
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {displayContactInfo.businessHours}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {displayContactInfo.emergencySupport}
              </Typography>
            </Box>
          </Box>
        </Stack>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Response Time */}
        <Box 
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: `${theme.palette.primary.main}20`,
            border: `1px solid ${theme.palette.primary.main}40` 
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: theme.palette.primary.main, mb: 1 }}>
            ⚡ Response Time
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            {displayContactInfo.responseTime}
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#fff' }}>
            🚀 Quick Actions
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label="Report Trading Issue"
              variant="outlined"
              sx={{ color: '#ff9800', borderColor: '#ff9800' }}
            />
            <Chip
              label="Account Verification"
              variant="outlined"
              sx={{ color: '#4caf50', borderColor: '#4caf50' }}
            />
            <Chip
              label="Deposit Help"
              variant="outlined"
              sx={{ color: '#2196f3', borderColor: '#2196f3' }}
            />
            <Chip
              label="General Inquiry"
              variant="outlined"
              sx={{ color: '#9c27b0', borderColor: '#9c27b0' }}
            />
          </Stack>
        </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.3)',
            '&:hover': {
              borderColor: '#fff',
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          href={`mailto:${displayContactInfo.supportEmail}`}
          sx={{ fontWeight: 600 }}
        >
          Send Email Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactModal;