import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Paper,
  Divider,
  InputAdornment,
  Switch,
  FormControlLabel
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import PreviewIcon from '@mui/icons-material/Preview';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContactModal from './ContactModal';

const AdminContactManager = ({ initialContactInfo, onSave }) => {
  const [contactInfo, setContactInfo] = useState(
    initialContactInfo || {
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
    }
  );

  const [originalInfo, setOriginalInfo] = useState({ ...contactInfo });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ open: false, message: '', severity: 'success' });
  const [autoSave, setAutoSave] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field, value) => {
    const newInfo = { ...contactInfo, [field]: value };
    setContactInfo(newInfo);
    setHasChanges(JSON.stringify(newInfo) !== JSON.stringify(originalInfo));

    if (autoSave) {
      handleSave(newInfo, true);
    }
  };

  const handleSave = async (dataToSave = contactInfo, isAutoSave = false) => {
    try {
      // TODO: Replace with actual API call
      // await adminAPI.updateContactInfo(dataToSave);
      
      if (onSave) {
        onSave(dataToSave);
      }

      setOriginalInfo({ ...dataToSave });
      setHasChanges(false);
      
      setSaveStatus({
        open: true,
        message: isAutoSave ? 'Auto-saved successfully!' : 'Contact information updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSaveStatus({
        open: true,
        message: 'Failed to save contact information. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleReset = () => {
    setContactInfo({ ...originalInfo });
    setHasChanges(false);
  };

  const handleRestoreDefaults = () => {
    const defaults = {
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
    setContactInfo(defaults);
    setHasChanges(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#1a1d2b', color: '#fff' }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          📞 Contact Information Management
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
          Update company contact details that appear in the "Mail Us" popup
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                color="primary"
              />
            }
            label="Auto-save changes"
            sx={{ color: '#fff' }}
          />
          {hasChanges && !autoSave && (
            <Alert severity="warning" sx={{ py: 0 }}>
              You have unsaved changes
            </Alert>
          )}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Company Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#232742', color: '#fff', mb: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                🏢 Company Information
              </Typography>
              
              <TextField
                fullWidth
                label="Company Name"
                value={contactInfo.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: '#fff' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255,255,255,0.7)' }
                }}
              />

              <TextField
                fullWidth
                label="Office Address"
                value={contactInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#fff' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Methods */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#232742', color: '#fff', mb: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                📧 Contact Methods
              </Typography>
              
              <TextField
                fullWidth
                label="Support Email"
                type="email"
                value={contactInfo.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#fff' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255,255,255,0.7)' }
                }}
              />

              <TextField
                fullWidth
                label="Sales Email"
                type="email"
                value={contactInfo.salesEmail}
                onChange={(e) => handleInputChange('salesEmail', e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#fff' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255,255,255,0.7)' }
                }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={contactInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#fff' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255,255,255,0.7)' }
                }}
              />

              <TextField
                fullWidth
                label="WhatsApp Number"
                value={contactInfo.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: '#fff' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255,255,255,0.7)' }
                }}
              />

              <TextField
                fullWidth
                label="Telegram Handle"
                value={contactInfo.telegram}
                onChange={(e) => handleInputChange('telegram', e.target.value)}
                InputProps={{
                  style: { color: '#fff' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Business Hours & Support */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: '#232742', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                ⏰ Business Hours & Support
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Business Hours"
                    value={contactInfo.businessHours}
                    onChange={(e) => handleInputChange('businessHours', e.target.value)}
                    multiline
                    rows={2}
                    InputProps={{
                      style: { color: '#fff' }
                    }}
                    InputLabelProps={{
                      style: { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Response Time"
                    value={contactInfo.responseTime}
                    onChange={(e) => handleInputChange('responseTime', e.target.value)}
                    multiline
                    rows={2}
                    InputProps={{
                      style: { color: '#fff' }
                    }}
                    InputLabelProps={{
                      style: { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Emergency Support"
                    value={contactInfo.emergencySupport}
                    onChange={(e) => handleInputChange('emergencySupport', e.target.value)}
                    multiline
                    rows={2}
                    InputProps={{
                      style: { color: '#fff' }
                    }}
                    InputLabelProps={{
                      style: { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={handleRestoreDefaults}
          sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
        >
          Restore Defaults
        </Button>
        
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={!hasChanges}
          sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
        >
          Reset Changes
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<PreviewIcon />}
          onClick={() => setPreviewOpen(true)}
          sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
        >
          Preview
        </Button>
        
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={() => handleSave()}
          disabled={!hasChanges || autoSave}
          color="primary"
        >
          Save Changes
        </Button>
      </Box>

      {/* Preview Modal */}
      <ContactModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        contactInfo={contactInfo}
      />

      {/* Save Status Snackbar */}
      <Snackbar
        open={saveStatus.open}
        autoHideDuration={3000}
        onClose={() => setSaveStatus({ ...saveStatus, open: false })}
      >
        <Alert severity={saveStatus.severity} sx={{ width: '100%' }}>
          {saveStatus.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminContactManager;