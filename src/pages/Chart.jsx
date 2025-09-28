import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ButtonGroup,
  styled
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const StyledTab = styled(Tab)(({ theme }) => ({
  color: '#888',
  fontWeight: 600,
  '&.Mui-selected': {
    color: '#00B386',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#181A20',
  border: '1px solid #23272F',
  borderRadius: 12,
}));

const TimeButton = styled(Button)(({ theme }) => ({
  color: '#888',
  borderColor: '#23272F',
  '&.active': {
    backgroundColor: '#00B386',
    color: '#fff',
    borderColor: '#00B386',
  },
  '&:hover': {
    backgroundColor: '#00B386',
    color: '#fff',
    borderColor: '#00B386',
  },
}));

export default function Chart() {
  const [tabValue, setTabValue] = useState(0);
  const [cryptoPair, setCryptoPair] = useState('BTC/USD');
  const [forexPair, setForexPair] = useState('EUR/USD');
  const [timeFrame, setTimeFrame] = useState('1H');
  const [cryptoData, setCryptoData] = useState([]);
  const [forexData, setForexData] = useState([]);
  const [isLive, setIsLive] = useState(true);

  // Crypto pairs
  const cryptoPairs = [
    'BTC/USD', 'ETH/USD', 'BNB/USD', 'ADA/USD', 'SOL/USD', 
    'XRP/USD', 'DOT/USD', 'DOGE/USD', 'AVAX/USD', 'MATIC/USD'
  ];

  // Forex pairs
  const forexPairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 
    'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
  ];

  const timeFrames = ['1M', '5M', '15M', '30M', '1H', '4H', '1D', '1W'];

  // Generate mock price data
  const generateMockData = (basePrice, volatility = 0.02) => {
    const data = [];
    let currentPrice = basePrice;
    const now = new Date();
    
    for (let i = 100; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000); // 1 minute intervals
      const change = (Math.random() - 0.5) * volatility * currentPrice;
      currentPrice += change;
      
      data.push({
        time: timestamp.toLocaleTimeString('en-US', { hour12: false }),
        price: parseFloat(currentPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000,
        high: currentPrice + Math.random() * 100,
        low: currentPrice - Math.random() * 100,
      });
    }
    return data;
  };

  // Initialize data
  useEffect(() => {
    const cryptoBase = {
      'BTC/USD': 65000,
      'ETH/USD': 3200,
      'BNB/USD': 420,
      'ADA/USD': 0.85,
      'SOL/USD': 145,
      'XRP/USD': 0.62,
      'DOT/USD': 18.5,
      'DOGE/USD': 0.15,
      'AVAX/USD': 28,
      'MATIC/USD': 1.2
    };

    const forexBase = {
      'EUR/USD': 1.1750,
      'GBP/USD': 1.3400,
      'USD/JPY': 149.50,
      'USD/CHF': 0.7975,
      'AUD/USD': 0.6546,
      'USD/CAD': 1.3942,
      'NZD/USD': 0.5772,
      'EUR/GBP': 0.8730,
      'EUR/JPY': 174.90,
      'GBP/JPY': 200.33
    };

    setCryptoData(generateMockData(cryptoBase[cryptoPair], 0.03));
    setForexData(generateMockData(forexBase[forexPair], 0.001));
  }, [cryptoPair, forexPair]);

  // Live data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const updateData = (currentData, volatility) => {
        const newData = [...currentData];
        const lastPrice = newData[newData.length - 1].price;
        const change = (Math.random() - 0.5) * volatility * lastPrice;
        const newPrice = lastPrice + change;
        
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          price: parseFloat(newPrice.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 100000,
          high: newPrice + Math.random() * 50,
          low: newPrice - Math.random() * 50,
        });
        
        return newData.slice(-101); // Keep last 101 points
      };

      setCryptoData(prev => updateData(prev, 0.02));
      setForexData(prev => updateData(prev, 0.0008));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getCurrentPrice = (data) => {
    return data.length > 0 ? data[data.length - 1].price : 0;
  };

  const getPriceChange = (data) => {
    if (data.length < 2) return { change: 0, percentage: 0 };
    const current = data[data.length - 1].price;
    const previous = data[data.length - 2].price;
    const change = current - previous;
    const percentage = ((change / previous) * 100);
    return { change: parseFloat(change.toFixed(4)), percentage: parseFloat(percentage.toFixed(2)) };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: '#23272F',
            p: 2,
            border: '1px solid #2A2F38',
            borderRadius: 2,
            color: '#fff'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Time: {label}
          </Typography>
          <Typography variant="body2" sx={{ color: '#00B386' }}>
            Price: ${payload[0].value}
          </Typography>
          {payload[0].payload.volume && (
            <Typography variant="body2" sx={{ color: '#888' }}>
              Volume: {payload[0].payload.volume.toLocaleString()}
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#0F1419', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#fff', 
            fontWeight: 600,
            fontSize: '1.5rem'
          }}
        >
          Trading Charts
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={isLive ? "LIVE" : "PAUSED"} 
            size="small" 
            sx={{ 
              bgcolor: isLive ? '#00B386' : '#666', 
              color: '#fff', 
              fontWeight: 600,
              animation: isLive ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.7 },
                '100%': { opacity: 1 },
              }
            }} 
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsLive(!isLive)}
            sx={{ 
              borderColor: '#23272F', 
              color: '#fff',
              '&:hover': { borderColor: '#00B386', color: '#00B386' }
            }}
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </Box>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: '#181A20', 
          borderRadius: 3,
          border: '1px solid #23272F',
          overflow: 'hidden'
        }}
      >
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ 
            borderBottom: '1px solid #23272F',
            px: 2,
            '& .MuiTabs-indicator': {
              backgroundColor: '#00B386',
            }
          }}
        >
          <StyledTab label="Cryptocurrency" />
          <StyledTab label="Forex" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel sx={{ color: '#888' }}>Crypto Pair</InputLabel>
                      <Select
                        value={cryptoPair}
                        onChange={(e) => setCryptoPair(e.target.value)}
                        sx={{ 
                          color: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#23272F' },
                          '& .MuiSvgIcon-root': { color: '#888' }
                        }}
                      >
                        {cryptoPairs.map(pair => (
                          <MenuItem key={pair} value={pair}>{pair}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <ButtonGroup size="small">
                      {timeFrames.map(tf => (
                        <TimeButton
                          key={tf}
                          className={timeFrame === tf ? 'active' : ''}
                          onClick={() => setTimeFrame(tf)}
                        >
                          {tf}
                        </TimeButton>
                      ))}
                    </ButtonGroup>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, fontFamily: 'monospace' }}>
                      ${getCurrentPrice(cryptoData).toLocaleString()}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: getPriceChange(cryptoData).change >= 0 ? '#00B386' : '#F44336',
                        fontWeight: 600
                      }}
                    >
                      {getPriceChange(cryptoData).change >= 0 ? '+' : ''}{getPriceChange(cryptoData).change} 
                      ({getPriceChange(cryptoData).percentage}%)
                    </Typography>
                  </Box>
                </Box>

                <StyledCard>
                  <CardContent sx={{ p: 2 }}>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={cryptoData}>
                        <defs>
                          <linearGradient id="cryptoGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00B386" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00B386" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#23272F" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#888" 
                          fontSize={12}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          stroke="#888" 
                          fontSize={12}
                          domain={['dataMin - 100', 'dataMax + 100']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#00B386"
                          strokeWidth={2}
                          fill="url(#cryptoGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel sx={{ color: '#888' }}>Forex Pair</InputLabel>
                      <Select
                        value={forexPair}
                        onChange={(e) => setForexPair(e.target.value)}
                        sx={{ 
                          color: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#23272F' },
                          '& .MuiSvgIcon-root': { color: '#888' }
                        }}
                      >
                        {forexPairs.map(pair => (
                          <MenuItem key={pair} value={pair}>{pair}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <ButtonGroup size="small">
                      {timeFrames.map(tf => (
                        <TimeButton
                          key={tf}
                          className={timeFrame === tf ? 'active' : ''}
                          onClick={() => setTimeFrame(tf)}
                        >
                          {tf}
                        </TimeButton>
                      ))}
                    </ButtonGroup>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, fontFamily: 'monospace' }}>
                      {getCurrentPrice(forexData).toFixed(5)}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: getPriceChange(forexData).change >= 0 ? '#00B386' : '#F44336',
                        fontWeight: 600
                      }}
                    >
                      {getPriceChange(forexData).change >= 0 ? '+' : ''}{getPriceChange(forexData).change} 
                      ({getPriceChange(forexData).percentage}%)
                    </Typography>
                  </Box>
                </Box>

                <StyledCard>
                  <CardContent sx={{ p: 2 }}>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={forexData}>
                        <defs>
                          <linearGradient id="forexGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#23272F" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#888" 
                          fontSize={12}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          stroke="#888" 
                          fontSize={12}
                          domain={['dataMin - 0.001', 'dataMax + 0.001']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#2196F3"
                          strokeWidth={2}
                          fill="url(#forexGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
