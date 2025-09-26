
import React, { useState, useRef } from 'react';
import { Typography, Box, Grid, Card, CardContent, Divider, List, ListItem, ListItemText, useTheme, Avatar, Button, Stack, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import OutboxIcon from '@mui/icons-material/Outbox';
import HistoryIcon from '@mui/icons-material/History';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Sample ticker data
const tickerData = [
  { label: 'Nasdaq 100', value: '24,344.8', change: '+98.90 (+0.41%)', color: 'success.main' },
  { label: 'EUR/USD', value: '1.18099', change: '-0.00059 (-0.05%)', color: 'error.main' },
  { label: 'BTC/USD', value: '116,747', change: '+270.00 (+0.23%)', color: 'success.main' },
  { label: 'ETH/USD', value: '4,620.8', change: '+28.50', color: 'success.main' },
];

// Example market data for the chart
const marketData = [
  { name: 'Mon', value: 12000 },
  { name: 'Tue', value: 12500 },
  { name: 'Wed', value: 12300 },
  { name: 'Thu', value: 12800 },
  { name: 'Fri', value: 12700 },
  { name: 'Sat', value: 13000 },
  { name: 'Sun', value: 12900 },
];

const cardGradient = 'linear-gradient(135deg, #232742 0%, #1a1d2b 100%)';
const topCards = [
  { label: 'Total Balance', value: '$0.00', icon: <AccountBalanceWalletIcon fontSize="large" />, gradient: cardGradient },
  { label: 'Profit', value: '$0.00', icon: <ShowChartIcon fontSize="large" />, gradient: cardGradient },
  { label: 'Total Bonus', value: '$0.00', icon: <GroupIcon fontSize="large" />, gradient: cardGradient },
  { label: 'Account Status', value: 'UNVERIFIED', icon: <VerifiedUserIcon fontSize="large" />, gradient: cardGradient, chip: true },
];

const bottomCards = [
  { label: 'Total Trades', value: '0', icon: <ShowChartIcon fontSize="large" />, gradient: cardGradient },
  { label: 'Open Trades', value: '0', icon: <FolderOpenIcon fontSize="large" />, gradient: cardGradient },
  { label: 'Closed Trades', value: '0', icon: <HistoryIcon fontSize="large" />, gradient: cardGradient },
  { label: 'Win/Loss Ratio', value: '0', icon: <EmojiEventsIcon fontSize="large" />, gradient: cardGradient },
];

const notifications = [
  'Deposit of $1,000 completed',
  'Trade #1234 closed with +5% profit',
  'Withdrawal of $500 processed',
  'New signal available: EUR/USD',
];

export default function Dashboard() {
  const theme = useTheme();
  // List of crypto pairs for selection
  const cryptoPairs = [
    { label: 'BTC/USDT', value: 'BINANCE:BTCUSDT' },
    { label: 'ETH/USDT', value: 'BINANCE:ETHUSDT' },
    { label: 'BNB/USDT', value: 'BINANCE:BNBUSDT' },
    { label: 'SOL/USDT', value: 'BINANCE:SOLUSDT' },
    { label: 'XRP/USDT', value: 'BINANCE:XRPUSDT' },
    { label: 'DOGE/USDT', value: 'BINANCE:DOGEUSDT' },
    { label: 'ADA/USDT', value: 'BINANCE:ADAUSDT' },
  ];

  const [selectedPair, setSelectedPair] = useState(cryptoPairs[0].value);
  const [chartWidth, setChartWidth] = useState(900);
  const isResizing = useRef(false);

  // Mouse event handlers for resizing
  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
  };
  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = '';
  };
  const handleMouseMove = (e) => {
    if (isResizing.current) {
      // Calculate new width, minimum 300px, maximum 100vw
      const newWidth = Math.max(300, Math.min(window.innerWidth, e.clientX - 50));
      setChartWidth(newWidth);
    }
  };
  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <Box p={{ xs: 1, sm: 3 }}>
      {/* Header with username and quick actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, bgcolor: '#232742', p: 2, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" fontWeight={700} color="#fff">
            Username: <span style={{ color: theme.palette.primary.main }}>theophilus</span>
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip icon={<VerifiedUserIcon />} label="KYC" color="primary" variant="outlined" />
          <Button variant="contained" color="primary" startIcon={<EmailIcon />}>Mail Us</Button>
          <Button variant="contained" color="secondary" startIcon={<SettingsIcon />}>Settings</Button>
        </Stack>
      </Box>

      {/* Ticker Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, bgcolor: '#181A20', p: 1.5, borderRadius: 2, mb: 3, overflowX: 'auto', boxShadow: 1 }}>
        {tickerData.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>{item.label}</Typography>
            <Typography variant="body1" color="#fff" fontWeight={700}>{item.value}</Typography>
            <Typography variant="body2" color={item.color} fontWeight={700}>{item.change}</Typography>
          </Box>
        ))}
      </Box>

      {/* Dashboard Cards - Top Row */}
      <Grid container spacing={3} sx={{ mb: 0.5 }}>
        {topCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 6,
                background: card.gradient,
                color: '#fff',
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 2,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ mr: 2 }}>{card.icon}</Box>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>{card.value}</Typography>
                <Typography variant="subtitle2" fontWeight={500} sx={{ color: '#fff', opacity: 0.9 }}>{card.label}</Typography>
                {card.chip && (
                  <Box sx={{ mt: 1 }}>
                    <Chip label="UNVERIFIED" color="default" size="small" sx={{ bgcolor: '#fff', color: '#f5576c', fontWeight: 700 }} />
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Dashboard Cards - Bottom Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {bottomCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 6,
                background: card.gradient,
                color: '#fff',
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 2,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ mr: 2 }}>{card.icon}</Box>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>{card.value}</Typography>
                <Typography variant="subtitle2" fontWeight={500} sx={{ color: '#fff', opacity: 0.9 }}>{card.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Live Trading Chart (Crypto) & Forex Chart & Notifications - Responsive Layout */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Crypto Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 6, minHeight: 240, bgcolor: theme.palette.background.paper, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Crypto Live Chart
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <select
                  value={selectedPair}
                  onChange={e => setSelectedPair(e.target.value)}
                  style={{ padding: '8px 16px', fontSize: '1rem', borderRadius: 6, background: '#232742', color: '#fff', border: '1px solid #444' }}
                >
                  {cryptoPairs.map(pair => (
                    <option key={pair.value} value={pair.value}>{pair.label}</option>
                  ))}
                </select>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '100%', minWidth: 200, maxWidth: 400, transition: 'width 0.1s', position: 'relative' }}>
                  <iframe
                    title="Crypto Live Trading Chart"
                    src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_12345&symbol=${selectedPair}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
                    width="100%"
                    height="300"
                    allowtransparency="true"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                    style={{ borderRadius: 8 }}
                  ></iframe>
                </div>
              </Box>
            </Box>
          </Card>
        </Grid>
        {/* Forex Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 6, minHeight: 240, bgcolor: theme.palette.background.paper, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Forex Live Chart
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '100%', minWidth: 200, maxWidth: 400, transition: 'width 0.1s', position: 'relative' }}>
                <iframe
                  title="Forex Live Trading Chart"
                  src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_67890&symbol=OANDA:EURUSD&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1"
                  width="100%"
                  height="300"
                  allowtransparency="true"
                  frameBorder="0"
                  scrolling="no"
                  allowFullScreen
                  style={{ borderRadius: 8 }}
                ></iframe>
              </div>
            </Box>
          </Card>
        </Grid>
        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 6, minHeight: 240, bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Recent Notifications
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <List>
                {notifications.map((note, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemText primary={note} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Crypto Pair Selector */}
      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <select
          value={selectedPair}
          onChange={e => setSelectedPair(e.target.value)}
          style={{ padding: '8px 16px', fontSize: '1rem', borderRadius: 6, background: '#232742', color: '#fff', border: '1px solid #444' }}
        >
          {cryptoPairs.map(pair => (
            <option key={pair.value} value={pair.value}>{pair.label}</option>
          ))}
        </select>
      </Box>

      {/* Live Trading Chart (TradingView Widget) with Resizer */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: chartWidth, minWidth: 300, transition: 'width 0.1s', position: 'relative' }}>
          <iframe
            title="Live Trading Chart"
            src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_12345&symbol=${selectedPair}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
            width="100%"
            height="500"
            allowtransparency="true"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            style={{ borderRadius: 8 }}
          ></iframe>
          {/* Resizer bar */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 8,
              height: '100%',
              cursor: 'ew-resize',
              background: 'rgba(35,39,66,0.5)',
              borderRadius: '0 8px 8px 0',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Drag to resize chart"
          >
            <span style={{ width: 4, height: 40, background: '#888', borderRadius: 2 }}></span>
          </div>
        </div>
      </Box>
    </Box>
  );
}
