import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { StatsGrid } from '../components/StatsGrid';
import { LowStockTable } from '../components/LowStockTable';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { Loader } from '../../../shared/components/Loader';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LayoutDashboard } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn:  dashboardApi.getSummary,
    refetchInterval: 60_000,
  });

  if (isLoading) return <Loader />;
  if (isError || !data) return (
    <div className="p-6 text-sm text-red-400">Failed to load dashboard. Please refresh.</div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <PageHeader title="Dashboard" subtitle="Your inventory at a glance" icon={LayoutDashboard} />
      <StatsGrid data={data} />
      <LowStockTable items={data.lowStockItems} />
    </div>
  );
};

export default DashboardPage;