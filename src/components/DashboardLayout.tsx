'use client';

import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(135deg, #0b0f33 0%, #000000 100%)' }}>
      <Navbar />
      <Box
        sx={{
          flex: 1,
          marginTop: '64px',
          p: { xs: 2, sm: 3, md: 4 },
          overflowY: 'auto',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
