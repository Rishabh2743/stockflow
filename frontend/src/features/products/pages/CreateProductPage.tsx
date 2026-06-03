import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productApi } from '../api/productApi';
import { ProductForm } from '../components/ProductForm';
import { PageHeader } from '../../../shared/components/PageHeader';
import { PackagePlus } from 'lucide-react';
import type { ProductFormValues } from '../schemas/productSchema';

const CreateProductPage: React.FC = () => {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();

  const mutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Product created successfully');
      navigate('/products');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to create product'),
  });

  const onSubmit = async (values: ProductFormValues) => {
    await mutation.mutateAsync(values as any);
  };

  return (
    <div className="p-6 max-w-2xl animate-fade-in">
      <PageHeader title="Add Product" subtitle="Create a new inventory item" icon={PackagePlus} showBack />
      <div className="card p-6 mt-5">
        <ProductForm onSubmit={onSubmit} submitLabel="Create Product" />
      </div>
    </div>
  );
};

export default CreateProductPage;