'use client';

import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, letterSpacing: '-0.02em', fontSize: { xs: '1.35rem', md: '1.5rem' } }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
