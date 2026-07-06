"use client";
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f5f7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#0078d4] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-[#6b778c]">Loading...</p>
        </div>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/admin-login" replace />;
}
