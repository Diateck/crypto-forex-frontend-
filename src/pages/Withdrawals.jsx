import React, { useState } from 'react';
import { Typography, Box, Card, Button, Modal, TextField, Divider, Avatar, Stack, Chip } from '@mui/material';
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

const withdrawalMethods = [
  { name: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', currency: 'BTC' },
  { name: 'Ethereum', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', currency: 'ETH' },
  { name: 'Litecoin', address: 'LcHKZQJQ8Qh6QJQ8Qh6QJQ8Qh6QJQ8Qh6Q', currency: 'LTC' },
  { name: 'Bank Transfer', address: '', currency: 'USD' },
  { name: 'PayPal', address: '', currency: 'USD' },
  { name: 'USDT', address: '', currency: 'USDT' },
];

export default function Withdrawals() {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');

  const user = {
    name: 'Theophilus Crown',
    email: 'theophiluscrown693@gmail.com',
    accountType: 'Withdrawal Type',
  };

  const handleOpenModal = (method) => {
    setSelectedMethod(method);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMethod(null);
    setAmount('');
    setDetails('');
  };

  return (
    <Box p={{ xs: 1, sm: 3 }}>
      {/* Header - Consistent with Deposits */}
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

      <Typography variant="h4" fontWeight={700} sx={{ mb: 3, color: theme.palette.primary.main }}>
        Withdraw Using Bitcoin/Ethereum/Litecoin/Bank/PayPal/USDT
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {withdrawalMethods.map((method) => (
          <Card key={method.name} sx={{ p: 3, borderRadius: 3, boxShadow: 3, bgcolor: theme.palette.background.paper }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>{method.name} Withdrawal Method</Typography>
            <Typography sx={{ mb: 1 }}>Please ensure your withdrawal details are correct for quick processing.</Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenModal(method)}>
              Withdraw
            </Button>
          </Card>
        ))}
      </Box>

      {/* Withdrawal Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#232742', p: 4, borderRadius: 3, boxShadow: 6, minWidth: 320, maxWidth: 400 }}>
          {selectedMethod ? (
            <>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{selectedMethod.name} Withdrawal Details</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" fontWeight={700}>Full Name: {user.name}</Typography>
              <Typography variant="subtitle2" fontWeight={700}>Email: {user.email}</Typography>
              <Typography variant="subtitle2" fontWeight={700}>Account Type: {user.accountType}</Typography>
              <TextField label="Amount" fullWidth sx={{ mb: 2 }} value={amount} onChange={e => setAmount(e.target.value)} />
              {(selectedMethod.name === 'Bank Transfer' || selectedMethod.name === 'PayPal' || selectedMethod.name === 'USDT') && (
                <TextField label="Withdrawal Details (e.g. Bank/PayPal/USDT info)" fullWidth sx={{ mb: 2 }} value={details} onChange={e => setDetails(e.target.value)} />
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleCloseModal}>Submit</Button>
              </Box>
            </>
          ) : null}
        </Box>
      </Modal>
    </Box>
  );
}
