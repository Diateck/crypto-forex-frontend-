import React, { useState, useEffect, useContext } from 'react';
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
  useTheme,
  CircularProgress,
  Badge,
  Tooltip,
  Alert,
  Switch,
  FormControlLabel
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
  VerifiedUser,
  Wifi,
  WifiOff,
  Refresh,
  FilterList,
  Visibility,
  Timeline,
  TrendingFlat
} from '@mui/icons-material';
import { UserContext } from '../contexts/UserContext';
import { BalanceContext } from '../contexts/BalanceContext';
import useLiveCopyTrading from '../hooks/useLiveCopyTrading';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CopyTrading() {
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const { balance } = useContext(BalanceContext);
  
  const [tabValue, setTabValue] = useState(0);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [copyAmount, setCopyAmount] = useState('');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Use the live copy trading hook
  const {
    traders,
    mycopies,
    platforms,
    performanceData,
    tradingHistory,
    loading,
    error,
    connected,
    filters,
    copyTrader,
    stopCopyTrader,
    getTraderDetails,
    getTraderActivity,
    fetchPerformanceData,
    fetchTradingHistory,
    applyFilters,
    refreshData,
    isLive
  } = useLiveCopyTrading();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCopyTrader = (trader) => {
    setSelectedTrader(trader);
    setCopyDialogOpen(true);
  };

  const handleConfirmCopy = async () => {
    try {
      await copyTrader(selectedTrader.id, copyAmount, riskLevel);
      setCopyDialogOpen(false);
      setCopyAmount('');
      setRiskLevel('medium');
      setSelectedTrader(null);
    } catch (error) {
      console.error('Error copying trader:', error);
    }
  };

  const handleStopCopy = async (copyId) => {
    try {
      await stopCopyTrader(copyId, true);
    } catch (error) {
      console.error('Error stopping copy:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    applyFilters({ [filterType]: value });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const getPlatformColor = (platform) => {
    const colors = {
      etoro: '#00C896',
      zulutrade: '#1976D2',
      myfxbook: '#FF6B35',
      tradingview: '#2962FF',
      binance: '#F0B90B'
    };
    return colors[platform] || '#00B386';
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, minHeight: '100vh' }}>
      {/* Header with site name, username and quick actions - with live connection status */}
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
              Username: <span style={{ color: theme.palette.primary.main }}>
                {user?.username || 'theophilus'}
              </span>
            </Typography>
          </Box>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          {/* Live Connection Status */}
          <Chip 
            icon={connected ? <Wifi /> : <WifiOff />} 
            label={connected ? 'Live Stream' : 'Offline'} 
            color={connected ? 'success' : 'error'} 
            variant="outlined" 
            size="small"
          />
          <Chip icon={<VerifiedUser />} label="KYC" color="primary" variant="outlined" />
          <Button variant="contained" color="primary" startIcon={<Email />} size="small">
            Mail Us
          </Button>
          <Button variant="contained" color="secondary" startIcon={<Settings />} size="small">
            Settings
          </Button>
        </Stack>
      </Box>

      {/* Title and Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Copy Trading
            {connected && (
              <Badge 
                badgeContent="LIVE" 
                color="success" 
                sx={{ ml: 2, '& .MuiBadge-badge': { fontWeight: 'bold' } }}
              />
            )}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Follow and copy successful traders from real trading platforms
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                color="primary"
              />
            }
            label="Auto Refresh"
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refreshData}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Refresh'}
          </Button>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card sx={{ mb: 3, bgcolor: '#232742', color: '#fff' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Filter Traders</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Platform</InputLabel>
                  <Select
                    value={filters.platform}
                    label="Platform"
                    onChange={(e) => handleFilterChange('platform', e.target.value)}
                    sx={{ color: '#fff' }}
                  >
                    <MenuItem value="all">All Platforms</MenuItem>
                    {platforms.map(platform => (
                      <MenuItem key={platform.id} value={platform.id}>
                        {platform.name} ({platform.traderCount})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Min ROI %"
                  type="number"
                  value={filters.minRoi}
                  onChange={(e) => handleFilterChange('minRoi', e.target.value)}
                  sx={{ 
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiOutlinedInput-input': { color: '#fff' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Max Risk Score"
                  type="number"
                  value={filters.maxRisk}
                  onChange={(e) => handleFilterChange('maxRisk', e.target.value)}
                  sx={{ 
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiOutlinedInput-input': { color: '#fff' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="Sort By"
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    sx={{ color: '#fff' }}
                  >
                    <MenuItem value="roi">ROI %</MenuItem>
                    <MenuItem value="followers">Followers</MenuItem>
                    <MenuItem value="winRate">Win Rate</MenuItem>
                    <MenuItem value="profit">Total Profit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

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
        {loading && traders.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {traders.map((trader) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={trader.id}>
                <Card sx={{ 
                  height: '100%', 
                  position: 'relative',
                  background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
                  color: '#fff',
                  borderRadius: 3,
                  boxShadow: 6,
                  transition: 'transform 0.2s, boxShadow 0.2s',
                  border: trader.isLive ? `2px solid ${getPlatformColor(trader.platform)}` : 'none',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 12
                  }
                }}>
                  <CardContent>
                    {/* Platform Badge */}
                    <Chip
                      label={trader.platform?.toUpperCase() || 'PLATFORM'}
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        left: 8,
                        bgcolor: getPlatformColor(trader.platform),
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    />
                    
                    {/* Live Status & Verified Badge */}
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                      {trader.isLive && (
                        <Tooltip title="Live Real-Time Data">
                          <Chip
                            icon={<Wifi />}
                            label="LIVE"
                            size="small"
                            color="success"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Tooltip>
                      )}
                      {trader.verified && (
                        <Chip
                          icon={<Star />}
                          label="Verified"
                          size="small"
                          color="primary"
                        />
                      )}
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={2} mt={3}>
                      <Avatar 
                        src={trader.avatar} 
                        sx={{ 
                          mr: 2, 
                          width: 64, 
                          height: 64, 
                          bgcolor: 'primary.main',
                          border: '3px solid',
                          borderColor: trader.status === 'online' ? 'success.main' : 'grey.500'
                        }}
                      >
                        <Person />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold" color="#fff">
                          {trader.name}
                        </Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">
                          {trader.realName && `${trader.realName} • `}{trader.country}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Box 
                            width={8} 
                            height={8} 
                            borderRadius="50%" 
                            bgcolor={trader.status === 'online' ? 'success.main' : 'grey.500'} 
                            mr={1}
                          />
                          <Typography variant="caption" color="success.main" fontWeight="bold">
                            {formatTimeAgo(trader.lastTradeTime)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 2 }}>
                      {trader.description}
                    </Typography>

                    {/* Specializations */}
                    {trader.specializations && (
                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {trader.specializations.slice(0, 3).map((spec, index) => (
                          <Chip
                            key={index}
                            label={spec}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(0,179,134,0.2)', 
                              color: '#00B386',
                              fontSize: '0.7rem'
                            }}
                          />
                        ))}
                      </Box>
                    )}

                    {/* Profit Display */}
                    <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(0,179,134,0.1)', borderRadius: 2 }}>
                      <Typography variant="body2" color="success.main" fontWeight="bold" textAlign="center">
                        Total Profit: ${trader.totalProfit?.toLocaleString() || 'N/A'}
                      </Typography>
                    </Box>

                    {/* Performance Metrics */}
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
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="body2" fontWeight="bold" color="#fff">
                            {trader.followers?.toLocaleString() || '0'}
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)">
                            Followers
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="body2" fontWeight="bold" color="#fff">
                            {trader.copiers?.toLocaleString() || '0'}
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)">
                            Copiers
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="body2" fontWeight="bold" color="#fff">
                            {trader.totalTrades?.toLocaleString() || '0'}
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)">
                            Trades
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Daily Performance */}
                    {trader.dailyReturn !== undefined && (
                      <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="rgba(255,255,255,0.8)">
                            Today's P&L
                          </Typography>
                          <Box display="flex" alignItems="center">
                            {trader.dailyReturn > 0 ? (
                              <TrendingUp color="success" sx={{ mr: 0.5, fontSize: 16 }} />
                            ) : trader.dailyReturn < 0 ? (
                              <TrendingDown color="error" sx={{ mr: 0.5, fontSize: 16 }} />
                            ) : (
                              <TrendingFlat sx={{ mr: 0.5, fontSize: 16, color: 'grey.500' }} />
                            )}
                            <Typography 
                              variant="body2" 
                              fontWeight="bold" 
                              color={trader.dailyReturn > 0 ? 'success.main' : trader.dailyReturn < 0 ? 'error.main' : 'grey.500'}
                            >
                              {trader.dailyReturn > 0 ? '+' : ''}{trader.dailyReturn?.toFixed(2)}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Risk Score */}
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
                        sx={{ borderRadius: 1, height: 6 }}
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Stack spacing={1}>
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
                          boxShadow: 3,
                          background: 'linear-gradient(45deg, #00B386 30%, #00E5A0 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #009970 30%, #00CC8F 90%)',
                          }
                        }}
                      >
                        Copy Trader
                      </Button>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.3)' }}
                      >
                        View Details
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* My Copied Traders Tab */}
      <TabPanel value={tabValue} index={1}>
        {loading && mycopies.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={60} />
          </Box>
        ) : mycopies.length > 0 ? (
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
                  <TableCell align="right">Current Value</TableCell>
                  <TableCell align="right">Profit/Loss</TableCell>
                  <TableCell align="right">Return %</TableCell>
                  <TableCell align="center">Platform</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Last Activity</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mycopies.map((copy) => (
                  <TableRow key={copy.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Badge
                          badgeContent={copy.isLive ? "LIVE" : ""}
                          color="success"
                          sx={{ mr: 1 }}
                        >
                          <Avatar 
                            src={copy.traderAvatar} 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: 'primary.main',
                              border: `2px solid ${copy.trader?.status === 'online' ? '#00B386' : 'grey.500'}`
                            }}
                          >
                            <Person />
                          </Avatar>
                        </Badge>
                        <Box ml={1}>
                          <Typography color="#fff" fontWeight={600}>
                            {copy.traderName}
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.6)">
                            Started: {new Date(copy.startDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="#fff" fontWeight={600}>
                        ${copy.amount?.toLocaleString() || '0'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="#fff" fontWeight={600}>
                        ${copy.currentValue?.toLocaleString() || copy.amount?.toLocaleString() || '0'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={copy.totalProfit >= 0 ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        ${copy.totalProfit >= 0 ? '+' : ''}{copy.totalProfit?.toLocaleString() || '0'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        {copy.profitPercentage >= 0 ? (
                          <TrendingUp color="success" sx={{ mr: 0.5 }} />
                        ) : (
                          <TrendingDown color="error" sx={{ mr: 0.5 }} />
                        )}
                        <Typography
                          color={copy.profitPercentage >= 0 ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          {copy.profitPercentage >= 0 ? '+' : ''}{copy.profitPercentage?.toFixed(2) || '0.00'}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={copy.platform?.toUpperCase() || 'PLATFORM'}
                        size="small"
                        sx={{ 
                          bgcolor: getPlatformColor(copy.platform),
                          color: '#fff',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={copy.status}
                        color={copy.status === 'active' ? 'success' : 'default'}
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          '& .MuiChip-label': { color: '#fff' }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography color="success.main" fontWeight={600} variant="body2">
                        {formatTimeAgo(copy.lastActivity)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Stop Copying">
                        <IconButton
                          color="error"
                          onClick={() => handleStopCopy(copy.id)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <Stop />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Settings">
                        <IconButton color="primary" size="small" sx={{ mr: 1 }}>
                          <Settings />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Activity">
                        <IconButton color="info" size="small">
                          <Timeline />
                        </IconButton>
                      </Tooltip>
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
                Start copying successful traders from real platforms to see them here
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setTabValue(0)} 
                sx={{ borderRadius: 2 }}
                startIcon={<ContentCopy />}
              >
                Browse Live Traders
              </Button>
            </CardContent>
          </Card>
        )}
      </TabPanel>

      {/* Performance Tab */}
      <TabPanel value={tabValue} index={2}>
        {loading && !performanceData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={60} />
          </Box>
        ) : mycopies.length > 0 || performanceData ? (
          <Grid container spacing={3}>
            {/* Performance Summary Cards - Using Real Data */}
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
                    ${performanceData?.metrics?.totalProfit?.toLocaleString() || 
                      mycopies.reduce((sum, copy) => sum + (copy.totalProfit || 0), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Total Profit
                  </Typography>
                  {performanceData?.metrics?.dailyProfit && (
                    <Typography variant="caption" color="success.main">
                      +${performanceData.metrics.dailyProfit.toFixed(2)} today
                    </Typography>
                  )}
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
                    {performanceData?.metrics?.totalReturnPercent?.toFixed(2) || 
                     (mycopies.length > 0 
                      ? (mycopies.reduce((sum, copy) => sum + (copy.profitPercentage || 0), 0) / mycopies.length).toFixed(2)
                      : '0.00'
                     )}%
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Average Return
                  </Typography>
                  {performanceData?.metrics?.sharpeRatio && (
                    <Typography variant="caption" color="rgba(255,255,255,0.6)">
                      Sharpe: {performanceData.metrics.sharpeRatio}
                    </Typography>
                  )}
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
                    {performanceData?.metrics?.activeCopies || 
                     mycopies.filter(copy => copy.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Active Copies
                  </Typography>
                  {connected && (
                    <Chip 
                      label="LIVE" 
                      size="small" 
                      color="success" 
                      sx={{ mt: 0.5, fontWeight: 'bold' }}
                    />
                  )}
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
                    ${performanceData?.metrics?.totalInvested?.toLocaleString() || 
                      mycopies.reduce((sum, copy) => sum + (copy.amount || 0), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Total Invested
                  </Typography>
                  {performanceData?.metrics?.totalCurrentValue && (
                    <Typography variant="caption" color="primary.main">
                      Current: ${performanceData.metrics.totalCurrentValue.toLocaleString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Metrics Cards */}
            {performanceData?.metrics && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
                    borderRadius: 3,
                    boxShadow: 6,
                    color: '#fff'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="success.main" gutterBottom>
                        Best Day
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        +${performanceData.metrics.bestDay?.toFixed(2) || '0.00'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
                    borderRadius: 3,
                    boxShadow: 6,
                    color: '#fff'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="error.main" gutterBottom>
                        Max Drawdown
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        -{performanceData.metrics.maxDrawdown?.toFixed(1) || '0.0'}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
                    borderRadius: 3,
                    boxShadow: 6,
                    color: '#fff'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary.main" gutterBottom>
                        Win Rate
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {((performanceData.metrics.winningDays / performanceData.metrics.totalDays) * 100).toFixed(1) || '0.0'}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}

            {/* Performance Chart */}
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
                borderRadius: 3,
                boxShadow: 6,
                color: '#fff'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Portfolio Performance
                      {connected && (
                        <Chip 
                          label="LIVE DATA" 
                          size="small" 
                          color="success" 
                          sx={{ ml: 2, fontWeight: 'bold' }}
                        />
                      )}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button 
                        size="small" 
                        variant={performanceData?.period === '7d' ? 'contained' : 'outlined'}
                        onClick={() => fetchPerformanceData('7d')}
                      >
                        7D
                      </Button>
                      <Button 
                        size="small" 
                        variant={performanceData?.period === '30d' ? 'contained' : 'outlined'}
                        onClick={() => fetchPerformanceData('30d')}
                      >
                        30D
                      </Button>
                      <Button 
                        size="small" 
                        variant={performanceData?.period === '90d' ? 'contained' : 'outlined'}
                        onClick={() => fetchPerformanceData('90d')}
                      >
                        90D
                      </Button>
                    </Stack>
                  </Box>
                  
                  {performanceData?.performanceChart?.length > 0 ? (
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData.performanceChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="date" 
                            stroke="rgba(255,255,255,0.7)"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.7)"
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#232742', 
                              border: '1px solid #00B386',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="totalProfit" 
                            stroke="#00B386" 
                            strokeWidth={3}
                            dot={{ fill: '#00B386', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#00B386', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      height: 300, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      borderRadius: 2
                    }}>
                      <Typography variant="h6" color="rgba(255,255,255,0.6)">
                        {loading ? 'Loading performance data...' : 'Performance chart will update with live data'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Card sx={{ 
            background: 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)',
            borderRadius: 3,
            boxShadow: 6
          }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <BarChart sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
              <Typography variant="h6" color="rgba(255,255,255,0.8)" gutterBottom>
                No Performance Data Available
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mb: 3 }}>
                Start copying traders to track your performance with live data
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setTabValue(0)} 
                sx={{ borderRadius: 2 }}
                startIcon={<ContentCopy />}
              >
                Start Copy Trading
              </Button>
            </CardContent>
          </Card>
        )}
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
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Copy {selectedTrader?.name}
              </Typography>
              {selectedTrader?.platform && (
                <Chip
                  label={selectedTrader.platform.toUpperCase()}
                  size="small"
                  sx={{ 
                    bgcolor: getPlatformColor(selectedTrader.platform),
                    color: '#fff',
                    fontWeight: 'bold',
                    mt: 0.5
                  }}
                />
              )}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Balance Info */}
            <Alert severity="info" sx={{ mb: 3, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
              Available Balance: ${balance?.balance?.toLocaleString() || '0'}
            </Alert>

            <TextField
              fullWidth
              label="Amount to Copy (USD)"
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
              helperText={selectedTrader?.platformInfo && (
                <Typography variant="caption" color="rgba(255,255,255,0.6)">
                  Min: ${selectedTrader.platformInfo.minCopyAmount} | Max: ${selectedTrader.platformInfo.maxCopyAmount}
                </Typography>
              )}
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
                <MenuItem value="low">Low Risk (Conservative)</MenuItem>
                <MenuItem value="medium">Medium Risk (Balanced)</MenuItem>
                <MenuItem value="high">High Risk (Aggressive)</MenuItem>
              </Select>
            </FormControl>

            {selectedTrader && (
              <Card 
                variant="outlined" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                  borderRadius: 2,
                  mb: 2
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={selectedTrader.avatar} sx={{ mr: 2, width: 48, height: 48 }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" color="#fff">
                        {selectedTrader.name}
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                        {selectedTrader.specializations?.join(', ') || 'Professional Trader'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom color="#fff" fontWeight="bold">
                    Performance Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Total ROI</Typography>
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                        {selectedTrader.roi}%
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Win Rate</Typography>
                      <Typography variant="h6" color="#fff" fontWeight="bold">
                        {selectedTrader.winRate}%
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Risk Score</Typography>
                      <Typography variant="h6" color="warning.main" fontWeight="bold">
                        {selectedTrader.riskScore}/10
                      </Typography>
                    </Grid>
                  </Grid>

                  {copyAmount && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(0,179,134,0.1)', borderRadius: 1 }}>
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        Estimated Monthly Return: ${((parseFloat(copyAmount) * selectedTrader.monthlyReturn) / 100).toFixed(2)}
                      </Typography>
                    </Box>
                  )}
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
            disabled={!copyAmount || parseFloat(copyAmount) <= 0 || loading}
            sx={{ 
              borderRadius: 2,
              fontWeight: 700
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Start Copying'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
