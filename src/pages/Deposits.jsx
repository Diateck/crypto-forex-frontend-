import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  Button, 
  Modal, 
  TextField, 
  Divider, 
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

const depositMethods = [
  {
    name: 'Bitcoin',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    qr: 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    currency: 'BTC',
  },
  {
    name: 'Ethereum',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    qr: 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=ethereum:0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    currency: 'ETH',
  },
  {
    name: 'Litecoin',
    address: 'LcHKZQJQ8Qh6QJQ8Qh6QJQ8Qh6QJQ8Qh6Q',
    qr: 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=litecoin:LcHKZQJQ8Qh6QJQ8Qh6QJQ8Qh6QJQ8Qh6Q',
    currency: 'LTC',
  },
];

export default function Deposits() {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('');
  const [proof, setProof] = useState(null);

  const user = {
    name: 'Theophilus Crown',
    email: 'theophiluscrown693@gmail.com',
    accountType: 'Deposit Type',
  };

  const handleOpenModal = (method) => {
    setSelectedMethod(method);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMethod(null);
    setAmount('');
    setProof(null);
  };

  return (
    <Container maxWidth="xl">
      <Box p={{ xs: 1, sm: 3 }}>
      {/* Header - Consistent with Dashboard */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 2, 
        bgcolor: '#232742', 
        p: 2, 
        borderRadius: 3, 
        boxShadow: 3,
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 0 }
      }}>
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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Chip icon={<VerifiedUserIcon />} label="KYC" color="primary" variant="outlined" />
          <Button variant="contained" color="primary" startIcon={<EmailIcon />} size="small">
            Mail Us
          </Button>
          <Button variant="contained" color="secondary" startIcon={<SettingsIcon />} size="small">
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

      <Typography variant={{ xs: 'h5', sm: 'h4' }} fontWeight={700} sx={{ mb: 3, color: theme.palette.primary.main, textAlign: 'center' }}>
        Deposit Using Bitcoin/Ethereum/Litecoin
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {depositMethods.map((method) => (
          <Card key={method.name} sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 3, 
            boxShadow: 3, 
            bgcolor: theme.palette.background.paper 
          }}>
            <Typography variant={{ xs: 'h6', sm: 'h5' }} fontWeight={700} sx={{ mb: 1 }}>
              {method.name} Deposit Method
            </Typography>
            <Typography sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Please make sure you upload your payment proof for quick payment verification
            </Typography>
            <Typography sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              On confirmation, our system will automatically convert your {method.name} to live value of Dollars. Ensure that you deposit the actual {method.name} to the address specified on the payment Page.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleOpenModal(method)}
              fullWidth={{ xs: true, sm: false }}
              size={{ xs: 'large', sm: 'medium' }}
            >
              Make Deposit
            </Button>
          </Card>
        ))}

        {/* Other Deposit Method */}
        <Card sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 3, 
          boxShadow: 3, 
          bgcolor: theme.palette.background.paper 
        }}>
          <Typography variant={{ xs: 'h6', sm: 'h5' }} fontWeight={700} sx={{ mb: 1 }}>
            Other Deposit Method
          </Typography>
          <Typography sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Request other available Deposit Method
          </Typography>
          <Typography sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Once payment is made using this method you are to send your payment proof to our support mail <b>interspace@interspacebroker.com</b>
          </Typography>
          <Typography sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Once requested, you will receive the payment details via our support mail....
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => handleOpenModal('other')}
            fullWidth={{ xs: true, sm: false }}
            size={{ xs: 'large', sm: 'medium' }}
          >
            Proceed
          </Button>
        </Card>
      </Box>

      {/* Deposit Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          bgcolor: '#232742', 
          p: { xs: 2, sm: 4 }, 
          borderRadius: 3, 
          boxShadow: 6, 
          minWidth: { xs: '90vw', sm: 320 }, 
          maxWidth: { xs: '95vw', sm: 400 },
          maxHeight: { xs: '90vh', sm: 'none' },
          overflowY: 'auto'
        }}>
          {selectedMethod && selectedMethod !== 'other' ? (
            <>
              <Typography variant={{ xs: 'h6', sm: 'h6' }} fontWeight={700} sx={{ mb: 2 }}>
                {selectedMethod.name} Deposit Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Deposit Address:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography sx={{ 
                  wordBreak: 'break-all', 
                  color: theme.palette.primary.main, 
                  mr: { xs: 0, sm: 1 },
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}>
                  {selectedMethod.address}
                </Typography>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => {navigator.clipboard.writeText(selectedMethod.address)}}
                  fullWidth={{ xs: true, sm: false }}
                >
                  Copy
                </Button>
              </Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${selectedMethod.address}`} 
                  alt="Deposit QR" 
                  style={{ width: 120, height: 120 }} 
                />
              </Box>
              <TextField 
                label="Amount" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                size={{ xs: 'small', sm: 'medium' }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Upload Payment Proof:
                </Typography>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setProof(e.target.files[0])}
                  style={{ width: '100%' }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleCloseModal}
                  fullWidth={{ xs: true, sm: false }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleCloseModal}
                  fullWidth={{ xs: true, sm: false }}
                >
                  Submit
                </Button>
              </Box>
            </>
          ) : selectedMethod === 'other' ? (
            <>
              <Typography variant={{ xs: 'h6', sm: 'h6' }} fontWeight={700} sx={{ mb: 2 }}>
                Other Deposit Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Full Name: {user.name}
              </Typography>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Email: {user.email}
              </Typography>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Account Type: {user.accountType}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Deposit Type:
                </Typography>
                <select style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: 6, 
                  border: '1px solid #444', 
                  background: '#181A20', 
                  color: '#fff', 
                  fontSize: '1rem' 
                }}>
                  <option value="">Select Deposit Type</option>
                  <option value="Litecoin">Litecoin</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Bitcoin Cash">Bitcoin Cash</option>
                  <option value="USDT">USDT</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Stellar">Stellar</option>
                  <option value="Western Union">Western Union</option>
                  <option value="Skrill">Skrill</option>
                  <option value="MoneyGram">MoneyGram</option>
                </select>
              </Box>
              <TextField 
                label="Amount" 
                fullWidth 
                sx={{ mb: 2 }} 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                size={{ xs: 'small', sm: 'medium' }}
              />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleCloseModal}
                  fullWidth={{ xs: true, sm: false }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleCloseModal}
                  fullWidth={{ xs: true, sm: false }}
                >
                  Submit
                </Button>
              </Box>
            </>
          ) : null}
        </Box>
      </Modal>
    </Box>
    </Container>
  );
}
