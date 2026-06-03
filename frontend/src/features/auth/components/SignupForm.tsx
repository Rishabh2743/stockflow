import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signupSchema, type SignupFormValues } from '../schemas/signupSchema';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import type { ApiError } from '../../../shared/types/api.types';

export const SignupForm: React.FC = () => {
  const { setUser }    = useAuth();
  const navigate       = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const res = await authApi.signup(values);
      setUser(res.data.user);
      toast.success('Account created! Welcome to StockFlow.');
      navigate('/');
    } catch (err) {
      const e = err as AxiosError<ApiError>;
      const msg = e.response?.data?.message ?? 'Signup failed. Please try again.';
      setError('root', { message: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {errors.root && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm animate-fade-in">
          <AlertCircle size={15} className="shrink-0" />
          {errors.root.message}
        </div>
      )}

      <div>
        <label className="label">Organization Name</label>
        <input
          {...register('organizationName')}
          placeholder="Acme Store"
          className={`input ${errors.organizationName ? 'border-red-500/50' : ''}`}
        />
        {errors.organizationName && <p className="mt-1.5 text-xs text-red-400">{errors.organizationName.message}</p>}
      </div>

      <div>
        <label className="label">Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@company.com"
          className={`input ${errors.email ? 'border-red-500/50' : ''}`}
          autoComplete="email"
        />
        {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div>
        <label className="label">Password</label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPw ? 'text' : 'password'}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            className={`input pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
            autoComplete="new-password"
          />
          <button type="button" onClick={() => setShowPw(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3">
        {isSubmitting
          ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span>
          : <><UserPlus size={15} />Create account</>}
      </button>
    </form>
  );
};