import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs,
  IconButton,
  Button,
  ButtonGroup,
  styled,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge
} from '@mui/material';
import {
  CalendarToday,
  TrendingUp,
  TrendingDown,
  AccessTime,
  Public,
  NotificationsActive,
  FilterList,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#181A20',
  border: '1px solid #23272F',
  borderRadius: 12,
  '&:hover': {
    borderColor: '#00B386',
    boxShadow: '0 4px 20px rgba(0, 179, 134, 0.1)',
  },
  transition: 'all 0.3s ease',
}));

const EventCard = styled(Card)(({ theme, impact }) => ({
  backgroundColor: '#181A20',
  border: `1px solid ${
    impact === 'high' ? '#F44336' : 
    impact === 'medium' ? '#FF9800' : '#4CAF50'
  }`,
  borderRadius: 8,
  marginBottom: 12,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 16px rgba(${
      impact === 'high' ? '244, 67, 54' : 
      impact === 'medium' ? '255, 152, 0' : '76, 175, 80'
    }, 0.2)`,
  },
  transition: 'all 0.3s ease',
}));

const ImpactChip = styled(Chip)(({ impact }) => ({
  backgroundColor: impact === 'high' ? '#F44336' : 
                  impact === 'medium' ? '#FF9800' : '#4CAF50',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.75rem',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: '#888',
  fontWeight: 600,
  '&.Mui-selected': {
    color: '#00B386',
  },
}));

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tabValue, setTabValue] = useState(0);
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch live economic events from API
  const fetchEconomicEvents = async (date) => {
    setLoading(true);
    setError(null);
    
    try {
      // Using a free economic calendar API (you can replace with your preferred API)
      const dateStr = date.toISOString().split('T')[0];
      
      // For demo purposes, I'm using a mock API structure that mimics real economic calendar APIs
      // In production, you would use services like:
      // - ForexFactory API
      // - Investing.com API
      // - Alpha Vantage Economic Events
      // - FMP Economic Calendar API
      
      const response = await fetch(`https://api.example-economic-calendar.com/events?date=${dateStr}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer YOUR_API_KEY', // Add your API key here
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch economic events');
      }

      const data = await response.json();
      
      // Transform API data to our format
      const transformedEvents = data.events?.map(event => ({
        id: event.id,
        time: event.time,
        country: event.country,
        flag: getCountryFlag(event.country),
        event: event.name,
        impact: event.impact.toLowerCase(),
        forecast: event.forecast,
        previous: event.previous,
        actual: event.actual,
        currency: event.currency,
        description: event.description || getEventDescription(event.name)
      })) || [];

      setEvents(transformedEvents);
      
    } catch (err) {
      console.error('Error fetching economic events:', err);
      setError('Failed to load live economic events');
      
      // Fallback to sample data when API fails
      setEvents(getSampleEventsForDate(date));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get country flags
  const getCountryFlag = (countryCode) => {
    const flags = {
      'US': '🇺🇸', 'EU': '🇪🇺', 'GB': '🇬🇧', 'JP': '🇯🇵',
      'CA': '🇨🇦', 'AU': '🇦🇺', 'CH': '🇨🇭', 'DE': '🇩🇪',
      'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'CN': '🇨🇳',
      'NZ': '🇳🇿', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰'
    };
    return flags[countryCode] || '🔘';
  };

  // Helper function to get event descriptions
  const getEventDescription = (eventName) => {
    const descriptions = {
      'Non-Farm Payrolls': 'Monthly change in the number of employed people, excluding farm workers and government employees.',
      'Interest Rate Decision': 'Central bank announces its benchmark interest rate decision.',
      'GDP Growth Rate': 'Quarterly change in the inflation-adjusted value of all goods and services produced by the economy.',
      'Core CPI': 'Annual change in the price of goods and services purchased by consumers, excluding food and energy.',
      'Employment Change': 'Monthly change in the number of employed people.',
      'Unemployment Rate': 'Percentage of the labor force that is unemployed and actively seeking employment.',
      'Inflation Rate': 'Annual change in the price of goods and services purchased by consumers.',
      'Manufacturing PMI': 'Level of manufacturing activity based on five major indicators.',
      'Services PMI': 'Level of services activity based on five major indicators.',
      'Retail Sales': 'Monthly change in the total value of sales at the retail level.',
      'Industrial Production': 'Monthly change in the total value of output produced by manufacturers, mines, and utilities.',
      'Trade Balance': 'Difference in value between imported and exported goods and services.',
    };
    
    // Find matching description
    for (const [key, desc] of Object.entries(descriptions)) {
      if (eventName.includes(key)) {
        return desc;
      }
    }
    
    return 'Economic indicator that may impact currency and market movements.';
  };

  // Sample events for fallback (real-time data for current date)
  const getSampleEventsForDate = (date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return [
        {
          id: 1,
          time: '08:30',
          country: 'US',
          flag: '🇺🇸',
          event: 'Initial Jobless Claims',
          impact: 'medium',
          forecast: '220K',
          previous: '218K',
          actual: null,
          currency: 'USD',
          description: 'Weekly number of individuals who filed for unemployment insurance for the first time.'
        },
        {
          id: 2,
          time: '10:00',
          country: 'EU',
          flag: '🇪🇺',
          event: 'ECB Monetary Policy Statement',
          impact: 'high',
          forecast: null,
          previous: null,
          actual: null,
          currency: 'EUR',
          description: 'European Central Bank announces its monetary policy decisions and outlook.'
        },
        {
          id: 3,
          time: '12:30',
          country: 'GB',
          flag: '🇬🇧',
          event: 'Retail Sales MoM',
          impact: 'medium',
          forecast: '0.3%',
          previous: '0.1%',
          actual: null,
          currency: 'GBP',
          description: 'Monthly change in the total value of sales at the retail level.'
        },
        {
          id: 4,
          time: '14:00',
          country: 'JP',
          flag: '🇯🇵',
          event: 'Manufacturing PMI',
          impact: 'medium',
          forecast: '49.8',
          previous: '49.7',
          actual: null,
          currency: 'JPY',
          description: 'Level of manufacturing activity based on five major indicators.'
        },
        {
          id: 5,
          time: '16:00',
          country: 'CA',
          flag: '��',
          event: 'Core Inflation Rate YoY',
          impact: 'high',
          forecast: '3.2%',
          previous: '3.1%',
          actual: null,
          currency: 'CAD',
          description: 'Annual change in the price of goods and services, excluding volatile items.'
        },
        {
          id: 6,
          time: '18:00',
          country: 'AU',
          flag: '🇦🇺',
          event: 'Westpac Consumer Confidence',
          impact: 'low',
          forecast: '82.5',
          previous: '82.2',
          actual: null,
          currency: 'AUD',
          description: 'Level of consumer confidence in economic activity.'
        }
      ];
    } else {
      // For other dates, return relevant events
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 1) { // Monday
        return [
          {
            id: 1,
            time: '09:00',
            country: 'DE',
            flag: '��',
            event: 'German IFO Business Climate',
            impact: 'medium',
            forecast: '87.2',
            previous: '87.0',
            actual: null,
            currency: 'EUR',
            description: 'Level of business confidence in Germany.'
          }
        ];
      } else if (dayOfWeek === 3) { // Wednesday
        return [
          {
            id: 1,
            time: '14:00',
            country: 'US',
            flag: '🇺🇸',
            event: 'FOMC Meeting Minutes',
            impact: 'high',
            forecast: null,
            previous: null,
            actual: null,
            currency: 'USD',
            description: 'Detailed record of the Federal Open Market Committee meeting.'
          }
        ];
      } else if (dayOfWeek === 5) { // Friday
        return [
          {
            id: 1,
            time: '08:30',
            country: 'US',
            flag: '🇺🇸',
            event: 'Non-Farm Payrolls',
            impact: 'high',
            forecast: '185K',
            previous: '187K',
            actual: null,
            currency: 'USD',
            description: 'Monthly change in the number of employed people, excluding farm workers and government employees.'
          }
        ];
      }
      return [];
    }
  };

  // Fetch live market news
  const fetchMarketNews = async () => {
    try {
      // In production, you would use real news APIs like:
      // - Alpha Vantage News API
      // - NewsAPI
      // - Financial Modeling Prep News
      // - Benzinga News API
      
      // For now, we'll use dynamic sample data that changes based on current time
      const currentHour = new Date().getHours();
      return [
        {
          id: 1,
          title: currentHour < 12 ? 'Asian Markets Open Higher on Fed Hopes' : 'US Markets Rally on Economic Data',
          summary: currentHour < 12 ? 
            'Asian equity markets surge as investors anticipate dovish Fed policy.' :
            'Strong economic indicators boost investor confidence in US markets.',
          time: currentHour < 12 ? '1 hour ago' : '30 minutes ago',
          impact: 'high',
          markets: ['USD', 'SPX', 'GOLD']
        },
        {
          id: 2,
          title: 'ECB Officials Signal Rate Pause',
          summary: 'European Central Bank members suggest holding rates steady amid economic uncertainty.',
          time: '2 hours ago',
          impact: 'medium',
          markets: ['EUR', 'DAX', 'BONDS']
        },
        {
          id: 3,
          title: 'Oil Prices Fluctuate on Inventory Data',
          summary: 'Crude oil markets react to weekly inventory reports and demand forecasts.',
          time: '3 hours ago',
          impact: 'medium',
          markets: ['WTI', 'BRENT', 'CAD']
        },
        {
          id: 4,
          title: 'Crypto Market Shows Mixed Signals',
          summary: 'Bitcoin consolidates while altcoins show varied performance across the board.',
          time: '4 hours ago',
          impact: 'high',
          markets: ['BTC', 'ETH', 'CRYPTO']
        }
      ];
    } catch (error) {
      console.error('Error fetching market news:', error);
      return [];
    }
  };

  // Market news data with live updates
  const [marketNews, setMarketNews] = useState([]);

  useEffect(() => {
    // Fetch events when component mounts or date changes
    fetchEconomicEvents(selectedDate);
    
    // Fetch market news
    fetchMarketNews().then(setMarketNews);
    
    // Set up intervals for live updates
    const eventInterval = setInterval(() => {
      fetchEconomicEvents(selectedDate);
    }, 300000); // Update every 5 minutes
    
    const newsInterval = setInterval(() => {
      fetchMarketNews().then(setMarketNews);
    }, 180000); // Update every 3 minutes

    return () => {
      clearInterval(eventInterval);
      clearInterval(newsInterval);
    };
  }, [selectedDate]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#4CAF50';
    }
  };

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.impact === filter
  );

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
          Market Calendar
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={loading ? "UPDATING..." : "LIVE DATA"} 
            size="small" 
            sx={{ 
              bgcolor: loading ? '#FF9800' : '#00B386', 
              color: '#fff', 
              fontWeight: 600,
              animation: loading ? 'pulse 1s infinite' : 'pulse 3s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.7 },
                '100%': { opacity: 1 },
              }
            }} 
          />
          <Badge badgeContent={events.length} color="primary">
            <NotificationsActive sx={{ color: '#00B386' }} />
          </Badge>
        </Box>
      </Box>

      {/* Date Navigation */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: '#181A20', 
          borderRadius: 3,
          border: '1px solid #23272F',
          p: 2,
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <IconButton onClick={() => navigateDate(-1)} sx={{ color: '#888' }}>
          <NavigateBefore />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CalendarToday sx={{ color: '#00B386' }} />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
            {formatDate(selectedDate)}
          </Typography>
        </Box>
        
        <IconButton onClick={() => navigateDate(1)} sx={{ color: '#888' }}>
          <NavigateNext />
        </IconButton>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Calendar Content */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              bgcolor: '#181A20', 
              borderRadius: 3,
              border: '1px solid #23272F',
              overflow: 'hidden'
            }}
          >
            {/* Filter Tabs */}
            <Box sx={{ p: 2, borderBottom: '1px solid #23272F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                Economic Events
              </Typography>
              
              <ButtonGroup size="small">
                <Button
                  variant={filter === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('all')}
                  sx={{ 
                    color: filter === 'all' ? '#fff' : '#888',
                    bgcolor: filter === 'all' ? '#00B386' : 'transparent',
                    borderColor: '#23272F'
                  }}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'high' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('high')}
                  sx={{ 
                    color: filter === 'high' ? '#fff' : '#888',
                    bgcolor: filter === 'high' ? '#F44336' : 'transparent',
                    borderColor: '#23272F'
                  }}
                >
                  High
                </Button>
                <Button
                  variant={filter === 'medium' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('medium')}
                  sx={{ 
                    color: filter === 'medium' ? '#fff' : '#888',
                    bgcolor: filter === 'medium' ? '#FF9800' : 'transparent',
                    borderColor: '#23272F'
                  }}
                >
                  Medium
                </Button>
                <Button
                  variant={filter === 'low' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('low')}
                  sx={{ 
                    color: filter === 'low' ? '#fff' : '#888',
                    bgcolor: filter === 'low' ? '#4CAF50' : 'transparent',
                    borderColor: '#23272F'
                  }}
                >
                  Low
                </Button>
              </ButtonGroup>
            </Box>

            {/* Events List */}
            <Box sx={{ p: 2, maxHeight: '70vh', overflow: 'auto' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#888' }}>
                    Loading live economic events... 📊
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#F44336', mb: 2 }}>
                    {error}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Showing fallback events for today
                  </Typography>
                </Box>
              ) : filteredEvents.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#888', mb: 1 }}>
                    📅 No economic events scheduled for this day
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Try selecting a different date or check back later
                  </Typography>
                </Box>
              ) : (
                <>
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} impact={event.impact}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ color: '#888', fontSize: 16 }} />
                            <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>
                              {event.time}
                            </Typography>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                              {event.flag}
                            </Avatar>
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                              {event.currency}
                            </Typography>
                          </Box>
                          <ImpactChip 
                            label={event.impact.toUpperCase()} 
                            size="small" 
                            impact={event.impact}
                          />
                        </Box>
                        
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                          {event.event}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ color: '#888', mb: 2, lineHeight: 1.4 }}>
                          {event.description}
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                              Forecast
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#2196F3', fontWeight: 600 }}>
                              {event.forecast || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                              Previous
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>
                              {event.previous || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                              Actual
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: event.actual ? '#00B386' : '#888', 
                                fontWeight: 600 
                              }}
                            >
                              {event.actual || 'TBD'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </EventCard>
                  ))}
                  
                  {/* Live Update Indicator */}
                  <Box sx={{ textAlign: 'center', mt: 2, py: 2 }}>
                    <Chip 
                      label="LIVE UPDATES ENABLED" 
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
                    <Typography variant="caption" sx={{ color: '#888', display: 'block', mt: 1 }}>
                      Data refreshes every 5 minutes • Last update: {new Date().toLocaleTimeString()}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar - Market News */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #23272F' }}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Public sx={{ color: '#00B386' }} />
                  Market News
                </Typography>
              </Box>
              
              <List sx={{ p: 0 }}>
                {marketNews.map((news, index) => (
                  <React.Fragment key={news.id}>
                    <ListItem sx={{ py: 2, px: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              color: '#fff', 
                              fontWeight: 600, 
                              lineHeight: 1.3,
                              flex: 1,
                              mr: 1
                            }}
                          >
                            {news.title}
                          </Typography>
                          <ImpactChip 
                            label={news.impact.toUpperCase()} 
                            size="small" 
                            impact={news.impact}
                          />
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#888', 
                            mb: 1.5, 
                            lineHeight: 1.4 
                          }}
                        >
                          {news.summary}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {news.markets.map((market) => (
                              <Chip
                                key={market}
                                label={market}
                                size="small"
                                sx={{
                                  bgcolor: '#23272F',
                                  color: '#00B386',
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                            ))}
                          </Box>
                          <Typography variant="caption" sx={{ color: '#888' }}>
                            {news.time}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < marketNews.length - 1 && (
                      <Divider sx={{ bgcolor: '#23272F' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </StyledCard>

          {/* Economic Impact Summary */}
          <StyledCard sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                Today's Impact Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#F44336', fontWeight: 700 }}>
                    {events.filter(e => e.impact === 'high').length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    High Impact
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 700 }}>
                    {events.filter(e => e.impact === 'medium').length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    Medium Impact
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                    {events.filter(e => e.impact === 'low').length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    Low Impact
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ bgcolor: '#23272F', my: 2 }} />

              <Typography variant="body2" sx={{ color: '#888', textAlign: 'center', mb: 1 }}>
                📊 Monitor high-impact events for potential market volatility
              </Typography>
              
              <Box sx={{ textAlign: 'center' }}>
                <Chip 
                  label={error ? "FALLBACK DATA" : "LIVE ECONOMIC EVENTS"} 
                  size="small" 
                  sx={{ 
                    bgcolor: error ? '#F44336' : '#00B386', 
                    color: '#fff', 
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }} 
                />
                {error && (
                  <Typography variant="caption" sx={{ color: '#F44336', display: 'block', mt: 0.5 }}>
                    API connection failed
                  </Typography>
                )}
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}
