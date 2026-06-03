export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}