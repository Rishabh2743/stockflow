import client from '../../../shared/api/client';
import type { ApiResponse, PaginationMeta } from '../../../shared/types/api.types';
import type { Product, CreateProductPayload, UpdateProductPayload, AdjustStockPayload, ProductFilters } from '../../../shared/types/product.types';

export const productApi = {
  getAll: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.page)   params.set('page',   String(filters.page));
    if (filters.limit)  params.set('limit',  String(filters.limit));
    return client.get<ApiResponse<Product[]>>(`/products?${params}`).then(r => ({
      products: r.data.data,
      meta:     r.data.meta as PaginationMeta,
    }));
  },

  getById: (id: string) =>
    client.get<ApiResponse<Product>>(`/products/${id}`).then(r => r.data.data),

  create: (data: CreateProductPayload) =>
    client.post<ApiResponse<Product>>('/products', data).then(r => r.data.data),

  update: (id: string, data: UpdateProductPayload) =>
    client.put<ApiResponse<Product>>(`/products/${id}`, data).then(r => r.data.data),

  delete: (id: string) =>
    client.delete<ApiResponse<null>>(`/products/${id}`).then(r => r.data),

  adjustStock: (id: string, data: AdjustStockPayload) =>
    client.patch<ApiResponse<Product>>(`/products/${id}/adjust-stock`, data).then(r => r.data.data),
};