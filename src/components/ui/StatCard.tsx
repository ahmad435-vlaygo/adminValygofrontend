'use client';

import { Box, Card, Typography } from '@mui/material';

const accentColors: Record<string, { bg: string; border: string; label: string; iconBg: string }> = {
  primary: {
    bg: 'linear-gradient(145deg, rgba(11, 15, 51, 0.9) 0%, rgba(8, 12, 40, 0.95) 100%)',
    border: 'rgba(0, 194, 255, 0.2)',
    label: '#00C2FF',
    iconBg: 'rgba(0, 194, 255, 0.15)',
  },
  error: {
    bg: 'linear-gradient(145deg, rgba(11, 15, 51, 0.9) 0%, rgba(8, 12, 40, 0.95) 100%)',
    border: 'rgba(255, 107, 107, 0.2)',
    label: '#FF6B6B',
    iconBg: 'rgba(255, 107, 107, 0.12)',
  },
  warning: {
    bg: 'linear-gradient(145deg, rgba(11, 15, 51, 0.9) 0%, rgba(8, 12, 40, 0.95) 100%)',
    border: 'rgba(255, 165, 0, 0.2)',
    label: '#FFA500',
    iconBg: 'rgba(255, 165, 0, 0.12)',
  },
  neutral: {
    bg: 'linear-gradient(145deg, rgba(11, 15, 51, 0.9) 0%, rgba(8, 12, 40, 0.95) 100%)',
    border: 'rgba(255, 255, 255, 0.08)',
    label: 'rgba(255, 255, 255, 0.85)',
    iconBg: 'rgba(255, 255, 255, 0.06)',
  },
};

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  icon?: React.ReactNode;
  accent?: 'primary' | 'error' | 'warning' | 'neutral';
}

export default function StatCard({ label, value, subtext, icon, accent = 'primary' }: StatCardProps) {
  const colors = accentColors[accent];
  return (
    <Card
      sx={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        p: 2.5,
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          border: `1px solid ${colors.border}`,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      {icon && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: colors.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.label,
            '& .material-symbols-outlined': { fontSize: 24 },
            '& .MuiSvgIcon-root': { fontSize: 24 },
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ pr: icon ? 6 : 0 }}>
        <Typography
          sx={{
            color: colors.label,
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            mb: 1,
            opacity: 0.95,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            color: '#fff',
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            mb: subtext ? 0.5 : 0,
          }}
        >
          {value}
        </Typography>
        {subtext && (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.8rem' }}>
            {subtext}
          </Typography>
        )}
      </Box>
    </Card>
  );
}
