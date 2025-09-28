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

  // Mock economic events data
  const mockEvents = [
    {
      id: 1,
      time: '08:30',
      country: 'US',
      flag: '🇺🇸',
      event: 'Non-Farm Payrolls',
      impact: 'high',
      forecast: '185K',
      previous: '187K',
      actual: '192K',
      currency: 'USD',
      description: 'Monthly change in the number of employed people, excluding farm workers and government employees.'
    },
    {
      id: 2,
      time: '10:00',
      country: 'EU',
      flag: '🇪🇺',
      event: 'ECB Interest Rate Decision',
      impact: 'high',
      forecast: '4.50%',
      previous: '4.50%',
      actual: null,
      currency: 'EUR',
      description: 'European Central Bank announces its benchmark interest rate decision.'
    },
    {
      id: 3,
      time: '12:30',
      country: 'GB',
      flag: '🇬🇧',
      event: 'GDP Growth Rate QoQ',
      impact: 'medium',
      forecast: '0.2%',
      previous: '0.1%',
      actual: '0.3%',
      currency: 'GBP',
      description: 'Quarterly change in the inflation-adjusted value of all goods and services produced by the economy.'
    },
    {
      id: 4,
      time: '14:00',
      country: 'JP',
      flag: '🇯🇵',
      event: 'Core CPI YoY',
      impact: 'medium',
      forecast: '2.1%',
      previous: '2.0%',
      actual: null,
      currency: 'JPY',
      description: 'Annual change in the price of goods and services purchased by consumers, excluding food and energy.'
    },
    {
      id: 5,
      time: '16:00',
      country: 'CA',
      flag: '🇨🇦',
      event: 'Employment Change',
      impact: 'medium',
      forecast: '25K',
      previous: '22K',
      actual: null,
      currency: 'CAD',
      description: 'Monthly change in the number of employed people.'
    },
    {
      id: 6,
      time: '18:00',
      country: 'AU',
      flag: '🇦🇺',
      event: 'RBA Cash Rate',
      impact: 'high',
      forecast: '4.35%',
      previous: '4.35%',
      actual: null,
      currency: 'AUD',
      description: 'Reserve Bank of Australia announces its benchmark interest rate.'
    }
  ];

  // Market news data
  const marketNews = [
    {
      id: 1,
      title: 'Federal Reserve Signals Potential Rate Cut',
      summary: 'Fed officials hint at monetary policy easing amid cooling inflation data.',
      time: '2 hours ago',
      impact: 'high',
      markets: ['USD', 'SPX', 'GOLD']
    },
    {
      id: 2,
      title: 'ECB Maintains Hawkish Stance',
      summary: 'European Central Bank emphasizes commitment to fighting inflation.',
      time: '4 hours ago',
      impact: 'medium',
      markets: ['EUR', 'DAX', 'BONDS']
    },
    {
      id: 3,
      title: 'Oil Prices Surge on Supply Concerns',
      summary: 'Crude oil jumps 3% as geopolitical tensions affect supply chains.',
      time: '6 hours ago',
      impact: 'medium',
      markets: ['WTI', 'BRENT', 'CAD']
    },
    {
      id: 4,
      title: 'Bitcoin Breaks $65,000 Resistance',
      summary: 'Cryptocurrency markets rally as institutional adoption increases.',
      time: '8 hours ago',
      impact: 'high',
      markets: ['BTC', 'ETH', 'CRYPTO']
    }
  ];

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

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
                          {event.forecast}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                          Previous
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>
                          {event.previous}
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

              <Typography variant="body2" sx={{ color: '#888', textAlign: 'center' }}>
                📊 Monitor high-impact events for potential market volatility
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}
