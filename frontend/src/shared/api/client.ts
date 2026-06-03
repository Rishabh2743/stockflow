import axios, { AxiosError, AxiosResponse } from 'axios';
import type { ApiError } from '../types/api.types';

const client = axios.create({
  baseURL:         import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers:         { 'Content-Type': 'application/json' },
  timeout:         10_000,
});

// Response interceptor — unwrap data or throw normalized error
client.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError<ApiError>) => {
    return Promise.reject(err);
  }
);

export default client;