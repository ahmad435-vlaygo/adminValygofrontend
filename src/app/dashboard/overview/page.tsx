'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, CircularProgress, Typography } from '@mui/material';
import { PageHeader } from '@/components/ui';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import apiClient from '@/lib/api/apiClient';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  businessUsers: number;
  individualUsers: number;
  activeSubscriptions: number;
  kycApproved: number;
  kycPending: number;
}

interface TransactionStats {
  totalTransactions: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  totalVolume: number;
  totalFees: number;
}

interface SubscriptionStats {
  active: number;
  pastDue: number;
  suspended: number;
  canceled: number;
  total: number;
  totalMRR: number;
}

const StatCard = ({
  label,
  value,
  subtext,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  accent?: string;
}) => (
  <Card
    sx={{
      background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.08) 0%, rgba(0, 212, 170, 0.04) 100%)',
      border: '1px solid rgba(0, 212, 170, 0.15)',
      borderRadius: '12px',
      p: 3,
      transition: 'all 0.3s ease',
      '&:hover': {
        border: '1px solid rgba(0, 212, 170, 0.4)',
        boxShadow: '0 0 20px rgba(0, 212, 170, 0.15)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    <Typography
      sx={{
        color: accent || '#00d4aa',
        fontSize: '13px',
        fontWeight: 700,
        mb: 1,
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        opacity: 0.9,
      }}
    >
      {label}
    </Typography>
    <Typography sx={{ color: '#fff', fontSize: '28px', fontWeight: 800, mb: subtext ? 1 : 0 }}>
      {value}
    </Typography>
    {subtext ? (
      <Typography sx={{ color: '#b0b8d4', fontSize: '12px' }}>{subtext}</Typography>
    ) : null}
  </Card>
);

const chartTooltipStyle = {
  contentStyle: {
    background: '#141829',
    border: '1px solid rgba(0, 212, 170, 0.2)',
    borderRadius: 8,
  },
} as const;

const OverviewPage = () => {
  const [userStats, setUserStats] = useState<DashboardStats | null>(null);
  const [transactionStats, setTransactionStats] = useState<TransactionStats | null>(null);
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/dashboard/overview-stats');
        const d = res.data?.data ?? res.data;
        if (d) {
          setUserStats(d.userStats ?? null);
          setTransactionStats(d.transactionStats ?? null);
          setSubscriptionStats(d.subscriptionStats ?? null);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Placeholder until admin-backend exposes time-series endpoints used for these charts.
  const chartData = [
    { name: 'Jan', users: 0, transactions: 0 },
    { name: 'Feb', users: 0, transactions: 0 },
    { name: 'Mar', users: 0, transactions: 0 },
    { name: 'Apr', users: 0, transactions: 0 },
    { name: 'May', users: 0, transactions: 0 },
    { name: 'Jun', users: 0, transactions: 0 },
  ];

  const subscriptionData = [
    { name: 'Active', value: subscriptionStats?.active || 0, fill: '#00d4aa' },
    { name: 'Past Due', value: subscriptionStats?.pastDue || 0, fill: '#f59e0b' },
    { name: 'Suspended', value: subscriptionStats?.suspended || 0, fill: '#ef4444' },
    { name: 'Canceled', value: subscriptionStats?.canceled || 0, fill: '#6b7280' },
  ];

  const userTypeData = [
    { name: 'Individual', value: userStats?.individualUsers || 0, fill: '#00d4aa' },
    { name: 'Business', value: userStats?.businessUsers || 0, fill: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
        <CircularProgress sx={{ color: '#00d4aa' }} />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Overview" subtitle="Platform stats and charts at a glance." />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          label="Total Users"
          value={userStats?.totalUsers?.toLocaleString() ?? '—'}
          subtext={`${userStats?.activeUsers?.toLocaleString() ?? 0} active`}
        />
        <StatCard
          label="Active Subscriptions"
          value={subscriptionStats?.active?.toLocaleString() ?? '—'}
          subtext={`MRR: $${(subscriptionStats?.totalMRR ?? 0).toFixed(2)}`}
        />
        <StatCard
          label="Total Transactions"
          value={transactionStats?.totalTransactions?.toLocaleString() ?? '—'}
          subtext={`Volume: $${(transactionStats?.totalVolume ?? 0).toFixed(2)}`}
        />
        <StatCard
          label="KYC Approved"
          value={userStats?.kycApproved?.toLocaleString() ?? '—'}
          subtext={`Pending: ${userStats?.kycPending?.toLocaleString() ?? 0}`}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, rgba(0, 212, 170, 0.02) 100%)',
            border: '1px solid rgba(0, 212, 170, 0.15)',
            borderRadius: '12px',
            p: 3,
          }}
        >
          <Typography sx={{ color: '#fff', fontSize: '16px', fontWeight: 700, mb: 2 }}>
            Growth Trend
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="rgba(0, 212, 170, 0.12)" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#b0b8d4" />
              <YAxis stroke="#b0b8d4" />
              <Tooltip {...chartTooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#00d4aa" />
              <Line type="monotone" dataKey="transactions" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, rgba(0, 212, 170, 0.02) 100%)',
            border: '1px solid rgba(0, 212, 170, 0.15)',
            borderRadius: '12px',
            p: 3,
          }}
        >
          <Typography sx={{ color: '#fff', fontSize: '16px', fontWeight: 700, mb: 2 }}>
            Subscription Status
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={subscriptionData} cx="50%" cy="50%" outerRadius={90} dataKey="value" labelLine={false}>
                {subscriptionData.map((entry, index) => (
                  <Cell key={`sub-cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, rgba(0, 212, 170, 0.02) 100%)',
            border: '1px solid rgba(0, 212, 170, 0.15)',
            borderRadius: '12px',
            p: 3,
          }}
        >
          <Typography sx={{ color: '#fff', fontSize: '16px', fontWeight: 700, mb: 2 }}>
            Monthly Performance
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="rgba(0, 212, 170, 0.12)" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#b0b8d4" />
              <YAxis stroke="#b0b8d4" />
              <Tooltip {...chartTooltipStyle} />
              <Legend />
              <Bar dataKey="users" fill="#00d4aa" />
              <Bar dataKey="transactions" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, rgba(0, 212, 170, 0.02) 100%)',
            border: '1px solid rgba(0, 212, 170, 0.15)',
            borderRadius: '12px',
            p: 3,
          }}
        >
          <Typography sx={{ color: '#fff', fontSize: '16px', fontWeight: 700, mb: 2 }}>
            User Type Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={userTypeData} cx="50%" cy="50%" outerRadius={90} dataKey="value" labelLine={false}>
                {userTypeData.map((entry, index) => (
                  <Cell key={`user-type-cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Box>
    </Box>
  );
};

export default OverviewPage;
