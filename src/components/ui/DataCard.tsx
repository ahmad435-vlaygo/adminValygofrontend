'use client';

import { Box, Card, Typography } from '@mui/material';

interface DataCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  sx?: object;
}

export default function DataCard({ title, subtitle, children, sx = {} }: DataCardProps) {
  return (
    <Card
      sx={{
        background: 'linear-gradient(145deg, rgba(11, 15, 51, 0.7) 0%, rgba(8, 12, 40, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        ...sx,
      }}
    >
      {(title || subtitle) && (
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          {title && (
            <Typography sx={{ color: '#fff', fontSize: '1.0625rem', fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem', mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      <Box sx={{ overflow: 'auto' }}>
        {children}
      </Box>
    </Card>
  );
}
