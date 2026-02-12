import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';

export interface DashboardStats {
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
  activeSubscriptions: number;
  recentTransactions: any[];
  topUsers: any[];
}

export interface ChartData {
  userGrowth: Array<{ month: string; users: number }>;
  subscriptionTrend: Array<{ month: string; subscriptions: number }>;
  revenueData: Array<{ month: string; revenue: number }>;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/stats');
      return response.data as DashboardStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

export const useChartData = () => {
  return useQuery({
    queryKey: ['chartData'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/chart-data');
      return response.data as ChartData;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useUsersStats = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['usersStats', page, limit],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/users-stats', {
        params: { page, limit }
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubscriptionStats = () => {
  return useQuery({
    queryKey: ['subscriptionStats'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/subscription-stats');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useTransactionStats = () => {
  return useQuery({
    queryKey: ['transactionStats'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/transaction-stats');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
