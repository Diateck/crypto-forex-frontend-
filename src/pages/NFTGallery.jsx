import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Avatar,
  Stack,
  useTheme,
  Chip,
  Container,
  Tab,
  Tabs,
  Paper,
  IconButton,
  Badge,
  Divider
} from '@mui/material';
import {
  Person,
  Email,
  Settings,
  VerifiedUser,
  FavoriteOutlined,
  Favorite,
  TrendingUp,
  Star,
  Visibility,
  ShoppingCart,
  AccountBalanceWallet,
  Timer,
  LocalFireDepartment
} from '@mui/icons-material';

// Trending NFT Collections Data
const trendingNFTs = [
  {
    id: 1,
    name: "Crypto Punks #7804",
    collection: "CryptoPunks",
    price: "420.69",
    currency: "ETH",
    image: "https://images.unsplash.com/photo-1634704784915-aacf363b021f?w=400&h=400&fit=crop&crop=center",
    creator: "LarvaLabs",
    views: "12.5k",
    likes: 890,
    rarity: "Legendary",
    timeLeft: "2d 14h 23m"
  },
  {
    id: 2,
    name: "Bored Ape #3749",
    collection: "Bored Ape Yacht Club",
    price: "85.2",
    currency: "ETH",
    image: "https://images.unsplash.com/photo-1617791160588-241658c0f566?w=400&h=400&fit=crop&crop=center",
    creator: "Yuga Labs",
    views: "8.7k",
    likes: 654,
    rarity: "Rare",
    timeLeft: "1d 8h 45m"
  },
  {
    id: 3,
    name: "Azuki #9999",
    collection: "Azuki",
    price: "12.8",
    currency: "ETH",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&crop=center",
    creator: "Chiru Labs",
    views: "6.2k",
    likes: 432,
    rarity: "Epic",
    timeLeft: "5d 2h 17m"
  },
  {
    id: 4,
    name: "Moonbird #1337",
    collection: "Moonbirds",
    price: "18.5",
    currency: "ETH",
    image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=400&fit=crop&crop=center",
    creator: "PROOF Collective",
    views: "4.8k",
    likes: 321,
    rarity: "Rare",
    timeLeft: "3d 19h 8m"
  },
  {
    id: 5,
    name: "Doodle #6420",
    collection: "Doodles",
    price: "7.3",
    currency: "ETH",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop&crop=center",
    creator: "Doodles LLC",
    views: "3.1k",
    likes: 245,
    rarity: "Common",
    timeLeft: "6d 5h 42m"
  },
  {
    id: 6,
    name: "Clone X #4200",
    collection: "Clone X",
    price: "15.7",
    currency: "ETH",
    image: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=400&fit=crop&crop=center",
    creator: "RTFKT Studios",
    views: "5.9k",
    likes: 387,
    rarity: "Epic",
    timeLeft: "4d 11h 29m"
  },
  {
    id: 7,
    name: "Mutant Ape #8888",
    collection: "Mutant Ape Yacht Club",
    price: "24.6",
    currency: "ETH",
    image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=400&fit=crop&crop=center",
    creator: "Yuga Labs",
    views: "7.4k",
    likes: 512,
    rarity: "Legendary",
    timeLeft: "2d 7h 15m"
  },
  {
    id: 8,
    name: "Art Blocks #156",
    collection: "Art Blocks Curated",
    price: "9.8",
    currency: "ETH",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
    creator: "Art Blocks",
    views: "2.7k",
    likes: 189,
    rarity: "Rare",
    timeLeft: "8d 16h 33m"
  }
];

const topCollections = [
  { name: "CryptoPunks", volume: "2,847", change: "+12.5%" },
  { name: "Bored Ape Yacht Club", volume: "1,923", change: "+8.7%" },
  { name: "Azuki", volume: "1,456", change: "+15.2%" },
  { name: "Moonbirds", volume: "892", change: "-3.1%" },
  { name: "Doodles", volume: "674", change: "+5.8%" }
];

export default function NFTGallery() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [likedNFTs, setLikedNFTs] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleLike = (nftId) => {
    const newLikedNFTs = new Set(likedNFTs);
    if (newLikedNFTs.has(nftId)) {
      newLikedNFTs.delete(nftId);
    } else {
      newLikedNFTs.add(nftId);
    }
    setLikedNFTs(newLikedNFTs);
  };

  const handleImageError = (nftId) => {
    const newImageErrors = new Set(imageErrors);
    newImageErrors.add(nftId);
    setImageErrors(newImageErrors);
  };

  const getImageSrc = (nft) => {
    if (imageErrors.has(nft.id)) {
      // Fallback to a different image service
      return `https://source.unsplash.com/400x400?abstract&sig=${nft.id}`;
    }
    return nft.image;
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Legendary': return '#FFD700';
      case 'Epic': return '#9C27B0';
      case 'Rare': return '#2196F3';
      default: return '#4CAF50';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ p: { xs: 1, sm: 3 } }}>
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
                Username: <span style={{ color: theme.palette.primary.main }}>{user?.name || user?.username || 'Not Available'}</span>
              </Typography>
            </Box>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Chip icon={<VerifiedUser />} label="KYC" color="primary" variant="outlined" />
            <Button variant="contained" color="primary" startIcon={<Email />} size="small">
              Mail Us
            </Button>
            <Button variant="contained" color="secondary" startIcon={<Settings />} size="small">
              Settings
            </Button>
          </Stack>
        </Box>

        {/* Page Title */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
            NFT Marketplace
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Discover, collect, and trade unique digital assets from top creators and collections.
          </Typography>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center', 
              bgcolor: '#232742', 
              color: '#fff',
              borderRadius: 3
            }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                12.8K
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                Total NFTs
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center', 
              bgcolor: '#232742', 
              color: '#fff',
              borderRadius: 3
            }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                847
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                Collections
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center', 
              bgcolor: '#232742', 
              color: '#fff',
              borderRadius: 3
            }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                2.3M
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                ETH Volume
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center', 
              bgcolor: '#232742', 
              color: '#fff',
              borderRadius: 3
            }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                45.2K
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                Active Users
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Navigation Tabs */}
        <Paper sx={{ mb: 4, bgcolor: '#232742', borderRadius: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            sx={{
              '& .MuiTab-root': { 
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600
              },
              '& .Mui-selected': { 
                color: theme.palette.primary.main + ' !important'
              }
            }}
          >
            <Tab icon={<LocalFireDepartment />} label="Trending" />
            <Tab icon={<TrendingUp />} label="Top Collections" />
            <Tab icon={<Star />} label="Featured" />
            <Tab icon={<Timer />} label="Live Auctions" />
          </Tabs>
        </Paper>

        {/* Trending NFTs Grid */}
        {tabValue === 0 && (
          <>
            <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 3, textAlign: 'center' }}>
              🔥 Trending NFTs
            </Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {trendingNFTs.map((nft) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={nft.id}>
                  <Card sx={{ 
                    height: '100%',
                    bgcolor: '#232742',
                    color: '#fff',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.3s, boxShadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8
                    },
                    position: 'relative'
                  }}>
                    {/* Rarity Badge */}
                    <Chip
                      label={nft.rarity}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: getRarityColor(nft.rarity),
                        color: '#000',
                        fontWeight: 'bold',
                        zIndex: 1
                      }}
                    />
                    
                    {/* Like Button */}
                    <IconButton
                      onClick={() => toggleLike(nft.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: likedNFTs.has(nft.id) ? '#FF6B6B' : '#fff',
                        zIndex: 1,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                      }}
                    >
                      {likedNFTs.has(nft.id) ? <Favorite /> : <FavoriteOutlined />}
                    </IconButton>

                    <Box sx={{ position: 'relative', height: 280, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="280"
                        image={getImageSrc(nft)}
                        alt={nft.name}
                        onError={() => handleImageError(nft.id)}
                        sx={{ 
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          bgcolor: 'rgba(255,255,255,0.05)',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                      {imageErrors.has(nft.id) && (
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(35, 39, 66, 0.9)',
                          flexDirection: 'column'
                        }}>
                          <Typography sx={{ fontSize: '3rem', mb: 1 }}>🎨</Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            NFT Artwork
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {nft.name}
                        </Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)" noWrap>
                          {nft.collection}
                        </Typography>
                      </Box>

                      {/* Price Section */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2,
                        p: 1.5,
                        bgcolor: 'rgba(0,179,134,0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(0,179,134,0.3)'
                      }}>
                        <Box>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            Current Price
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {nft.price} {nft.currency}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            Time Left
                          </Typography>
                          <Typography variant="body2" color="#FF6B6B" fontWeight="600">
                            {nft.timeLeft}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Stats */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 2,
                        fontSize: '0.85rem'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Visibility sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{nft.views}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Favorite sx={{ fontSize: 16, color: '#FF6B6B' }} />
                          <Typography variant="body2">{nft.likes}</Typography>
                        </Box>
                      </Box>

                      {/* Action Buttons */}
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          fullWidth
                          size="small"
                          startIcon={<ShoppingCart />}
                          sx={{ 
                            fontWeight: 600,
                            textTransform: 'none'
                          }}
                        >
                          Buy Now
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          size="small"
                          startIcon={<AccountBalanceWallet />}
                          sx={{ 
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            fontWeight: 600,
                            textTransform: 'none'
                          }}
                        >
                          Place Bid
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Top Collections */}
        {tabValue === 1 && (
          <Paper sx={{ 
            p: 4, 
            mb: 6,
            bgcolor: '#232742',
            color: '#fff',
            borderRadius: 3
          }}>
            <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 3, textAlign: 'center' }}>
              📊 Top Collections (24h Volume)
            </Typography>
            
            {topCollections.map((collection, index) => (
              <Box key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      #{index + 1}
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {collection.name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold">
                      {collection.volume} ETH
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={collection.change.startsWith('+') ? '#4CAF50' : '#FF6B6B'}
                      fontWeight="600"
                    >
                      {collection.change}
                    </Typography>
                  </Box>
                </Box>
                {index < topCollections.length - 1 && (
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                )}
              </Box>
            ))}
          </Paper>
        )}

        {/* Featured & Live Auctions placeholders */}
        {(tabValue === 2 || tabValue === 3) && (
          <Paper sx={{ 
            p: 6, 
            textAlign: 'center',
            bgcolor: '#232742',
            color: '#fff',
            borderRadius: 3
          }}>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
              {tabValue === 2 ? '⭐ Featured NFTs' : '⏰ Live Auctions'}
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.7)">
              {tabValue === 2 
                ? 'Curated selection of premium NFTs coming soon!' 
                : 'Real-time auction system launching soon!'
              }
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
