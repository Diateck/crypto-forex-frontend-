import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Stack,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Person,
  ContentCopy,
  Stop,
  Settings,
  Star,
  BarChart,
  Email,
  VerifiedUser
} from '@mui/icons-material';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CopyTrading() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [copyAmount, setCopyAmount] = useState('');
  const [riskLevel, setRiskLevel] = useState('medium');

  // Mock data for top traders
  const topTraders = [
    {
      id: 1,
      name: 'Alex Morgan',
      avatar: '/api/placeholder/40/40',
      roi: 145.8,
      followers: 2847,
      winRate: 78,
      totalTrades: 342,
      riskScore: 6.2,
      verified: true,
      rank: 1,
      monthlyReturn: 12.4,
      copiers: 156,
      description: 'Crypto specialist with 5+ years experience'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      avatar: '/api/placeholder/40/40',
      roi: 128.5,
      followers: 1923,
      winRate: 74,
      totalTrades: 289,
      riskScore: 4.8,
      verified: true,
      rank: 2,
      monthlyReturn: 9.8,
      copiers: 89,
      description: 'Forex and commodities expert'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: '/api/placeholder/40/40',
      roi: 112.3,
      followers: 1654,
      winRate: 71,
      totalTrades: 195,
      riskScore: 7.1,
      verified: false,
      rank: 3,
      monthlyReturn: 8.2,
      copiers: 67,
      description: 'Day trading specialist'
    }
  ];

  // Mock data for copied traders
  const copiedTraders = [
    {
      id: 1,
      name: 'Alex Morgan',
      avatar: '/api/placeholder/40/40',
      amountCopied: 5000,
      profit: 620,
      profitPercentage: 12.4,
      status: 'active',
      startDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      avatar: '/api/placeholder/40/40',
      amountCopied: 3000,
      profit: -180,
      profitPercentage: -6.0,
      status: 'active',
      startDate: '2024-02-01'
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCopyTrader = (trader) => {
    setSelectedTrader(trader);
    setCopyDialogOpen(true);
  };

  const handleConfirmCopy = () => {
    // Here you would implement the actual copy logic
    console.log('Copying trader:', selectedTrader, 'Amount:', copyAmount, 'Risk:', riskLevel);
    setCopyDialogOpen(false);
    setCopyAmount('');
    setRiskLevel('medium');
  };

  const handleStopCopy = (traderId) => {
    // Here you would implement stop copying logic
    console.log('Stopping copy for trader:', traderId);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, minHeight: '100vh' }}>
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
          <Button variant="contained" color="primary" startIcon={<ContentCopy />} size="small">
            Copy Trading
          </Button>
          <Button variant="contained" color="secondary" startIcon={<Settings />} size="small">
            Settings
          </Button>
        </Stack>
      </Box>

      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Copy Trading
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Follow and copy successful traders automatically
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Top Traders" />
          <Tab label="My Copied Traders" />
          <Tab label="Performance" />
        </Tabs>
      </Box>

      {/* Top Traders Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {topTraders.map((trader) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={trader.id}>
              <Card sx={{ 
                height: '100%', 
                position: 'relative',
                background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
                color: '#fff',
                borderRadius: 3,
                boxShadow: 6,
                transition: 'transform 0.2s, boxShadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 12
                }
              }}>
                <CardContent>
                  {trader.verified && (
                    <Chip
                      icon={<Star />}
                      label="Verified"
                      size="small"
                      color="primary"
                      sx={{ position: 'absolute', top: 16, right: 16 }}
                    />
                  )}
                  
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar src={trader.avatar} sx={{ mr: 2, width: 56, height: 56, bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="#fff">
                        {trader.name}
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                        Rank #{trader.rank}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 2 }}>
                    {trader.description}
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                          {trader.roi}%
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">
                          Total ROI
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h6" fontWeight="bold" color="#fff">
                          {trader.winRate}%
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">
                          Win Rate
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="body2" fontWeight="bold" color="#fff">
                          {trader.followers}
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">
                          Followers
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="body2" fontWeight="bold" color="#fff">
                          {trader.copiers}
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">
                          Copiers
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" color="rgba(255,255,255,0.8)">Risk Score</Typography>
                      <Typography variant="body2" fontWeight="bold" color="#fff">
                        {trader.riskScore}/10
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={trader.riskScore * 10}
                      color={trader.riskScore <= 4 ? 'success' : trader.riskScore <= 7 ? 'warning' : 'error'}
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<ContentCopy />}
                    onClick={() => handleCopyTrader(trader)}
                    sx={{ 
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: 3
                    }}
                  >
                    Copy Trader
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* My Copied Traders Tab */}
      <TabPanel value={tabValue} index={1}>
        {copiedTraders.length > 0 ? (
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 3, 
              boxShadow: 6,
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              overflow: 'auto'
            }}
          >
            <Table sx={{ '& .MuiTableCell-root': { color: '#fff', borderColor: 'rgba(255,255,255,0.1)' } }}>
              <TableHead>
                <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 700, bgcolor: 'rgba(255,255,255,0.05)' } }}>
                  <TableCell>Trader</TableCell>
                  <TableCell align="right">Amount Copied</TableCell>
                  <TableCell align="right">Profit/Loss</TableCell>
                  <TableCell align="right">Return %</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Start Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {copiedTraders.map((trader) => (
                  <TableRow key={trader.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={trader.avatar} sx={{ mr: 2, width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <Person />
                        </Avatar>
                        <Typography color="#fff" fontWeight={600}>
                          {trader.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="#fff" fontWeight={600}>
                        ${trader.amountCopied.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={trader.profit >= 0 ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        ${trader.profit >= 0 ? '+' : ''}{trader.profit.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        {trader.profitPercentage >= 0 ? (
                          <TrendingUp color="success" sx={{ mr: 0.5 }} />
                        ) : (
                          <TrendingDown color="error" sx={{ mr: 0.5 }} />
                        )}
                        <Typography
                          color={trader.profitPercentage >= 0 ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          {trader.profitPercentage >= 0 ? '+' : ''}{trader.profitPercentage}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={trader.status}
                        color={trader.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography color="#fff">
                        {trader.startDate}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleStopCopy(trader.id)}
                        title="Stop Copying"
                        size="small"
                      >
                        <Stop />
                      </IconButton>
                      <IconButton color="primary" title="Settings" size="small">
                        <Settings />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Card sx={{ 
            background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
            borderRadius: 3,
            boxShadow: 6
          }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="rgba(255,255,255,0.8)" gutterBottom>
                No Copied Traders Yet
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mb: 3 }}>
                Start copying successful traders to see them here
              </Typography>
              <Button variant="contained" onClick={() => setTabValue(0)} sx={{ borderRadius: 2 }}>
                Browse Top Traders
              </Button>
            </CardContent>
          </Card>
        )}
      </TabPanel>

      {/* Performance Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6,
              color: '#fff',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <BarChart color="primary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  +$440
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Total Profit
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6,
              color: '#fff',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp color="primary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary">
                  4.2%
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Average Return
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6,
              color: '#fff',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ContentCopy color="primary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#fff">
                  2
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Active Copies
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
              borderRadius: 3,
              boxShadow: 6,
              color: '#fff',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Person color="primary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#fff">
                  $8,000
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Total Invested
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Copy Trader Dialog */}
      <Dialog 
        open={copyDialogOpen} 
        onClose={() => setCopyDialogOpen(false)} 
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ContentCopy color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Copy {selectedTrader?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Amount to Copy"
              type="number"
              value={copyAmount}
              onChange={(e) => setCopyAmount(e.target.value)}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#fff',
                },
              }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: '#fff' }}>$</Typography>
              }}
            />
            
            <FormControl 
              fullWidth 
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiSelect-select': {
                  color: '#fff',
                },
              }}
            >
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={riskLevel}
                label="Risk Level"
                onChange={(e) => setRiskLevel(e.target.value)}
              >
                <MenuItem value="low">Low Risk</MenuItem>
                <MenuItem value="medium">Medium Risk</MenuItem>
                <MenuItem value="high">High Risk</MenuItem>
              </Select>
            </FormControl>

            {selectedTrader && (
              <Card 
                variant="outlined" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                  borderRadius: 2
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom color="#fff" fontWeight="bold">
                    Trader Performance
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Total ROI</Typography>
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                        {selectedTrader.roi}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Win Rate</Typography>
                      <Typography variant="h6" color="#fff" fontWeight="bold">
                        {selectedTrader.winRate}%
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
          <Button onClick={() => setCopyDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmCopy}
            variant="contained"
            disabled={!copyAmount}
            sx={{ 
              borderRadius: 2,
              fontWeight: 700
            }}
          >
            Start Copying
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
