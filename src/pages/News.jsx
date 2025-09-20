import React from 'react';
import { Typography, Box } from '@mui/material';

export default function News() {
  return (
    <Box p={3}>
      <Typography variant="h4">News</Typography>
      <Typography>This is the news page.</Typography>
    </Box>
  );
}