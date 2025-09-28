import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  InputAdornment,
  CardMedia,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Badge,
  Tooltip,
  Skeleton,
  Fade,
  Collapse
} from '@mui/material';
import {
  Person,
  Email,
  Settings,
  VerifiedUser,
  TrendingUp,
  TrendingDown,
  Article,
  Schedule,
  Visibility,
  Share,
  Bookmark,
  BookmarkBorder,
  Comment,
  ThumbUp,
  Language,
  Search,
  FilterList,
  Refresh,
  Newspaper,
  Business,
  AccountBalance,
  ShowChart,
  CurrencyBitcoin,
  Euro,
  AttachMoney,
  PieChart,
  BarChart,
  Timeline,
  Public,
  Info,
  Warning,
  CheckCircle,
  Error,
  AccessTime,
  CalendarToday,
  LocationOn,
  OpenInNew,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

// Mock News Data - In real app, this would come from API/Admin system
const mockNews = [
  {
    id: 1,
    title: "Bitcoin Surges Past $65,000 as Institutional Adoption Accelerates",
    summary: "Major corporations and investment funds continue to add Bitcoin to their balance sheets, driving unprecedented institutional demand.",
    content: "Bitcoin reached a new milestone today as it surged past the $65,000 mark, driven by continued institutional adoption and growing acceptance of cryptocurrency as a legitimate asset class. Major corporations including Tesla, MicroStrategy, and Square have led the charge in adding Bitcoin to their corporate treasuries, with many citing it as a hedge against inflation and currency debasement.",
    category: "Cryptocurrency",
    author: "Sarah Johnson",
    publishedAt: "2024-09-28T10:30:00Z",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400",
    source: "Crypto Weekly",
    tags: ["Bitcoin", "Institutional", "Adoption"],
    isBreaking: true,
    views: 15420,
    likes: 892,
    comments: 234,
    sentiment: "bullish",
    readTime: "3 min read"
  },
  {
    id: 2,
    title: "Federal Reserve Hints at Interest Rate Cuts in 2024",
    summary: "Fed Chairman signals potential monetary policy shifts as inflation shows signs of cooling.",
    content: "The Federal Reserve has provided stronger hints that interest rate cuts may be on the horizon for 2024, as recent economic data shows inflation continuing to moderate while employment remains robust. This shift in monetary policy outlook has significant implications for both traditional markets and digital assets.",
    category: "Economic Policy",
    author: "Michael Chen",
    publishedAt: "2024-09-28T08:15:00Z",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400",
    source: "Financial Times",
    tags: ["Federal Reserve", "Interest Rates", "Monetary Policy"],
    isBreaking: false,
    views: 12380,
    likes: 567,
    comments: 123,
    sentiment: "bullish",
    readTime: "5 min read"
  },
  {
    id: 3,
    title: "Ethereum 2.0 Staking Rewards Reach All-Time High",
    summary: "ETH stakers are experiencing unprecedented returns as network activity and fee generation soar.",
    content: "Ethereum's proof-of-stake consensus mechanism is delivering exceptional rewards to validators, with annual percentage yields reaching new highs. The increased network activity, driven by DeFi protocols and NFT marketplaces, has resulted in higher fee generation and subsequently better staking rewards for ETH holders.",
    category: "DeFi",
    author: "Emma Rodriguez",
    publishedAt: "2024-09-27T16:45:00Z",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400",
    source: "DeFi Pulse",
    tags: ["Ethereum", "Staking", "DeFi"],
    isBreaking: false,
    views: 9840,
    likes: 445,
    comments: 87,
    sentiment: "bullish",
    readTime: "4 min read"
  },
  {
    id: 4,
    title: "Global Stock Markets Rally on Positive Economic Data",
    summary: "Major indices post significant gains as GDP growth exceeds expectations across developed markets.",
    content: "Stock markets worldwide posted their best performance in months as economic indicators showed stronger-than-expected growth across major economies. The S&P 500, FTSE 100, and Nikkei 225 all closed higher, with technology and financial sectors leading the rally.",
    category: "Stock Markets",
    author: "David Thompson",
    publishedAt: "2024-09-27T14:20:00Z",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400",
    source: "Market Watch",
    tags: ["Stocks", "GDP", "Economic Growth"],
    isBreaking: false,
    views: 8560,
    likes: 321,
    comments: 56,
    sentiment: "bullish",
    readTime: "6 min read"
  },
  {
    id: 5,
    title: "Oil Prices Fluctuate Amid Middle East Tensions",
    summary: "Crude oil markets remain volatile as geopolitical concerns offset supply increase announcements.",
    content: "Oil prices experienced significant volatility this week as ongoing geopolitical tensions in the Middle East created uncertainty about global supply chains. While OPEC announced plans to increase production, market participants remain cautious about potential supply disruptions.",
    category: "Commodities",
    author: "Rachel Kim",
    publishedAt: "2024-09-27T11:30:00Z",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400",
    source: "Energy Today",
    tags: ["Oil", "OPEC", "Commodities"],
    isBreaking: false,
    views: 7230,
    likes: 178,
    comments: 34,
    sentiment: "neutral",
    readTime: "4 min read"
  },
  {
    id: 6,
    title: "Central Bank Digital Currencies Gain Momentum Globally",
    summary: "Multiple countries accelerate CBDC development as digital payment adoption surges worldwide.",
    content: "Central banks around the world are accelerating their development of digital currencies, with pilot programs launching in several major economies. The push towards CBDCs represents a significant shift in how monetary policy may be implemented in the digital age.",
    category: "Digital Currency",
    author: "James Wilson",
    publishedAt: "2024-09-26T13:45:00Z",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400",
    source: "Central Banking",
    tags: ["CBDC", "Digital Currency", "Central Banks"],
    isBreaking: false,
    views: 6890,
    likes: 298,
    comments: 67,
    sentiment: "neutral",
    readTime: "7 min read"
  }
];

// Market categories for filtering
const newsCategories = [
  { value: 'all', label: 'All News', icon: <Newspaper /> },
  { value: 'Cryptocurrency', label: 'Cryptocurrency', icon: <CurrencyBitcoin /> },
  { value: 'Stock Markets', label: 'Stock Markets', icon: <ShowChart /> },
  { value: 'Economic Policy', label: 'Economic Policy', icon: <AccountBalance /> },
  { value: 'DeFi', label: 'DeFi', icon: <PieChart /> },
  { value: 'Commodities', label: 'Commodities', icon: <BarChart /> },
  { value: 'Digital Currency', label: 'Digital Currency', icon: <Euro /> }
];

export default function News() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookmarkedNews, setBookmarkedNews] = useState(new Set());
  const [likedNews, setLikedNews] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());

  // Simulate loading state
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleReadMore = (newsItem) => {
    setSelectedNews(newsItem);
    setDialogOpen(true);
  };

  const handleBookmark = (newsId) => {
    setBookmarkedNews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const handleLike = (newsId) => {
    setLikedNews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const toggleExpanded = (newsId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'success.main';
      case 'bearish': return 'error.main';
      case 'neutral': return 'warning.main';
      default: return 'primary.main';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp />;
      case 'bearish': return <TrendingDown />;
      case 'neutral': return <Timeline />;
      default: return <Info />;
    }
  };

  // Filter news based on category and search
  const filteredNews = mockNews.filter(news => {
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
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
              <Newspaper sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem' } }} />
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
                Market News & Analysis
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
                Stay Updated with <span style={{ color: theme.palette.primary.main }}>Live Financial News</span>
              </Typography>
            </Box>
          </Box>
          
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
            <Badge badgeContent="LIVE" color="error">
              <Chip 
                icon={<Public />} 
                label="Live Feed" 
                color="success" 
                variant="outlined" 
                size="small"
                sx={{ 
                  height: { xs: 28, sm: 32 },
                  fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }
                }}
              />
            </Badge>
            <Button 
              variant="contained" 
              startIcon={<Refresh />}
              onClick={() => setLoading(true)}
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
              Refresh
            </Button>
          </Stack>
        </Box>

        {/* Breaking News Banner */}
        {mockNews.filter(news => news.isBreaking).length > 0 && (
          <Alert 
            severity="error" 
            icon={<Warning />}
            sx={{ 
              mb: 3, 
              bgcolor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: 'error.main'
              }
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              🚨 BREAKING: {mockNews.find(news => news.isBreaking)?.title}
            </Typography>
          </Alert>
        )}

        {/* Categories and Search */}
        <Card sx={{
          bgcolor: '#232742',
          color: '#fff',
          borderRadius: 3,
          boxShadow: 6,
          border: '1px solid rgba(255,255,255,0.1)',
          mb: 3
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search news, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  sx: { color: '#fff' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                  }
                }}
              />
            </Box>

            {/* Category Chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {newsCategories.map((category) => (
                <Chip
                  key={category.value}
                  icon={category.icon}
                  label={category.label}
                  onClick={() => handleCategoryChange(category.value)}
                  color={selectedCategory === category.value ? 'primary' : 'default'}
                  variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                  sx={{
                    color: selectedCategory === category.value ? '#fff' : 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: selectedCategory === category.value ? 'primary.dark' : 'rgba(255,255,255,0.1)'
                    }
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* News Grid */}
        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card sx={{ bgcolor: '#232742', height: 400 }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            // News Cards
            filteredNews.map((news) => (
              <Grid item xs={12} sm={6} lg={4} key={news.id}>
                <Fade in={!loading} timeout={500}>
                  <Card sx={{
                    bgcolor: '#232742',
                    color: '#fff',
                    borderRadius: 3,
                    boxShadow: 6,
                    border: '1px solid rgba(255,255,255,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8
                    }
                  }}>
                    {/* News Image */}
                    <CardMedia
                      component="img"
                      height={200}
                      image={news.image}
                      alt={news.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    
                    {/* Breaking Badge */}
                    {news.isBreaking && (
                      <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                        <Chip
                          label="BREAKING"
                          color="error"
                          size="small"
                          sx={{ 
                            fontWeight: 'bold',
                            animation: 'pulse 2s infinite'
                          }}
                        />
                      </Box>
                    )}

                    {/* Sentiment Badge */}
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                      <Chip
                        icon={getSentimentIcon(news.sentiment)}
                        label={news.sentiment.toUpperCase()}
                        size="small"
                        sx={{ 
                          bgcolor: getSentimentColor(news.sentiment),
                          color: '#fff',
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Category and Time */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip
                          label={news.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 12 }} />
                          {formatDate(news.publishedAt)}
                        </Typography>
                      </Box>

                      {/* Title */}
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 'bold',
                          lineHeight: 1.3,
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {news.title}
                      </Typography>

                      {/* Summary */}
                      <Typography 
                        variant="body2" 
                        color="rgba(255,255,255,0.8)"
                        sx={{ 
                          flexGrow: 1,
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: expandedCards.has(news.id) ? 'none' : 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {news.summary}
                      </Typography>

                      {/* Tags */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {news.tags.slice(0, 3).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              fontSize: '0.7rem',
                              height: 20,
                              color: 'rgba(255,255,255,0.7)',
                              borderColor: 'rgba(255,255,255,0.3)'
                            }}
                          />
                        ))}
                      </Box>

                      {/* Author and Source */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                            {news.author.charAt(0)}
                          </Avatar>
                          <Typography variant="caption" color="rgba(255,255,255,0.8)">
                            {news.author}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="primary.main">
                          {news.source}
                        </Typography>
                      </Box>

                      {/* Stats */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                              {news.views.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ThumbUp sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                              {news.likes}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Comment sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                              {news.comments}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="primary.main" fontWeight="bold">
                          {news.readTime}
                        </Typography>
                      </Box>
                    </CardContent>

                    {/* Actions */}
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Box>
                        <IconButton
                          onClick={() => handleLike(news.id)}
                          sx={{ color: likedNews.has(news.id) ? 'primary.main' : 'rgba(255,255,255,0.6)' }}
                        >
                          <ThumbUp />
                        </IconButton>
                        <IconButton
                          onClick={() => handleBookmark(news.id)}
                          sx={{ color: bookmarkedNews.has(news.id) ? 'warning.main' : 'rgba(255,255,255,0.6)' }}
                        >
                          {bookmarkedNews.has(news.id) ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                        <IconButton sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          <Share />
                        </IconButton>
                      </Box>
                      <Button
                        onClick={() => handleReadMore(news)}
                        color="primary"
                        endIcon={<OpenInNew />}
                        sx={{ textTransform: 'none' }}
                      >
                        Read Full Story
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))
          )}
        </Grid>

        {filteredNews.length === 0 && !loading && (
          <Paper sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: '#232742',
            color: '#fff',
            borderRadius: 3
          }}>
            <Article sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No news found
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.6)">
              Try adjusting your search or category filters
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Full Article Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#232742',
            color: 'white',
            maxHeight: '90vh'
          }
        }}
      >
        {selectedNews && (
          <>
            <DialogTitle sx={{ 
              color: 'primary.main', 
              fontWeight: 'bold',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              pb: 2
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, pr: 2 }}>
                  {selectedNews.isBreaking && (
                    <Chip
                      label="BREAKING NEWS"
                      color="error"
                      size="small"
                      sx={{ mb: 1, fontWeight: 'bold' }}
                    />
                  )}
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {selectedNews.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.8)">
                      By {selectedNews.author} • {selectedNews.source}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)">
                      {formatDate(selectedNews.publishedAt)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setDialogOpen(false)} sx={{ color: '#fff' }}>
                  <ExpandLess />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height={300}
                  image={selectedNews.image}
                  alt={selectedNews.title}
                  sx={{ objectFit: 'cover' }}
                />
                <Chip
                  icon={getSentimentIcon(selectedNews.sentiment)}
                  label={`Market Sentiment: ${selectedNews.sentiment.toUpperCase()}`}
                  sx={{ 
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    bgcolor: getSentimentColor(selectedNews.sentiment),
                    color: '#fff',
                    fontWeight: 600
                  }}
                />
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Summary
                </Typography>
                <Typography variant="body1" paragraph color="rgba(255,255,255,0.9)">
                  {selectedNews.summary}
                </Typography>
                
                <Typography variant="h6" gutterBottom color="primary.main" sx={{ mt: 3 }}>
                  Full Article
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>
                  {selectedNews.content}
                </Typography>

                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">
                    Tags: {selectedNews.tags.join(' • ')}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 3 }}>
              <Button onClick={() => setDialogOpen(false)} variant="outlined" color="inherit">
                Close
              </Button>
              <Button variant="contained" color="primary" startIcon={<Share />}>
                Share Article
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
