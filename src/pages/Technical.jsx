import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Avatar,
  styled
} from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#23272F',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.875rem',
  border: '1px solid #2A2F38',
  padding: '12px 16px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#181A20',
  '&:nth-of-type(even)': {
    backgroundColor: '#1E2228',
  },
  '&:hover': {
    backgroundColor: '#252A32',
  },
  '& td': {
    border: '1px solid #2A2F38',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 500,
    padding: '10px 16px',
  }
}));

const CurrencyAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  fontSize: '0.75rem',
  fontWeight: 600,
  marginRight: '8px',
}));

export default function Technical() {
  const [rates, setRates] = useState({});

  // Currency data with flags and colors
  const currencies = [
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', color: '#1976D2' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', color: '#4CAF50' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', color: '#F44336' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', color: '#9C27B0' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', color: '#FF5722' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', color: '#795548' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', color: '#607D8B' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿', color: '#3F51B5' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', color: '#E91E63' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷', color: '#009688' },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪', color: '#FF9800' },
    { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴', color: '#2196F3' },
    { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰', color: '#8BC34A' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦', color: '#FFC107' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺', color: '#673AB7' },
  ];

  // Mock exchange rates - in real app, this would come from API
  const mockRates = {
    'EUR-USD': 1.17005, 'EUR-JPY': 174.909, 'EUR-GBP': 0.87305, 'EUR-CHF': 0.933490, 'EUR-AUD': 1.78665, 'EUR-CAD': 1.63110, 'EUR-NZD': 2.026350, 'EUR-CNY': 8.3451, 'EUR-TRY': 48.642200, 'EUR-SEK': 11.006620, 'EUR-NOK': 11.672200, 'EUR-DKK': 7.463450, 'EUR-ZAR': 20.265200, 'EUR-RUB': 97.53,
    'USD-EUR': 0.8545, 'USD-JPY': 149.454, 'USD-GBP': 0.74629, 'USD-CHF': 0.79754, 'USD-AUD': 1.5271, 'USD-CAD': 1.39420, 'USD-NZD': 1.7320, 'USD-CNY': 7.1323, 'USD-TRY': 41.535500, 'USD-SEK': 9.39460, 'USD-NOK': 9.96020, 'USD-DKK': 6.376600, 'USD-ZAR': 17.320000, 'USD-RUB': 83.25,
    'JPY-EUR': 0.0057170, 'JPY-USD': 0.006687, 'JPY-GBP': 0.004987, 'JPY-CHF': 0.005335, 'JPY-AUD': 0.010213, 'JPY-CAD': 0.009324, 'JPY-NZD': 0.011585, 'JPY-CNY': 0.04766, 'JPY-TRY': 0.27806, 'JPY-SEK': 0.06254, 'JPY-NOK': 0.06670, 'JPY-DKK': 0.042652, 'JPY-ZAR': 0.11584, 'JPY-RUB': 0.553,
    'GBP-EUR': 1.1450, 'GBP-USD': 1.3399, 'GBP-JPY': 200.337, 'GBP-CHF': 1.069260, 'GBP-AUD': 2.046830, 'GBP-CAD': 1.86850, 'GBP-NZD': 2.321010, 'GBP-CNY': 9.5599, 'GBP-TRY': 55.7143, 'GBP-SEK': 12.6051, 'GBP-NOK': 13.3705, 'GBP-DKK': 8.5488, 'GBP-ZAR': 23.18610, 'GBP-RUB': 111.7,
    'CHF-EUR': 1.0704, 'CHF-USD': 1.2525, 'CHF-JPY': 187.291, 'CHF-GBP': 0.9345, 'CHF-AUD': 1.9132, 'CHF-CAD': 1.7462, 'CHF-NZD': 2.1698, 'CHF-CNY': 8.9366, 'CHF-TRY': 52.0858, 'CHF-SEK': 11.7876, 'CHF-NOK': 12.5003, 'CHF-DKK': 7.9918, 'CHF-ZAR': 21.7037, 'CHF-RUB': 104.4,
    // Add more rates as needed...
  };

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      const updatedRates = { ...mockRates };
      // Add small random fluctuations to simulate live rates
      Object.keys(updatedRates).forEach(pair => {
        const variation = (Math.random() - 0.5) * 0.002; // ±0.1% variation
        updatedRates[pair] = parseFloat((updatedRates[pair] * (1 + variation)).toFixed(6));
      });
      setRates(updatedRates);
    }, 3000); // Update every 3 seconds

    // Initial load
    setRates(mockRates);

    return () => clearInterval(interval);
  }, []);

  const formatRate = (rate) => {
    if (!rate) return '-';
    if (rate < 0.1) return rate.toFixed(6);
    if (rate < 1) return rate.toFixed(5);
    if (rate < 10) return rate.toFixed(4);
    if (rate < 100) return rate.toFixed(3);
    return rate.toFixed(2);
  };

  const getCurrencyInfo = (code) => {
    return currencies.find(c => c.code === code) || { code, flag: '🔘', color: '#666' };
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#0F1419', minHeight: '100vh' }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3, 
          color: '#fff', 
          fontWeight: 600,
          fontSize: '1.5rem'
        }}
      >
        Technical Analysis
      </Typography>
      
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: '#181A20', 
          borderRadius: 3,
          border: '1px solid #23272F',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, bgcolor: '#23272F', borderBottom: '1px solid #2A2F38' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#fff', 
              fontWeight: 600,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            📊 Market Cross Rates
            <Chip 
              label="LIVE" 
              size="small" 
              sx={{ 
                bgcolor: '#00B386', 
                color: '#fff', 
                fontWeight: 600,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                  '100%': { opacity: 1 },
                }
              }} 
            />
          </Typography>
        </Box>
        
        <TableContainer sx={{ maxHeight: '80vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ minWidth: 100, position: 'sticky', left: 0, zIndex: 2 }}>
                  Currency
                </StyledTableCell>
                {currencies.map((currency) => (
                  <StyledTableCell key={currency.code} align="center" sx={{ minWidth: 80 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <span style={{ fontSize: '1rem' }}>{currency.flag}</span>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {currency.code}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currencies.map((baseCurrency) => (
                <StyledTableRow key={baseCurrency.code}>
                  <TableCell 
                    sx={{ 
                      position: 'sticky', 
                      left: 0, 
                      bgcolor: '#23272F !important',
                      zIndex: 1,
                      minWidth: 100
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>
                        {baseCurrency.flag}
                      </span>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                        {baseCurrency.code}
                      </Typography>
                    </Box>
                  </TableCell>
                  {currencies.map((quoteCurrency) => (
                    <TableCell key={`${baseCurrency.code}-${quoteCurrency.code}`} align="center">
                      {baseCurrency.code === quoteCurrency.code ? (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666', 
                            fontWeight: 600,
                            bgcolor: '#2A2F38',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          -
                        </Typography>
                      ) : (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: rates[`${baseCurrency.code}-${quoteCurrency.code}`] ? '#00B386' : '#fff',
                            fontWeight: 600,
                            fontFamily: 'monospace'
                          }}
                        >
                          {formatRate(rates[`${baseCurrency.code}-${quoteCurrency.code}`])}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ p: 2, bgcolor: '#23272F', borderTop: '1px solid #2A2F38' }}>
          <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: 1 }}>
            🔄 Last updated: {new Date().toLocaleTimeString()} • Data updates every 3 seconds
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
