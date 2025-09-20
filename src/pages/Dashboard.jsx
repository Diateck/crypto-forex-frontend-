import React from 'react';
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

// Leverage options for the trading panel
const leverageOptions = [
  2, 3, 4, 5, 10, 25, 30, 40, 50, 60, 70, 80, 90, 100
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
        {/* Chart Placeholder */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 6, minHeight: 240, bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Performance Chart
              </Typography>
              <Box sx={{ height: 180, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ background: '#23272F', border: 'none', color: '#fff' }} />
                    <Line type="monotone" dataKey="value" stroke="#00B386" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
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
    </Box>
  );
}