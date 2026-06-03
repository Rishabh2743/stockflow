import React from 'react';
import { Link } from 'react-router-dom';
import { SignupForm } from '../components/SignupForm';
import { Package } from 'lucide-react';

const SignupPage: React.FC = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

    <div className="w-full max-w-md animate-slide-up">
      <div className="flex items-center gap-3 mb-8 justify-center">
        <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center">
          <Package size={20} className="text-brand-400" />
        </div>
        <span className="text-xl font-semibold text-white tracking-tight">StockFlow</span>
      </div>

      <div className="card p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-white mb-1.5">Create account</h1>
          <p className="text-sm text-slate-400">Start managing your inventory in minutes</p>
        </div>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
);

export default SignupPage;