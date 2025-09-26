import React from 'react';
import { Typography, Box } from '@mui/material';

export default function Login() {
  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#181A20">
      <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3, minWidth: 320, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" fontWeight={900} color="primary" sx={{ mb: 2 }}>
          Login
        </Typography>
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
          Login
        </Button>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Don't have an account? <a href="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 700 }}>Register</a>
        </Typography>
      </Card>
    </Box>
  );
}
