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
  Divider,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Email,
  Settings,
  VerifiedUser,
  Share,
  ContentCopy,
  QrCode,
  Link,
  Group,
  TrendingUp,
  AccountBalance,
  AttachMoney,
  EmojiEvents,
  Star,
  CheckCircle,
  Schedule,
  Visibility,
  PersonAdd,
  MonetizationOn,
  Business,
  School,
  Work,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Telegram,
  Instagram,
  Send,
  GetApp,
  Print,
  CalendarToday,
  LocationOn,
  Phone,
  Language,
  Public
} from '@mui/icons-material';

// Mock referral data
const mockReferralData = {
  referralId: 'fiseyanu',
  referralLink: 'https://interspacebroker.com/ref/fiseyanu',
  totalReferrals: 12,
  activeReferrals: 8,
  totalCommissions: 2850.75,
  pendingCommissions: 425.50,
  referredBy: null,
  tier: 'Gold',
  nextTierProgress: 75
};

const mockReferralList = [
  {
    id: 1,
    clientName: 'John Smith',
    refLevel: 'Level 1',
    parent: 'Direct',
    clientStatus: 'Active',
    dateRegistered: '2024-09-15',
    totalDeposit: 5000.00,
    commission: 125.00,
    country: 'United States',
    accountType: 'Premium'
  },
  {
    id: 2,
    clientName: 'Maria Garcia',
    refLevel: 'Level 1',
    parent: 'Direct',
    clientStatus: 'Active',
    dateRegistered: '2024-09-20',
    totalDeposit: 3200.00,
    commission: 80.00,
    country: 'Spain',
    accountType: 'Standard'
  },
  {
    id: 3,
    clientName: 'David Chen',
    refLevel: 'Level 2',
    parent: 'John Smith',
    clientStatus: 'Pending',
    dateRegistered: '2024-09-22',
    totalDeposit: 1500.00,
    commission: 22.50,
    country: 'Singapore',
    accountType: 'Standard'
  },
  {
    id: 4,
    clientName: 'Sarah Johnson',
    refLevel: 'Level 1',
    parent: 'Direct',
    clientStatus: 'Active',
    dateRegistered: '2024-09-25',
    totalDeposit: 7500.00,
    commission: 187.50,
    country: 'Canada',
    accountType: 'VIP'
  },
  {
    id: 5,
    clientName: 'Ahmed Hassan',
    refLevel: 'Level 1',
    parent: 'Direct',
    clientStatus: 'Active',
    dateRegistered: '2024-09-26',
    totalDeposit: 2800.00,
    commission: 70.00,
    country: 'UAE',
    accountType: 'Premium'
  }
];

const referralTiers = [
  { name: 'Bronze', minReferrals: 0, commission: '2%', color: '#CD7F32', benefits: ['Basic support', 'Standard commissions'] },
  { name: 'Silver', minReferrals: 5, commission: '2.5%', color: '#C0C0C0', benefits: ['Priority support', 'Enhanced commissions', 'Monthly bonuses'] },
  { name: 'Gold', minReferrals: 10, commission: '3%', color: '#FFD700', benefits: ['VIP support', 'Premium commissions', 'Weekly bonuses', 'Exclusive webinars'] },
  { name: 'Platinum', minReferrals: 25, commission: '3.5%', color: '#E5E4E2', benefits: ['Dedicated manager', 'Maximum commissions', 'Daily bonuses', 'Personal training'] }
];

export default function ReferUser() {
  const theme = useTheme();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockReferralData.referralLink);
    // Show success message
  };

  const handleShare = (platform) => {
    const text = `Join me on Elon Investment Broker and start your trading journey! Use my referral link: ${mockReferralData.referralLink}`;
    const url = mockReferralData.referralLink;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        break;
      default:
        break;
    }
    setShareDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Pending': return 'warning';
      case 'Inactive': return 'error';
      default: return 'default';
    }
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'VIP': return 'success';
      case 'Premium': return 'warning';
      case 'Standard': return 'info';
      default: return 'default';
    }
  };

  const getCurrentTier = () => {
    return referralTiers.find(tier => tier.name === mockReferralData.tier) || referralTiers[0];
  };

  const getNextTier = () => {
    const currentIndex = referralTiers.findIndex(tier => tier.name === mockReferralData.tier);
    return referralTiers[currentIndex + 1] || null;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Container maxWidth="xl" sx={{ p: { xs: 1, sm: 3 } }}>
        {/* Header */}
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
              <Group sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem' } }} />
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
                Referral Program
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
                Earn with <span style={{ color: theme.palette.primary.main }}>Every Referral</span>
              </Typography>
            </Box>
          </Box>
          
          {/* Action Buttons */}
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
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Share />} 
              onClick={() => setShareDialogOpen(true)}
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
              Share
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<Print />} 
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
              Print
            </Button>
            <Button 
              variant="contained" 
              color="info" 
              startIcon={<Email />} 
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
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Main Referral Card */}
          <Grid item xs={12} lg={8}>
            <Card sx={{
              bgcolor: '#232742',
              color: '#fff',
              borderRadius: 3,
              boxShadow: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              mb: 3
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
                  You can refer users by sharing your referral link:
                </Typography>

                {/* Referral Link Section */}
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)', 
                  p: 3, 
                  borderRadius: 2, 
                  mb: 3 
                }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                    <TextField
                      fullWidth
                      value={mockReferralData.referralLink}
                      InputProps={{
                        readOnly: true,
                        sx: { 
                          color: '#fff', 
                          bgcolor: 'rgba(255,255,255,0.1)',
                          fontSize: '1.1rem',
                          fontFamily: 'monospace'
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        }
                      }}
                    />
                    <Tooltip title="Copy Link">
                      <IconButton 
                        onClick={handleCopyLink}
                        sx={{ 
                          bgcolor: 'primary.main',
                          color: '#fff',
                          '&:hover': { bgcolor: 'primary.dark' },
                          minWidth: 48,
                          height: 48
                        }}
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Referral ID Section */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h6" color="rgba(255,255,255,0.8)" gutterBottom>
                    or your Referral ID
                  </Typography>
                  <Typography 
                    variant="h3" 
                    color="#4DD0E1" 
                    fontWeight="bold"
                    sx={{ 
                      fontFamily: 'monospace',
                      letterSpacing: 2,
                      textShadow: '0 0 10px rgba(77, 208, 225, 0.5)'
                    }}
                  >
                    {mockReferralData.referralId}
                  </Typography>
                </Box>

                {/* Referred By Section */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h6" color="rgba(255,255,255,0.8)" gutterBottom>
                    You were referred by
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
                      <Person sx={{ fontSize: 30 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="body1" color="rgba(255,255,255,0.6)" sx={{ mt: 1 }}>
                    null
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Referral Statistics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: '#232742', color: '#fff', borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Group sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {mockReferralData.totalReferrals}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      Total Referrals
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: '#232742', color: '#fff', borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {mockReferralData.activeReferrals}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      Active Referrals
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: '#232742', color: '#fff', borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      ${mockReferralData.totalCommissions.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      Total Earned
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: '#232742', color: '#fff', borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Schedule sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      ${mockReferralData.pendingCommissions.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      Pending
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Referral Tier Card */}
            <Card sx={{
              bgcolor: '#232742',
              color: '#fff',
              borderRadius: 3,
              boxShadow: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              mb: 3
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">
                  Your Referral Tier
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar sx={{ 
                    bgcolor: getCurrentTier().color, 
                    width: 80, 
                    height: 80, 
                    margin: '0 auto',
                    mb: 2 
                  }}>
                    <EmojiEvents sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: getCurrentTier().color }}>
                    {getCurrentTier().name}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Commission Rate: {getCurrentTier().commission}
                  </Typography>
                </Box>

                {getNextTier() && (
                  <Box>
                    <Typography variant="body2" color="rgba(255,255,255,0.8)" gutterBottom>
                      Progress to {getNextTier().name}:
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={mockReferralData.nextTierProgress} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getNextTier().color
                        }
                      }}
                    />
                    <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ mt: 1, display: 'block' }}>
                      {mockReferralData.nextTierProgress}% Complete
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card sx={{
              bgcolor: '#232742',
              color: '#fff',
              borderRadius: 3,
              boxShadow: 6,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">
                  Tier Benefits
                </Typography>
                
                <List dense>
                  {getCurrentTier().benefits.map((benefit, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={benefit}
                        sx={{ color: 'rgba(255,255,255,0.9)' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Referral List Table */}
          <Grid item xs={12}>
            <Card sx={{
              bgcolor: '#232742',
              color: '#fff',
              borderRadius: 3,
              boxShadow: 6,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
                  Your Referrals.
                </Typography>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Client name</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Ref. level</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Parent</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Client status</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date registered</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockReferralList.map((referral) => (
                        <TableRow 
                          key={referral.id}
                          sx={{ 
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                            borderBottom: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                                {referral.clientName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {referral.clientName}
                                </Typography>
                                <Typography variant="caption" color="rgba(255,255,255,0.6)">
                                  {referral.country}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={referral.refLevel}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            {referral.parent}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={referral.clientStatus}
                              size="small"
                              color={getStatusColor(referral.clientStatus)}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            {new Date(referral.dateRegistered).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setSelectedReferral(referral);
                                setDetailsDialogOpen(true);
                              }}
                              sx={{ color: 'primary.main' }}
                              size="small"
                            >
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {mockReferralList.length === 0 && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    bgcolor: 'rgba(255,255,255,0.02)',
                    borderRadius: 2,
                    mt: 2
                  }}>
                    <PersonAdd sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                    <Typography variant="h6" color="rgba(255,255,255,0.6)">
                      No referrals yet
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.4)">
                      Start sharing your referral link to earn commissions
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#232742',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'primary.main', 
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          Share Your Referral Link
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Share your referral link on social media and start earning commissions:
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                onClick={() => handleShare('facebook')}
                sx={{
                  color: '#4267B2',
                  borderColor: '#4267B2',
                  '&:hover': { bgcolor: 'rgba(66, 103, 178, 0.1)' }
                }}
              >
                Facebook
              </Button>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Twitter />}
                onClick={() => handleShare('twitter')}
                sx={{
                  color: '#1DA1F2',
                  borderColor: '#1DA1F2',
                  '&:hover': { bgcolor: 'rgba(29, 161, 242, 0.1)' }
                }}
              >
                Twitter
              </Button>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LinkedIn />}
                onClick={() => handleShare('linkedin')}
                sx={{
                  color: '#0077B5',
                  borderColor: '#0077B5',
                  '&:hover': { bgcolor: 'rgba(0, 119, 181, 0.1)' }
                }}
              >
                LinkedIn
              </Button>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<WhatsApp />}
                onClick={() => handleShare('whatsapp')}
                sx={{
                  color: '#25D366',
                  borderColor: '#25D366',
                  '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.1)' }
                }}
              >
                WhatsApp
              </Button>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Telegram />}
                onClick={() => handleShare('telegram')}
                sx={{
                  color: '#0088CC',
                  borderColor: '#0088CC',
                  '&:hover': { bgcolor: 'rgba(0, 136, 204, 0.1)' }
                }}
              >
                Telegram
              </Button>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Email />}
                onClick={() => handleShare('email')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Email
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 3 }}>
          <Button onClick={() => setShareDialogOpen(false)} variant="outlined" color="inherit">
            Close
          </Button>
          <Button onClick={handleCopyLink} variant="contained" color="primary" startIcon={<ContentCopy />}>
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Referral Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#232742',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'primary.main', 
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          Referral Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedReferral && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                  <Typography variant="subtitle1" color="primary.main" gutterBottom>
                    Client Information
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Name</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedReferral.clientName}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Country</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedReferral.country}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Registration Date</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {new Date(selectedReferral.dateRegistered).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Account Type</Typography>
                    <Chip 
                      label={selectedReferral.accountType}
                      size="small"
                      color={getAccountTypeColor(selectedReferral.accountType)}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                  <Typography variant="subtitle1" color="primary.main" gutterBottom>
                    Financial Information
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Total Deposit</Typography>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      ${selectedReferral.totalDeposit.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Your Commission</Typography>
                    <Typography variant="body2" fontWeight={600} color="warning.main">
                      ${selectedReferral.commission.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Referral Level</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedReferral.refLevel}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Status</Typography>
                    <Chip 
                      label={selectedReferral.clientStatus}
                      size="small"
                      color={getStatusColor(selectedReferral.clientStatus)}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 3 }}>
          <Button onClick={() => setDetailsDialogOpen(false)} variant="outlined" color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
