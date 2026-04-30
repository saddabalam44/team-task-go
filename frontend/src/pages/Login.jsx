import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../lib/api.js';
import { motion } from 'motion/react';
import { LogIn, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#c8ebd6] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e3f5ea] text-[#3eb368] mb-4">
              <LogIn size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-[#f4fbfa] focus:bg-white focus:outline-none focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/10 transition-all text-gray-800 placeholder-gray-400 font-medium"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-[#f4fbfa] focus:bg-white focus:outline-none focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/10 transition-all text-gray-800 placeholder-gray-400 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3eb368] hover:bg-[#349e5b] active:scale-[0.98] text-white font-bold text-lg py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-[0_8px_20px_rgba(62,179,104,0.3)] hover:shadow-[0_12px_25px_rgba(62,179,104,0.4)]"
            >
              {loading ? 'Verifying...' : 'Log In'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#3eb368] font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
