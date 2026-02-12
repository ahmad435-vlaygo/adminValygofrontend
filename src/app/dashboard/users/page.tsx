'use client';

import React, { useState, useEffect } from 'react';
import {
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Pagination,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import apiClient from '@/lib/api/apiClient';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  status: 'active' | 'inactive' | 'suspended';
  accountType: 'individual' | 'business';
  kycStatus: 'pending' | 'approved' | 'rejected' | 'under_review';
  subscriptionStatus: 'active' | 'inactive' | 'past_due' | 'suspended';
  totalTransactions: number;
  totalVolume: number;
  lastLogin: string;
  createdAt: string;
}

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  active: 'success',
  inactive: 'default',
  suspended: 'error',
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  under_review: 'warning',
  past_due: 'error',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    kycPending: 0,
    totalVolume: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [page, searchTerm, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus && { status: filterStatus }),
      });

      const response = await apiClient.get(`/admin/users?${params}`);
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiClient.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Users Management
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Manage and monitor all platform users
        </Typography>
      </Box>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Active Users</p>
          <p className="text-3xl font-bold">{stats.activeUsers}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">KYC Pending</p>
          <p className="text-3xl font-bold">{stats.kycPending}</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-teal-400 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Total Volume</p>
          <p className="text-3xl font-bold">${stats.totalVolume.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by name or email..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flex: 1, minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Country</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>KYC</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Transactions</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell>{user.country}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={statusColors[user.status]}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.kycStatus}
                        color={statusColors[user.kycStatus]}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{user.totalTransactions}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => {
                            setSelectedUser(user);
                            setViewDialogOpen(true);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
              />
            </Box>
          </>
        )}
      </TableContainer>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Name
                </Typography>
                <Typography variant="body2">
                  {selectedUser.firstName} {selectedUser.lastName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body2">{selectedUser.email}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Phone
                </Typography>
                <Typography variant="body2">{selectedUser.phoneNumber}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Country
                </Typography>
                <Typography variant="body2">{selectedUser.country}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Account Type
                </Typography>
                <Typography variant="body2">{selectedUser.accountType}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Total Volume
                </Typography>
                <Typography variant="body2">${selectedUser.totalVolume.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Last Login
                </Typography>
                <Typography variant="body2">{formatDate(selectedUser.lastLogin)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
