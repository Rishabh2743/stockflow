import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { productApi } from '../api/productApi';
import { ProductTable } from '../components/ProductTable';
import { DeleteProductDialog } from '../components/DeleteProductDialog';
import { AdjustStockDialog } from '../components/AdjustStockDialog';
import { PageHeader } from '../../../shared/components/PageHeader';
import { SearchInput } from '../../../shared/components/SearchInput';
import { Loader } from '../../../shared/components/Loader';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import type { Product } from '../../../shared/types/product.types';
import { Package } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const navigate      = useNavigate();
  const queryClient   = useQueryClient();
  const [search, setSearch]   = useState('');
  const [page,   setPage]     = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.products({ search, page }),
    queryFn:  () => productApi.getAll({ search, page, limit: 15 }),
    placeholderData: prev => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success('Product deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const adjustMutation = useMutation({
    mutationFn: ({ id, adjustment, note }: { id: string; adjustment: number; note?: string }) =>
      productApi.adjustStock(id, { adjustment, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success('Stock adjusted');
      setAdjustTarget(null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to adjust stock'),
  });

  const meta = data?.meta;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <PageHeader title="Products" subtitle="Manage your inventory" icon={Package}>
        <button onClick={() => navigate('/products/new')} className="btn-primary">
          <Plus size={15} /> Add Product
        </button>
      </PageHeader>

      <div className="flex items-center gap-3">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search by name or SKU..." />
        {meta && <p className="text-xs text-slate-500 shrink-0">{meta.total} product{meta.total !== 1 ? 's' : ''}</p>}
      </div>

      {isLoading
        ? <Loader />
        : <ProductTable
            products={data?.products ?? []}
            globalThreshold={5}
            onDelete={setDeleteTarget}
            onAdjust={setAdjustTarget}
          />}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-secondary text-xs">Previous</button>
          <span className="text-xs text-slate-500">Page {meta.page} of {meta.totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === meta.totalPages} className="btn-secondary text-xs">Next</button>
        </div>
      )}

      <DeleteProductDialog
        product={deleteTarget}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
      <AdjustStockDialog
        product={adjustTarget}
        isSubmitting={adjustMutation.isPending}
        onConfirm={(adjustment, note) => adjustTarget && adjustMutation.mutate({ id: adjustTarget.id, adjustment, note })}
        onCancel={() => setAdjustTarget(null)}
      />
    </div>
  );
};

export default ProductsPage;