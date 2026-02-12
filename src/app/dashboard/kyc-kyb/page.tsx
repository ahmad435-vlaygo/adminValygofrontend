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
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import apiClient from '@/lib/api/apiClient';

interface KYCData {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  nationality: string;
  identificationType: string;
  personalIdentificationNumber: string;
  address: string;
  city: string;
  country: string;
  passportImage: string;
  nationalIdImage: string;
  passportSelfie: string;
  currentStep: number;
  submittedAt: string;
  reviewedAt: string;
  createdAt: string;
}

interface KYBData {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  businessLegalName: string;
  businessLegalType: string;
  registrationNumber: string;
  taxId: string;
  businessEmail: string;
  businessPhone: string;
  industryType: string;
  numberOfEmployees: number;
  documents: {
    certificateOfIncorporation: string;
    proofOfAddress: string;
    taxDocument: string;
  };
  currentStep: number;
  submittedAt: string;
  reviewedAt: string;
  createdAt: string;
}

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
  under_review: 'warning',
};

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function KYCKYBPage() {
  const [tabValue, setTabValue] = useState(0);
  const [kycData, setKycData] = useState<KYCData[]>([]);
  const [kybData, setKybData] = useState<KYBData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KYCData | KYBData | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    kycPending: 0,
    kycApproved: 0,
    kybPending: 0,
    kybApproved: 0,
  });

  useEffect(() => {
    if (tabValue === 0) {
      fetchKYCData();
    } else {
      fetchKYBData();
    }
    fetchStats();
  }, [page, searchTerm, filterStatus, tabValue]);

  const fetchKYCData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus && { status: filterStatus }),
      });

      const response = await apiClient.get(`/admin/kyc?${params}`);
      setKycData(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching KYC data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKYBData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus && { status: filterStatus }),
      });

      const response = await apiClient.get(`/admin/kyb?${params}`);
      setKybData(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching KYB data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/kyc-kyb/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const endpoint = tabValue === 0 ? `/admin/kyc/${id}/approve` : `/admin/kyb/${id}/approve`;
      await apiClient.patch(endpoint);
      if (tabValue === 0) {
        fetchKYCData();
      } else {
        fetchKYBData();
      }
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = async () => {
    try {
      if (!selectedItem) return;
      const endpoint = tabValue === 0 ? `/admin/kyc/${selectedItem._id}/reject` : `/admin/kyb/${selectedItem._id}/reject`;
      await apiClient.patch(endpoint, { rejectionReason });
      setRejectDialogOpen(false);
      setRejectionReason('');
      if (tabValue === 0) {
        fetchKYCData();
      } else {
        fetchKYBData();
      }
    } catch (error) {
      console.error('Error rejecting:', error);
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
          KYC / KYB Verification
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Review and manage user verification documents
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Typography color="white" variant="body2" sx={{ mb: 1 }}>
                KYC Pending
              </Typography>
              <Typography color="white" variant="h5" sx={{ fontWeight: 700 }}>
                {stats.kycPending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent>
              <Typography color="white" variant="body2" sx={{ mb: 1 }}>
                KYC Approved
              </Typography>
              <Typography color="white" variant="h5" sx={{ fontWeight: 700 }}>
                {stats.kycApproved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent>
              <Typography color="white" variant="body2" sx={{ mb: 1 }}>
                KYB Pending
              </Typography>
              <Typography color="white" variant="h5" sx={{ fontWeight: 700 }}>
                {stats.kybPending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CardContent>
              <Typography color="white" variant="body2" sx={{ mb: 1 }}>
                KYB Approved
              </Typography>
              <Typography color="white" variant="h5" sx={{ fontWeight: 700 }}>
                {stats.kybApproved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="KYC Verification" />
          <Tab label="KYB Verification" />
        </Tabs>
      </Box>

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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
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
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="under_review">Under Review</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KYC Tab */}
      <TabPanel value={tabValue} index={0}>
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
                    <TableCell sx={{ fontWeight: 700 }}>ID Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Submitted</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kycData.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.userName}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.userEmail}</TableCell>
                      <TableCell>{item.identificationType}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          color={statusColors[item.status]}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(item.submittedAt)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => {
                              setSelectedItem(item);
                              setViewDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                          {item.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleApprove(item._id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => {
                                  setSelectedItem(item);
                                  setRejectDialogOpen(true);
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
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
                  onChange={(e, value) => setPage(value)}
                />
              </Box>
            </>
          )}
        </TableContainer>
      </TabPanel>

      {/* KYB Tab */}
      <TabPanel value={tabValue} index={1}>
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
                    <TableCell sx={{ fontWeight: 700 }}>Business Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Industry</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Submitted</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kybData.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.businessLegalName}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.businessEmail}</TableCell>
                      <TableCell>{item.industryType}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          color={statusColors[item.status]}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(item.submittedAt)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => {
                              setSelectedItem(item);
                              setViewDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                          {item.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleApprove(item._id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => {
                                  setSelectedItem(item);
                                  setRejectDialogOpen(true);
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
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
                  onChange={(e, value) => setPage(value)}
                />
              </Box>
            </>
          )}
        </TableContainer>
      </TabPanel>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {tabValue === 0 ? (
                <>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body2">{(selectedItem as KYCData).userName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body2">{(selectedItem as KYCData).userEmail}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Nationality
                    </Typography>
                    <Typography variant="body2">{(selectedItem as KYCData).nationality}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      ID Number
                    </Typography>
                    <Typography variant="body2">
                      {(selectedItem as KYCData).personalIdentificationNumber}
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Business Name
                    </Typography>
                    <Typography variant="body2">{(selectedItem as KYBData).businessLegalName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body2">{(selectedItem as KYBData).businessEmail}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Industry
                    </Typography>
                    <Typography variant="body2">{(selectedItem as KYBData).industryType}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Employees
                    </Typography>
                    <Typography variant="body2">{(selectedItem as KYBData).numberOfEmployees}</Typography>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Submission</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReject} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
