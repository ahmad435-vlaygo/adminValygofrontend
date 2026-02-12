'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import apiClient from '@/lib/api/apiClient';
import { PageHeader, StatCard, DataCard } from '@/components/ui';

interface Subscription {
  _id: string;
  user_id: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  plan_display_name: string;
  status: 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELED';
  billing_start: string;
  billing_end: string;
  next_billing_date?: string;
  next_billing_amount?: number;
  monthly_fee_usd?: number;
  deposit_lock_vyo?: number;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
  }, [page, limit, status]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (status) params.append('status', status);

      const response = await apiClient.get(`/admin/subscriptions?${params.toString()}`);
      setSubscriptions(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/subscriptions/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching subscription stats:', error);
    }
  };

  const handleStatusChange = async (subscriptionId: string, newStatus: string) => {
    try {
      await apiClient.put(`/admin/subscriptions/${subscriptionId}/status`, { status: newStatus });
      fetchSubscriptions();
      fetchStats();
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
      <PageHeader
        title="Subscriptions"
        subtitle="Monitor and manage user subscriptions"
      />

      {stats && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <StatCard label="Total" value={stats.total ?? 0} />
          <StatCard label="Active" value={stats.active ?? 0} accent="primary" />
          <StatCard label="Monthly revenue" value={`$${Number(stats.totalMRR ?? 0).toFixed(2)}`} accent="primary" />
          <StatCard label="Past due" value={stats.pastDue ?? 0} accent="warning" />
        </Box>
      )}

      <DataCard sx={{ mb: 3 }}>
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FilterListIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                label="Status"
                sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value="">All status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="PAST_DUE">Past due</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                <MenuItem value="CANCELED">Canceled</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Per page</InputLabel>
              <Select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                label="Per page"
                sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            {status && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={() => { setStatus(''); setPage(1); }}
                sx={{ color: 'rgba(255,255,255,0.8)', textTransform: 'none' }}
              >
                Clear filters
              </Button>
            )}
          </Box>
        </Box>
      </DataCard>

      <DataCard
        title="Subscriptions"
        subtitle={pagination ? `${pagination.total} total` : undefined}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 360 }}>
            <CircularProgress sx={{ color: '#00C2FF' }} />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
              <Table size="medium" stickyHeader>
                <TableHead>
                  <TableRow>
                    {['User', 'Plan', 'Monthly fee', 'Locked (VYO)', 'Status', 'Billing period', 'Next billing', 'Actions'].map((head) => (
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
                  {subscriptions.length > 0 ? (
                    subscriptions.map((sub, index) => (
                      <TableRow
                        key={sub._id}
                        sx={{
                          '&:hover': { background: 'rgba(255,255,255,0.04)' },
                          background: index % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        }}
                      >
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                          <Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                              {sub.user_id.firstName} {sub.user_id.lastName}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                              {sub.user_id.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                          {sub.plan_display_name}
                        </TableCell>
                        <TableCell sx={{ color: '#00C2FF', fontWeight: 600, borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                          ${Number(sub.monthly_fee_usd ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                          {Number(sub.deposit_lock_vyo ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                          <Select
                            value={sub.status}
                            onChange={(e) => handleStatusChange(sub._id, e.target.value)}
                            size="small"
                            sx={{
                              minWidth: 120,
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                            }}
                          >
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="PAST_DUE">Past due</MenuItem>
                            <MenuItem value="SUSPENDED">Suspended</MenuItem>
                            <MenuItem value="CANCELED">Canceled</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                          {formatDate(sub.billing_start)} – {formatDate(sub.billing_end)}
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                          {sub.next_billing_date ? formatDate(sub.next_billing_date) : '—'}
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />}
                            onClick={() => { setSelectedSubscription(sub); setViewDialogOpen(true); }}
                            sx={{ color: '#00C2FF', textTransform: 'none', fontWeight: 600 }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        align="center"
                        sx={{ py: 6, color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', borderColor: 'rgba(255,255,255,0.06)' }}
                      >
                        No subscriptions found
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
                  <Button
                    size="small"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    sx={{ color: 'rgba(255,255,255,0.85)', textTransform: 'none' }}
                  >
                    Previous
                  </Button>
                  <Button
                    size="small"
                    disabled={page >= pagination.pages}
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    sx={{ color: 'rgba(255,255,255,0.85)', textTransform: 'none' }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </DataCard>

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { background: 'linear-gradient(145deg, rgba(11, 15, 51, 0.98) 0%, rgba(8, 12, 40, 0.98) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Subscription details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedSubscription && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>User</Typography>
                <Typography sx={{ color: '#fff' }}>
                  {selectedSubscription.user_id.firstName} {selectedSubscription.user_id.lastName}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{selectedSubscription.user_id.email}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Plan</Typography>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedSubscription.plan_display_name}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Monthly fee</Typography>
                <Typography sx={{ color: '#00C2FF', fontWeight: 600 }}>${Number(selectedSubscription.monthly_fee_usd ?? 0).toFixed(2)}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Locked deposit (VYO)</Typography>
                <Typography sx={{ color: '#00C2FF', fontWeight: 600 }}>{Number(selectedSubscription.deposit_lock_vyo ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Billing period</Typography>
                <Typography sx={{ color: '#fff' }}>
                  {formatDate(selectedSubscription.billing_start)} – {formatDate(selectedSubscription.billing_end)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', px: 3, py: 2 }}>
          <Button onClick={() => setViewDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.8)', textTransform: 'none' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionsPage;
