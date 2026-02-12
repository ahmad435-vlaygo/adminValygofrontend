'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import apiClient from '@/lib/api/apiClient';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  Button,
  Paper,
} from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader, StatCard, DataCard } from '@/components/ui';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalTransactions: number;
  totalVolume: number;
  monthlyRevenue: number;
  kycPending: number;
  kybPending: number;
  suspendedUsers: number;
  pastDueSubscriptions: number;
  recentTransactions?: Array<{
    _id: string;
    userName?: string;
    type?: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

function DashboardContent() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (user?.role === 'sales_team') {
      router.replace('/dashboard/referral');
    }
  }, [user?.role, router]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/admin/dashboard/stats');
      const data = response.data?.data ?? response.data;
      setStats(data ?? null);
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err?.response?.data?.message || err?.message || 'Network error');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

if (user?.role === 'sales_team') {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 420 }}>
      <CircularProgress sx={{ color: '#00C2FF' }} size={48} />
    </Box>
  );
}

  if (loading) {
  return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 420 }}>
        <CircularProgress sx={{ color: '#00C2FF' }} size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 480, mx: 'auto', textAlign: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', mb: 1 }}>
          {t('dashboard.failedToLoad')}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', mb: 2 }}>
          {error}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem', mb: 2 }}>
          {t('dashboard.ensureBackend')}
        </Typography>
        <Button variant="contained" onClick={fetchDashboardStats} sx={{ borderRadius: '30px', textTransform: 'none' }}>
          {t('common.retry')}
        </Button>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>{t('dashboard.failedToLoad')}</Typography>
        <Button variant="outlined" onClick={fetchDashboardStats} sx={{ mt: 2, borderRadius: '30px', textTransform: 'none' }}>
          {t('common.retry')}
        </Button>
      </Box>
    );
  }

  const totalUsers = stats.totalUsers ?? 0;
  const totalTx = stats.totalTransactions ?? 0;
  const kycCompletionRate =
    totalUsers > 0
      ? (((totalUsers - (stats.kycPending ?? 0)) / totalUsers) * 100).toFixed(1)
      : '0';
  const recentTx = stats.recentTransactions ?? [];

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3 }}>
        <StatCard
          label={t('dashboard.totalUsers')}
          value={(stats.totalUsers ?? 0).toLocaleString()}
          subtext={`+${stats.newUsersThisMonth ?? 0} ${t('dashboard.thisMonth')}`}
          icon={<PeopleIcon />}
        />
        <StatCard
          label={t('dashboard.activeUsers')}
          value={(stats.activeUsers ?? 0).toLocaleString()}
          subtext={totalUsers > 0 ? `${((stats.activeUsers ?? 0) / totalUsers * 100).toFixed(1)}% ${t('dashboard.ofTotal')}` : '—'}
          icon={<TrendingUpIcon />}
        />
        <StatCard
          label={t('dashboard.totalTransactions')}
          value={(stats.totalTransactions ?? 0).toLocaleString()}
          subtext={t('dashboard.allTime')}
          icon={<ReceiptLongIcon />}
        />
        <StatCard
          label={t('dashboard.revenue')}
          value={`$${((stats.monthlyRevenue ?? 0) / 1000).toFixed(1)}k`}
          subtext={t('dashboard.thisMonth')}
          icon={<PaymentsIcon />}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3 }}>
        <StatCard
          label={t('dashboard.kycCompletion')}
          value={`${kycCompletionRate}%`}
          subtext={`${stats.kycPending ?? 0} ${t('dashboard.pending')}`}
          accent="primary"
        />
        <StatCard label={t('dashboard.kybPending')} value={stats.kybPending ?? 0} accent="error" />
        <StatCard label={t('dashboard.suspendedUsers')} value={stats.suspendedUsers ?? 0} accent="warning" />
        <StatCard label={t('dashboard.pastDueSubscriptions')} value={stats.pastDueSubscriptions ?? 0} accent="error" />
      </Box>

      <DataCard
        title={t('dashboard.recentTransactions')}
        subtitle={recentTx.length === 0 ? t('dashboard.noTransactionsYet') : undefined}
      >
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            background: 'transparent',
            maxHeight: 420,
            '& .MuiTable-root': { minWidth: 560 },
          }}
        >
          <Table size="medium" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.06)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    py: 2,
                    px: 3,
                  }}
                >
                  {t('transactions.user')}
                </TableCell>
                <TableCell
                  sx={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.06)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    py: 2,
                    px: 3,
                  }}
                >
                  {t('transactions.type')}
                </TableCell>
                <TableCell
                  sx={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.06)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    py: 2,
                    px: 3,
                  }}
                >
                  {t('transactions.amount')}
                </TableCell>
                <TableCell
                  sx={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.06)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    py: 2,
                    px: 3,
                  }}
                >
                  {t('transactions.status')}
                </TableCell>
                <TableCell
                  sx={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.06)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    py: 2,
                    px: 3,
                  }}
                >
                  {t('transactions.date')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTx.length > 0 ? (
                recentTx.map((tx, index) => (
                  <TableRow
                    key={tx._id}
                    sx={{
                      '&:hover': { background: 'rgba(255,255,255,0.04)' },
                      background: index % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    }}
                  >
                    <TableCell sx={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                      {tx.userName ?? '—'}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                      {tx.type ?? '—'}
                    </TableCell>
                    <TableCell sx={{ color: '#00C2FF', fontWeight: 600, borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                      ${Number(tx.amount).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                      <Chip
                        label={tx.status}
                        size="small"
                        sx={{
                          background: tx.status === 'completed' ? 'rgba(0, 194, 255, 0.35)' : 'rgba(255, 165, 0, 0.25)',
                          color: tx.status === 'completed' ? '#00C2FF' : '#FFA500',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          textTransform: 'capitalize',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.06)', fontSize: '0.875rem', py: 2, px: 3 }}>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.45)',
                      py: 6,
                      fontSize: '0.9rem',
                      borderColor: 'rgba(255,255,255,0.06)',
                    }}
                  >
                    <ReceiptLongIcon sx={{ fontSize: 48, opacity: 0.3, display: 'block', mx: 'auto', mb: 1.5 }} />
                    {t('dashboard.noTransactionsYet')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DataCard>
    </Box>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
