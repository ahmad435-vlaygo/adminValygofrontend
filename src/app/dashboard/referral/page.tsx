'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import apiClient from '@/lib/api/apiClient';
import { PageHeader } from '@/components/ui';

interface SalesData {
  onboardedUsers: number;
  totalSubscriptions: number;
  monthlyNewSubscriptions: number;
  lastMonthNewSubscriptions: number;
  referralCode: string;
  downlines: Array<{
    name: string;
    email: string;
    onboardedUsers?: number;
    totalSubscriptions?: number;
    status?: string;
  }>;
}

const COLORS = ['#00C2FF', '#00d4aa', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function ReferralDashboardPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [salesData, setSalesData] = useState<SalesData>({
    onboardedUsers: 0,
    totalSubscriptions: 0,
    monthlyNewSubscriptions: 0,
    lastMonthNewSubscriptions: 0,
    referralCode: '',
    downlines: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'sales_team') {
      router.replace('/dashboard');
      return;
    }
    fetchSalesData();
  }, [user, router]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/sales-team/dashboard');
      const data = response.data?.data ?? response.data;
      setSalesData({
        onboardedUsers: data?.onboardedUsers ?? 0,
        totalSubscriptions: data?.totalSubscriptions ?? 0,
        monthlyNewSubscriptions: data?.monthlyNewSubscriptions ?? 0,
        lastMonthNewSubscriptions: data?.lastMonthNewSubscriptions ?? 0,
        referralCode: data?.referralCode ?? '',
        downlines: data?.downlines ?? [],
      });
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (salesData.referralCode) {
      navigator.clipboard.writeText(salesData.referralCode);
    }
  };

  const downloadReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      ...salesData,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referral-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const barChartData = [
    { name: 'Onboarded', value: salesData.onboardedUsers, fill: '#00C2FF' },
    { name: 'Total Subs', value: salesData.totalSubscriptions, fill: '#00d4aa' },
    { name: 'This Month', value: salesData.monthlyNewSubscriptions, fill: '#8b5cf6' },
    { name: 'Last Month', value: salesData.lastMonthNewSubscriptions, fill: '#f59e0b' },
  ];

  const pieData = [
    { name: 'Onboarded users', value: salesData.onboardedUsers, fill: '#00C2FF' },
    { name: 'Subscriptions', value: salesData.totalSubscriptions, fill: '#00d4aa' },
  ].filter((d) => d.value > 0);

  const conversionRate =
    salesData.onboardedUsers > 0
      ? ((salesData.totalSubscriptions / salesData.onboardedUsers) * 100).toFixed(1)
      : '0';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 420 }}>
        <CircularProgress sx={{ color: '#00C2FF' }} size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <PageHeader
          title="Referral Dashboard"
          subtitle="View your onboarding performance and referral metrics"
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadReport}
            sx={{
              color: '#00C2FF',
              borderColor: 'rgba(0, 194, 255, 0.5)',
              textTransform: 'none',
              '&:hover': { borderColor: '#00C2FF', background: 'rgba(0, 194, 255, 0.08)' },
            }}
          >
            Download Report
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(0, 194, 255, 0.12) 0%, rgba(0, 194, 255, 0.04) 100%)',
            border: '1px solid rgba(0, 194, 255, 0.3)',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <PeopleIcon sx={{ color: '#00C2FF', fontSize: 32, mb: 1 }} />
            <Typography sx={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700 }}>
              {salesData.onboardedUsers}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              Onboarded Users
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.12) 0%, rgba(0, 212, 170, 0.04) 100%)',
            border: '1px solid rgba(0, 212, 170, 0.3)',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <TrendingUpIcon sx={{ color: '#00d4aa', fontSize: 32, mb: 1 }} />
            <Typography sx={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700 }}>
              {salesData.totalSubscriptions}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              Total Subscriptions
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.04) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Typography sx={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700 }}>
              {salesData.monthlyNewSubscriptions}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              New This Month
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.04) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Typography sx={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700 }}>
              {salesData.lastMonthNewSubscriptions}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              New Last Month
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, rgba(11, 15, 51, 0.9) 0%, rgba(8, 12, 40, 0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>Performance Overview</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barChartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#0b0f33',
                    border: '1px solid rgba(0, 194, 255, 0.3)',
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#00C2FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, rgba(11, 15, 51, 0.9) 0%, rgba(8, 12, 40, 0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>Distribution</Typography>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#0b0f33',
                      border: '1px solid rgba(0, 194, 255, 0.3)',
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No data yet</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, rgba(11, 15, 51, 0.9) 0%, rgba(8, 12, 40, 0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1.5 }}>Your Referral Code</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', mb: 2 }}>
              Share this code with potential customers
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 1,
                border: '1px solid rgba(0, 194, 255, 0.3)',
              }}
            >
              <Typography sx={{ fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 600, color: '#00C2FF' }}>
                {salesData.referralCode || '—'}
              </Typography>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={copyReferralCode}
                sx={{ color: '#00C2FF', textTransform: 'none' }}
              >
                Copy
              </Button>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, rgba(11, 15, 51, 0.9) 0%, rgba(8, 12, 40, 0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>Performance Summary</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Conversion Rate</Typography>
                <Typography sx={{ color: '#00C2FF', fontWeight: 600 }}>{conversionRate}%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Subscriptions per User</Typography>
                <Typography sx={{ color: '#00C2FF', fontWeight: 600 }}>
                  {(salesData.totalSubscriptions / Math.max(salesData.onboardedUsers, 1)).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{
          mt: 3,
          background: 'linear-gradient(145deg, rgba(11, 15, 51, 0.9) 0%, rgba(8, 12, 40, 0.95) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 2,
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>
            Your Downlines (5 Direct)
          </Typography>
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Onboarded
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Subscriptions
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.downlines?.length > 0 ? (
                salesData.downlines.map((d: any, idx: number) => (
                  <TableRow key={idx} sx={{ '&:hover': { background: 'rgba(255,255,255,0.04)' } }}>
                    <TableCell sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.06)' }}>{d.name ?? '—'}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}>{d.email ?? '—'}</TableCell>
                    <TableCell sx={{ color: '#00C2FF', fontWeight: 600, borderColor: 'rgba(255,255,255,0.06)' }}>
                      {d.onboardedUsers ?? 0}
                    </TableCell>
                    <TableCell sx={{ color: '#00C2FF', fontWeight: 600, borderColor: 'rgba(255,255,255,0.06)' }}>
                      {d.totalSubscriptions ?? 0}
                    </TableCell>
                    <TableCell sx={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <Chip
                        label={d.status ?? 'active'}
                        size="small"
                        sx={{
                          background: (d.status ?? 'active') === 'active' ? 'rgba(0, 194, 255, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                          color: (d.status ?? 'active') === 'active' ? '#00C2FF' : '#FF6B6B',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 4, color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
                    No downlines yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
