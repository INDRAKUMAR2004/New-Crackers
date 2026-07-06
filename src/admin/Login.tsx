"use client";
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/admin-dashboard');
    } catch (err) {
      const code = err.code;
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-credential'
      ) {
        toast.error('Invalid email or password');
      } else if (code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Try again later.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f4f5f7] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0078d4] rounded-xl mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-[22px] font-semibold text-[#172b4d]">
            Dheeran Admin
          </h1>
          <p className="text-sm text-[#6b778c] mt-1">
            Sign in to your admin panel
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-lg border border-[#dfe1e6] shadow-sm p-8"
        >
          {/* Email */}
          <div className="mb-5">
            <label className="block text-[13px] font-medium text-[#172b4d] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-[#fafbfc] border border-[#dfe1e6] rounded-sm text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 transition-all"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-[#172b4d] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 text-sm bg-[#fafbfc] border border-[#dfe1e6] rounded-[4px] text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b778c] hover:text-[#172b4d]"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0078d4] hover:bg-[#106ebe] disabled:opacity-60 disabled:cursor-not-allowed py-2.5 rounded-[4px] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs mt-6 text-[#6b778c]">
          © {new Date().getFullYear()} Dheeran Crackers — Admin Panel
        </p>
      </div>
    </div>
  );
}
