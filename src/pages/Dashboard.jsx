import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Typography, Box, Grid, Card, useTheme, Avatar, Button, Stack, Chip } from '@mui/material';
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
  { label: 'Total Balance', value: '$0.00', icon: <AccountBalanceWalletIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />, gradient: cardGradient },
  { label: 'Profit', value: '$0.00', icon: <ShowChartIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />, gradient: cardGradient },
  { label: 'Total Bonus', value: '$0.00', icon: <GroupIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />, gradient: cardGradient },
  { label: 'Account Status', value: 'UNVERIFIED', icon: <VerifiedUserIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />, gradient: cardGradient, chip: true },
];

const bottomCards = [
  { label: 'Total Trades', value: '0', icon: <ShowChartIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />, gradient: cardGradient },
  { label: 'Open Trades', value: '0', icon: <FolderOpenIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />, gradient: cardGradient },
  { label: 'Closed Trades', value: '0', icon: <HistoryIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />, gradient: cardGradient },
  { label: 'Win/Loss Ratio', value: '0', icon: <EmojiEventsIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />, gradient: cardGradient },
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
  const [selectedForex, setSelectedForex] = useState('OANDA:EURUSD');
  const [selectedStock, setSelectedStock] = useState('NASDAQ:AAPL');
  const [chartWidth, setChartWidth] = useState(900);
  const isResizing = useRef(false);

  const handleMouseDown = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
  }, []);
  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    if (typeof document !== 'undefined') {
      document.body.style.cursor = '';
    }
  }, []);
  
  const handleMouseMove = useCallback((e) => {
    if (isResizing.current && typeof window !== 'undefined') {
      const newWidth = Math.max(300, Math.min(window.innerWidth, e.clientX - 50));
      setChartWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseUp]);

  return (
    <Box p={{ xs: 1, sm: 3 }}>
      {/* Header with site name, username and quick actions */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 2, 
        bgcolor: '#232742', 
        p: { xs: 1.5, sm: 2 }, 
        borderRadius: 3, 
        boxShadow: 3,
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 0 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            width: { xs: 32, sm: 40, md: 48 }, 
            height: { xs: 32, sm: 40, md: 48 } 
          }}>
            <PersonIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' } }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h5"
              fontWeight={900} 
              color={theme.palette.primary.main}
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}
            >
              Elon Investment Broker
            </Typography>
            <Typography 
              variant="h6"
              fontWeight={700} 
              color="#fff"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
            >
              Username: <span style={{ color: theme.palette.primary.main }}>theophilus</span>
            </Typography>
          </Box>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} alignItems="center">
          <Chip 
            icon={<VerifiedUserIcon />} 
            label="KYC" 
            color="primary" 
            variant="outlined" 
            size="small"
            sx={{ 
              height: { xs: 24, sm: 32 },
              fontSize: { xs: '0.7rem', sm: '0.8125rem' }
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<EmailIcon />} 
            size="small"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 32, sm: 36 },
              px: { xs: 2, sm: 3 }
            }}
          >
            Mail Us
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<SettingsIcon />} 
            size="small"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 32, sm: 36 },
              px: { xs: 2, sm: 3 }
            }}
          >
            Settings
          </Button>
        </Stack>
      </Box>

      {/* Ticker Bar */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 2, md: 3 }, 
        bgcolor: '#181A20', 
        p: 1.5, 
        borderRadius: 2, 
        mb: 3, 
        overflowX: 'auto', 
        boxShadow: 1,
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-track': { bgcolor: 'rgba(255,255,255,0.1)' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.main', borderRadius: 3 }
      }}>
        {tickerData.map((item, idx) => (
          <Box key={idx} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            minWidth: { xs: 150, sm: 180 },
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
              {item.label}
            </Typography>
            <Typography variant="body1" color="#fff" fontWeight={700}>
              {item.value}
            </Typography>
            <Typography variant="body2" color={item.color} fontWeight={700}>
              {item.change}
            </Typography>
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
                minHeight: { xs: 100, sm: 120 },
                display: 'flex',
                alignItems: 'center',
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1.5, sm: 2 },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2 } }}>{card.icon}</Box>
              <Box>
                <Typography 
                  variant="h6"
                  fontWeight={700} 
                  sx={{ 
                    color: '#fff',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  {card.value}
                </Typography>
                <Typography 
                  variant="subtitle2"
                  fontWeight={500} 
                  sx={{ 
                    color: '#fff', 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {card.label}
                </Typography>
                {card.chip && (
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label="UNVERIFIED" 
                      color="default" 
                      size="small" 
                      sx={{ 
                        bgcolor: '#fff', 
                        color: '#f5576c', 
                        fontWeight: 700,
                        height: { xs: 20, sm: 24 },
                        fontSize: { xs: '0.6rem', sm: '0.75rem' }
                      }} 
                    />
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
                minHeight: { xs: 100, sm: 120 },
                display: 'flex',
                alignItems: 'center',
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1.5, sm: 2 },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2 } }}>{card.icon}</Box>
              <Box>
                <Typography 
                  variant="h6"
                  fontWeight={700} 
                  sx={{ 
                    color: '#fff',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  {card.value}
                </Typography>
                <Typography 
                  variant="subtitle2"
                  fontWeight={500} 
                  sx={{ 
                    color: '#fff', 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {card.label}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Three Large, Vertically Arranged Live Charts */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', width: '100%' }}>
        {/* Crypto Trading Chart */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: 6, 
          minHeight: { xs: 280, sm: 320 }, 
          bgcolor: theme.palette.background.paper, 
          width: '100%', 
          maxWidth: 1200, 
          p: { xs: 1, sm: 2 }, 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <Typography 
            variant="h5"
            fontWeight={700} 
            sx={{ 
              mb: 2, 
              textAlign: 'center',
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            Crypto Trading Chart
          </Typography>
          <Box sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <select
              value={selectedPair}
              onChange={e => setSelectedPair(e.target.value)}
              style={{ 
                padding: '8px 16px', 
                fontSize: '1rem', 
                borderRadius: 6, 
                background: '#232742', 
                color: '#fff', 
                border: '1px solid #444',
                width: '100%',
                maxWidth: 300
              }}
            >
              {cryptoPairs.map(pair => (
                <option key={pair.value} value={pair.value}>{pair.label}</option>
              ))}
            </select>
          </Box>
          <Box sx={{ 
            width: { xs: '100%', sm: chartWidth }, 
            minWidth: 300, 
            maxWidth: '100%', 
            transition: 'width 0.1s', 
            position: 'relative', 
            display: 'flex', 
            justifyContent: 'center' 
          }}>
            <iframe
              title="Crypto Trading Chart"
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_crypto&symbol=${selectedPair}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              style={{ borderRadius: 8 }}
            />
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
                display: typeof window !== 'undefined' && window.innerWidth < 600 ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Drag to resize chart"
            >
              <span style={{ width: 4, height: 40, background: '#888', borderRadius: 2 }} />
            </div>
          </Box>
        </Card>

        {/* Forex Trading Chart */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: 6, 
          minHeight: { xs: 280, sm: 320 }, 
          bgcolor: theme.palette.background.paper, 
          width: '100%', 
          maxWidth: 1200, 
          p: { xs: 1, sm: 2 }, 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <Typography 
            variant="h5"
            fontWeight={700} 
            sx={{ 
              mb: 2,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            Forex Trading Chart
          </Typography>
          <Box sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <select
              value={selectedForex}
              onChange={e => setSelectedForex(e.target.value)}
              style={{ padding: '8px 16px', fontSize: '1rem', borderRadius: 6, background: '#232742', color: '#fff', border: '1px solid #444' }}
            >
              {['OANDA:EURUSD','OANDA:GBPUSD','OANDA:USDJPY','OANDA:USDCHF','OANDA:AUDUSD','OANDA:USDCAD','OANDA:NZDUSD'].map(pair => (
                <option key={pair} value={pair}>{pair.replace('OANDA:','')}</option>
              ))}
            </select>
          </Box>
          <Box sx={{ width: chartWidth, minWidth: 300, maxWidth: '100%', transition: 'width 0.1s', position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <iframe
              title="Forex Trading Chart"
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_forex&symbol=${selectedForex}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              style={{ borderRadius: 8 }}
            />
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
              <span style={{ width: 4, height: 40, background: '#888', borderRadius: 2 }} />
            </div>
          </Box>
        </Card>

        {/* Stock Market Data Chart */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: 6, 
          minHeight: { xs: 280, sm: 320 }, 
          bgcolor: theme.palette.background.paper, 
          width: '100%', 
          maxWidth: 1200, 
          p: { xs: 1, sm: 2 }, 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <Typography 
            variant="h5"
            fontWeight={700} 
            sx={{ 
              mb: 2,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            Stock Market Data Chart
          </Typography>
          <Box sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <select
              value={selectedStock}
              onChange={e => setSelectedStock(e.target.value)}
              style={{ padding: '8px 16px', fontSize: '1rem', borderRadius: 6, background: '#232742', color: '#fff', border: '1px solid #444' }}
            >
              {['NASDAQ:AAPL','NASDAQ:MSFT','NASDAQ:GOOGL','NASDAQ:AMZN','NASDAQ:TSLA','NYSE:BRK.A','NYSE:JPM','NYSE:V','NYSE:UNH','NYSE:HD'].map(stock => (
                <option key={stock} value={stock}>{stock.replace(/^[A-Z]+:/,'')}</option>
              ))}
            </select>
          </Box>
          <Box sx={{ width: chartWidth, minWidth: 300, maxWidth: '100%', transition: 'width 0.1s', position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <iframe
              title="Stock Market Data Chart"
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_stock&symbol=${selectedStock}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              style={{ borderRadius: 8 }}
            />
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
              <span style={{ width: 4, height: 40, background: '#888', borderRadius: 2 }} />
            </div>
          </Box>
        </Card>
      </Box>

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

      {/* Live Trading Chart */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: chartWidth, minWidth: 300, transition: 'width 0.1s', position: 'relative' }}>
          <iframe
            title="Live Trading Chart"
            src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_12345&symbol=${selectedPair}&interval=1&theme=dark&style=1&locale=en&toolbarbg=232742&studies=[]&hideideas=1`}
            width="100%"
            height="500"
            frameBorder="0"
            scrolling="no"
            style={{ borderRadius: 8 }}
          />
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
            <span style={{ width: 4, height: 40, background: '#888', borderRadius: 2 }} />
          </div>
        </div>
      </Box>
    </Box>
  );
}
