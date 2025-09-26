
import React, { useState } from 'react';
import { Typography, Box, Button, TextField, Divider, MenuItem, Card, Avatar, Stack, Chip } from '@mui/material';
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
    <Box p={{ xs: 1, sm: 3 }}>
      {/* Professional Header - same as Dashboard */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, bgcolor: '#232742', p: 2, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={900} color={theme.palette.primary.main}>
              Elon Investment Broker
            </Typography>
            <Typography variant="h6" fontWeight={700} color="#fff">
              Username: <span style={{ color: theme.palette.primary.main }}>theophilus</span>
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip icon={<VerifiedUserIcon />} label="KYC" color="primary" variant="outlined" />
          <Button variant="contained" color="primary" startIcon={<EmailIcon />}>Mail Us</Button>
          <Button variant="contained" color="secondary" startIcon={<SettingsIcon />}>Settings</Button>
        </Stack>
      </Box>

      {/* Ticker Bar - same as Dashboard */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, bgcolor: '#181A20', p: 1.5, borderRadius: 2, mb: 3, overflowX: 'auto', boxShadow: 1 }}>
        {tickerData.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>{item.label}</Typography>
            <Typography variant="body1" color="#fff" fontWeight={700}>{item.value}</Typography>
            <Typography variant="body2" color={item.color} fontWeight={700}>{item.change}</Typography>
          </Box>
        ))}
      </Box>

      {/* Withdraw Form - centered and professional */}
      <Box maxWidth={500} mx="auto">
        <Typography variant="h4" fontWeight={900} color={theme.palette.primary.main} sx={{ mb: 2 }}>
          Withdraw
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '1rem', color: '#888' }}>
            Request Withdrawal
          </Typography>
          <Typography variant="body2" sx={{ ml: 2, color: theme.palette.primary.main, fontWeight: 700 }}>
            (Balance: $0.00)
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
          Payment Details
        </Typography>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, bgcolor: theme.palette.background.paper }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Withdrawal Type</Typography>
          <TextField
            select
            fullWidth
            label="Select withdrawal method"
            value={withdrawalType}
            onChange={e => setWithdrawalType(e.target.value)}
            sx={{ mb: 2 }}
          >
            {withdrawalOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>

          {/* Conditional Form Fields */}
          {withdrawalType === 'bank' && (
            <>
              <TextField label="Bank Name" fullWidth sx={{ mb: 2 }} value={bankName} onChange={e => setBankName(e.target.value)} />
              <TextField label="Account Name" fullWidth sx={{ mb: 2 }} value={accountName} onChange={e => setAccountName(e.target.value)} />
              <TextField label="Account Number" fullWidth sx={{ mb: 2 }} value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
            </>
          )}
          {(withdrawalType === 'litecoin' || withdrawalType === 'ethereum' || withdrawalType === 'bitcoin') && (
            <TextField label="Wallet Address" fullWidth sx={{ mb: 2 }} value={walletAddress} onChange={e => setWalletAddress(e.target.value)} />
          )}

          <TextField
            label="Amount $"
            fullWidth
            sx={{ mb: 2 }}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            type="number"
            inputProps={{ min: 0 }}
          />
          <Button variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 700 }}>
            Request Withdrawal
          </Button>
        </Card>
      </Box>
    </Box>
  );
}
