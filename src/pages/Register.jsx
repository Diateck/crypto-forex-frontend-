import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#181A20">
      <Box sx={{ position: 'absolute', top: 32, left: 0, right: 0, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={900} color="primary" sx={{ letterSpacing: 1, mb: 4 }}>
          Elon Investment Broker
        </Typography>
      </Box>
      <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3, minWidth: 320, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" fontWeight={900} color="primary" sx={{ mb: 2 }}>
          Register
        </Typography>
        <TextField
          label="Full Name"
          fullWidth
          sx={{ mb: 2 }}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 700 }}>
          Register
        </Button>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 700 }}>
            Login
          </Link>
        </Typography>
      </Card>
    </Box>
  );
}

export default Register;
