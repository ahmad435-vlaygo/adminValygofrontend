'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/api/apiClient';
import Link from 'next/link';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { PageHeader, StatCard, DataCard } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';

interface Transaction {
  _id: string;
  user_id?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    displayName?: string;
  };
  user?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    displayName?: string;
  };
  type?: string;
  transactionType?: string;
  status: string;
  amount: number;
  fee?: number;
  currency?: string;
  from_currency?: string;
  description?: string;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const TransactionsPage = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, [page, limit, status, type]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (status) params.append('status', status);
      if (type) params.append('type', type);

      const response = await apiClient.get(`/admin/transactions?${params.toString()}`);
      const resData = response.data?.data ?? response.data;
      setTransactions(Array.isArray(resData) ? resData : []);
      setPagination(response.data?.pagination ?? null);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/transactions/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '↓';
      case 'withdrawal':
        return '↑';
      case 'transfer':
        return '↔';
      case 'fee':
        return '⚙';
      case 'refund':
        return '↩';
      default:
        return '•';
    }
  };

  const statusChipSx = (s: string) => ({
    background: s === 'completed' ? 'rgba(0, 212, 170, 0.25)' : s === 'pending' ? 'rgba(255, 165, 0, 0.25)' : 'rgba(255,255,255,0.1)',
    color: s === 'completed' ? '#00C2FF' : s === 'pending' ? '#FFA500' : 'rgba(255,255,255,0.8)',
    fontWeight: 600,
    fontSize: '11px',
  });

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
      <PageHeader title={t('transactions.title')} subtitle={t('transactions.subtitle')} />

      {stats && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 3 }}>
          <StatCard label={t('common.total')} value={stats.totalTransactions} />
          <StatCard label={t('transactions.completed')} value={stats.completedTransactions} accent="primary" />
          <StatCard label={t('transactions.pending')} value={stats.pendingTransactions} accent="warning" />
          <StatCard label={t('transactions.volume')} value={`$${Number(stats.totalVolume || 0).toFixed(2)}`} />
          <StatCard label={t('transactions.totalFees')} value={`$${Number(stats.totalFees || 0).toFixed(2)}`} />
        </Box>
      )}

      <DataCard sx={{ mb: 2 }}>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <FilterListIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>{t('transactions.status')}</InputLabel>
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} label={t('transactions.status')} sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}>
              <MenuItem value="">{t('transactions.all')}</MenuItem>
              <MenuItem value="completed">{t('transactions.completed')}</MenuItem>
              <MenuItem value="pending">{t('transactions.pending')}</MenuItem>
              <MenuItem value="failed">{t('transactions.failed')}</MenuItem>
              <MenuItem value="cancelled">{t('transactions.cancelled')}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>{t('common.type')}</InputLabel>
            <Select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} label={t('common.type')} sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}>
              <MenuItem value="">{t('transactions.all')}</MenuItem>
              <MenuItem value="deposit">{t('transactions.deposit')}</MenuItem>
              <MenuItem value="withdrawal">{t('transactions.withdrawal')}</MenuItem>
              <MenuItem value="transfer">{t('transactions.transfer')}</MenuItem>
              <MenuItem value="fee">{t('transactions.fee')}</MenuItem>
              <MenuItem value="refund">{t('transactions.refund')}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>{t('transactions.perPage')}</InputLabel>
            <Select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} label={t('transactions.perPage')} sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          {(status || type) && (
            <Button size="small" startIcon={<ClearIcon />} onClick={() => { setStatus(''); setType(''); setPage(1); }} sx={{ color: 'rgba(255,255,255,0.8)', textTransform: 'none' }}>
              Clear filters
            </Button>
          )}
        </Box>
      </DataCard>

      <DataCard title={t('transactions.list')} subtitle={pagination ? `${pagination.total} ${t('common.total')}` : undefined}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
            <CircularProgress sx={{ color: '#00C2FF' }} />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent', maxHeight: 520 }}>
              <Table size="medium" stickyHeader>
                <TableHead>
                  <TableRow>
                    {[t('transactions.user'), t('common.type'), t('transactions.amount'), t('transactions.fee'), t('transactions.status'), t('transactions.date'), t('common.actions')].map((head) => (
                      <TableCell
                        key={head}
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
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length > 0 ? transactions.map((tx, index) => (
                    <TableRow
                      key={tx._id}
                      sx={{
                        '&:hover': { background: 'rgba(255,255,255,0.04)' },
                        background: index % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      }}
                    >
                      <TableCell sx={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                        <Box>{(tx.user || tx.user_id)?.firstName} {(tx.user || tx.user_id)?.lastName}</Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{(tx.user || tx.user_id)?.email}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>{getTypeIcon(tx.type || tx.transactionType || '')} {tx.type || tx.transactionType || '—'}</TableCell>
                      <TableCell sx={{ color: '#00C2FF', fontWeight: 600, borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>{(tx.currency || tx.from_currency || 'USD')} {Number(tx.amount).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>{Number(tx.fee || 0).toFixed(2)}</TableCell>
                      <TableCell sx={{ borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}><Chip label={tx.status} size="small" sx={{ ...statusChipSx(tx.status), fontSize: '0.75rem', textTransform: 'capitalize' }} /></TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.06)', fontSize: '0.875rem', py: 2, px: 3 }}>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                        <Link href={`/dashboard/transactions/${tx._id}`}><Button size="small" sx={{ color: '#00C2FF', textTransform: 'none', fontWeight: 600 }}>{t('common.view')}</Button></Link>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', py: 6, fontSize: '0.9rem', borderColor: 'rgba(255,255,255,0.06)' }}>
                        {t('transactions.connectDbHint')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {pagination && pagination.pages > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem' }}>
                  {(page - 1) * limit + 1}–{Math.min(page * limit, pagination.total)} of {pagination.total}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} sx={{ color: 'rgba(255,255,255,0.85)', textTransform: 'none' }}>{t('common.previous')}</Button>
                  <Button size="small" disabled={page >= pagination.pages} onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} sx={{ color: 'rgba(255,255,255,0.85)', textTransform: 'none' }}>{t('common.next')}</Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </DataCard>
    </Box>
  );
};

export default TransactionsPage;
