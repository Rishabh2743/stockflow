import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productApi } from '../api/productApi';
import { ProductForm } from '../components/ProductForm';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Loader } from '../../../shared/components/Loader';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { PackageOpen } from 'lucide-react';
import type { ProductFormValues } from '../schemas/productSchema';

const EditProductPage: React.FC = () => {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: QUERY_KEYS.product(id!),
    queryFn:  () => productApi.getById(id!),
    enabled:  !!id,
  });

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) => productApi.update(id!, values as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.product(id!) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Product updated');
      navigate('/products');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to update product'),
  });

  if (isLoading) return <Loader />;
  if (!product)  return <div className="p-6 text-sm text-red-400">Product not found.</div>;

  return (
    <div className="p-6 max-w-2xl animate-fade-in">
      <PageHeader title="Edit Product" subtitle={product.sku} icon={PackageOpen} showBack />
      <div className="card p-6 mt-5">
        <ProductForm defaultValues={product} onSubmit={v => mutation.mutateAsync(v)} submitLabel="Save Changes" />
      </div>
    </div>
  );
};

export default EditProductPage;