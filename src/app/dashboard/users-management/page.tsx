'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/api/apiClient';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Pagination,
  Paper,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { PageHeader, DataCard } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  type: 'individual' | 'business';
  country: string;
  createdAt: string;
  lockedDepositVyo?: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const chipSx = (status: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    active: { bg: 'rgba(0, 194, 255, 0.2)', color: '#00C2FF' },
    inactive: { bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' },
    suspended: { bg: 'rgba(255, 107, 107, 0.2)', color: '#FF6B6B' },
    pending: { bg: 'rgba(255, 165, 0, 0.2)', color: '#FFA500' },
  };
  return map[status] || map.inactive;
};

const UsersManagementPage = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, limit, status, type, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (status) params.append('status', status);
      if (type) params.append('type', type);
      if (search) params.append('search', search);

      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      const data = response.data.data || response.data.users || [];
      setUsers(Array.isArray(data) ? data : []);
      setPagination(response.data.pagination || { total: 0, page, limit, pages: 0 });
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setPagination({ total: 0, page, limit, pages: 0 });
    } finally {
      setLoading(false);
    }
  };

  const [statusError, setStatusError] = useState<string | null>(null);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setStatusError(null);
    const normalized = (newStatus || 'active').toLowerCase();
    try {
      await apiClient.put(`/admin/users/${userId}/status`, { status: normalized });
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user status:', error);
      setStatusError(error.response?.data?.message || error.response?.data?.error || 'Failed to update status');
    }
  };

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
      <PageHeader title={t('users.title')} subtitle={t('users.subtitle')} />

      {statusError && (
        <Box sx={{ mb: 2, p: 1.5, borderRadius: 1, bgcolor: 'rgba(255, 107, 107, 0.2)', color: '#FF6B6B' }}>
          {statusError}
        </Box>
      )}

      <DataCard sx={{ mb: 3 }}>
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FilterListIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
            <TextField
              size="small"
              placeholder={t('users.searchPlaceholder')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>{t('users.status')}</InputLabel>
              <Select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                label={t('users.status')}
                sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value="">{t('users.allStatus')}</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>{t('common.type')}</InputLabel>
              <Select
                value={type}
                onChange={(e) => { setType(e.target.value); setPage(1); }}
                label={t('common.type')}
                sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value="">{t('users.allTypes')}</MenuItem>
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="business">Business</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>{t('users.perPage')}</InputLabel>
              <Select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                label={t('users.perPage')}
                sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            {(search || status || type) && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={() => { setSearch(''); setStatus(''); setType(''); setPage(1); }}
                sx={{ color: 'rgba(255,255,255,0.8)', textTransform: 'none' }}
              >
                Clear filters
              </Button>
            )}
          </Box>
        </Box>
      </DataCard>

      <DataCard title={t('users.list')} subtitle={pagination ? `${pagination.total} ${t('common.total')}` : undefined}>
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
                      {[t('users.name'), t('users.email'), t('common.type'), t('users.status'), 'Locked (VYO)', t('users.country'), t('users.joined'), t('common.actions')].map((head) => (
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
                    {users && users.length > 0 ? (
                      users.map((user, index) => (
                        <TableRow
                          key={user._id}
                          sx={{
                            '&:hover': { background: 'rgba(255,255,255,0.04)' },
                            background: index % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent',
                          }}
                        >
                          <TableCell sx={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>{user.email}</TableCell>
                          <TableCell sx={{ borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                            <Chip label={user.type} size="small" sx={{ ...chipSx(user.type), fontWeight: 600, fontSize: '0.75rem', textTransform: 'capitalize' }} />
                          </TableCell>
                          <TableCell sx={{ borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                            <Select
                              value={(user.status || 'active').toLowerCase()}
                              onChange={(e) => handleStatusChange(user._id, e.target.value)}
                              size="small"
                              sx={{ minWidth: 120, color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                            >
                              <MenuItem value="active">Active</MenuItem>
                              <MenuItem value="inactive">Inactive</MenuItem>
                              <MenuItem value="suspended">Suspended</MenuItem>
                              <MenuItem value="pending">Pending</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell sx={{ color: '#00C2FF', fontWeight: 600, borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                            {Number(user.lockedDepositVyo ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>{user.country || '—'}</TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.06)', fontSize: '0.875rem', py: 2, px: 3 }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ borderColor: 'rgba(255,255,255,0.06)', py: 2, px: 3 }}>
                            <Link href={`/dashboard/users-management/${user._id}`}>
                              <Button size="small" sx={{ color: '#00C2FF', textTransform: 'none', fontWeight: 600 }}>{t('common.view')}</Button>
                            </Link>
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
                          {t('users.noUsersFound')}
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
                  <Pagination
                    count={pagination.pages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    sx={{
                      '& .MuiPaginationItem-root': { color: 'rgba(255,255,255,0.8)' },
                      '& .MuiPaginationItem-page.Mui-selected': { background: '#00C2FF', color: '#0b0f33' },
                    }}
                  />
                </Box>
              )}
            </>
          )}
      </DataCard>
    </Box>
  );
};

export default UsersManagementPage;
