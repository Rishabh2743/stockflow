import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsApi } from '../api/settingsApi';
import { SettingsForm } from '../components/SettingsForm';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Loader } from '../../../shared/components/Loader';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { Settings as SettingsIcon } from 'lucide-react';
import type { SettingsFormValues } from '../schemas/settingsSchema';

const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn:  settingsApi.get,
  });

  const mutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success('Settings saved');
    },
    onError: () => toast.error('Failed to save settings'),
  });

  if (isLoading) return <Loader />;
  if (!data)     return <div className="p-6 text-sm text-red-400">Failed to load settings.</div>;

  return (
    <div className="p-6 max-w-xl animate-fade-in">
      <PageHeader title="Settings" subtitle={`Organization: ${data.name}`} icon={SettingsIcon} />
      <div className="card p-6 mt-5">
        <h2 className="text-sm font-medium text-slate-300 mb-5 pb-4 border-b border-surface-border">
          Inventory Defaults
        </h2>
        <SettingsForm settings={data} onSubmit={v => mutation.mutateAsync(v)} />
      </div>
    </div>
  );
};

export default SettingsPage;