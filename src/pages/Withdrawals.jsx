
import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Divider, 
  MenuItem, 
  Card, 
  Avatar, 
  Stack, 
  Chip,
  Container 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';

const tickerData = [
  { label: 'Nasdaq 100', value: '24,344.8', change: '+98.90 (+0.41%)', color: 'success.main' },
  { label: 'EUR/USD', value: '1.18099', change: '-0.00059 (-0.05%)', color: 'error.main' },
  { label: 'BTC/USD', value: '116,747', change: '+270.00 (+0.23%)', color: 'success.main' },
  { label: 'ETH/USD', value: '4,620.8', change: '+28.50', color: 'success.main' },
];

const withdrawalOptions = [
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'litecoin', label: 'Litecoin' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'bitcoin', label: 'Bitcoin' },
];

export default function Withdrawals() {
  const theme = useTheme();
  const [withdrawalType, setWithdrawalType] = useState('');
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        p: { xs: 1, sm: 2, md: 3 }, 
        minHeight: '100vh',
        bgcolor: theme.palette.background.default
      }}>
      {/* Professional Header - same as Dashboard */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 2, 
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
            <PersonIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem' } }} />
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
              Elon Investment Broker
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
              Username: <span style={{ color: theme.palette.primary.main }}>theophilus</span>
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
          <Chip 
            icon={<VerifiedUserIcon />} 
            label="KYC" 
            color="primary" 
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
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<EmailIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
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
            Mail Us
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<SettingsIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />} 
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
            Settings
          </Button>
        </Stack>
      </Box>

      {/* Ticker Bar - same as Dashboard */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 1.5, sm: 2, md: 3 }, 
        bgcolor: '#181A20', 
        p: { xs: 1, sm: 1.5 }, 
        borderRadius: 2, 
        mb: 3, 
        overflowX: 'auto', 
        boxShadow: 1,
        '&::-webkit-scrollbar': { 
          height: { xs: 4, sm: 6 }
        },
        '&::-webkit-scrollbar-track': { 
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: 2
        },
        '&::-webkit-scrollbar-thumb': { 
          bgcolor: 'primary.main', 
          borderRadius: 2,
          '&:hover': {
            bgcolor: 'primary.dark'
          }
        },
        scrollbarWidth: 'thin',
        scrollbarColor: 'primary.main rgba(255,255,255,0.1)'
      }}>
        {tickerData.map((item, idx) => (
          <Box 
            key={idx} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 1 },
              minWidth: { xs: 140, sm: 160, md: 180 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' },
              py: { xs: 0.5, sm: 0 },
              px: { xs: 1, sm: 0 }
            }}
          >
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              fontWeight={600}
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8125rem' } }}
            >
              {item.label}
            </Typography>
            <Typography 
              variant="body1" 
              color="#fff" 
              fontWeight={700}
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' } }}
            >
              {item.value}
            </Typography>
            <Typography 
              variant="body2" 
              color={item.color} 
              fontWeight={700}
              sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}
            >
              {item.change}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Withdraw Form - centered and professional */}
      <Box maxWidth={{ xs: '100%', sm: 500 }} mx="auto" sx={{ px: { xs: 1, sm: 0 } }}>
        <Typography 
          variant="h4" 
          fontWeight={900} 
          color={theme.palette.primary.main} 
          sx={{ 
            mb: 2, 
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
          }}
        >
          Withdraw
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' },
          gap: { xs: 0.5, sm: 0 }
        }}>
          <Typography 
            variant="subtitle1" 
            fontWeight={700} 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' }, 
              color: '#888' 
            }}
          >
            Request Withdrawal
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              ml: { xs: 0, sm: 2 }, 
              color: theme.palette.primary.main, 
              fontWeight: 700,
              fontSize: { xs: '0.85rem', sm: '0.9rem' }
            }}
          >
            (Balance: $0.00)
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography 
          variant="h5" 
          fontWeight={800} 
          sx={{ 
            mb: 2, 
            textAlign: 'center',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}
        >
          Payment Details
        </Typography>
        <Card sx={{ 
          p: { xs: 2, sm: 2.5, md: 3 }, 
          borderRadius: 3, 
          boxShadow: 3, 
          bgcolor: theme.palette.background.paper,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: { xs: 'none', sm: 'translateY(-2px)' },
            boxShadow: { xs: 3, sm: 6 }
          }
        }}>
          <Typography 
            variant="subtitle2" 
            fontWeight={700} 
            sx={{ 
              mb: 1,
              fontSize: { xs: '0.85rem', sm: '0.9rem' }
            }}
          >
            Withdrawal Type
          </Typography>
          <TextField
            select
            fullWidth
            label="Select withdrawal method"
            value={withdrawalType}
            onChange={e => setWithdrawalType(e.target.value)}
            sx={{ mb: 2 }}
            size="medium"
            SelectProps={{
              sx: {
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }
            }}
            InputLabelProps={{
              sx: {
                fontSize: { xs: '0.85rem', sm: '0.9rem' }
              }
            }}
          >
            {withdrawalOptions.map(option => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Conditional Form Fields */}
          {withdrawalType === 'bank' && (
            <>
              <TextField 
                label="Bank Name" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={bankName} 
                onChange={e => setBankName(e.target.value)}
                size="medium"
                InputProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
                }}
              />
              <TextField 
                label="Account Name" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={accountName} 
                onChange={e => setAccountName(e.target.value)}
                size="medium"
                InputProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
                }}
              />
              <TextField 
                label="Account Number" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={accountNumber} 
                onChange={e => setAccountNumber(e.target.value)}
                size="medium"
                InputProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
                }}
              />
            </>
          )}
          {(withdrawalType === 'litecoin' || withdrawalType === 'ethereum' || withdrawalType === 'bitcoin') && (
            <TextField 
              label="Wallet Address" 
              fullWidth 
              sx={{ mb: 2 }} 
              value={walletAddress} 
              onChange={e => setWalletAddress(e.target.value)}
              size="medium"
              InputProps={{
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
              }}
            />
          )}

          <TextField
            label="Amount $"
            fullWidth
            sx={{ mb: 2 }}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            type="number"
            inputProps={{ min: 0 }}
            size="medium"
            InputProps={{
              sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
            }}
            InputLabelProps={{
              sx: { fontSize: { xs: '0.85rem', sm: '0.9rem' } }
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large" 
            sx={{ 
              fontWeight: 700,
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              mt: 1
            }}
          >
            Request Withdrawal
          </Button>
        </Card>
      </Box>
      </Box>
    </Container>
  );
}
