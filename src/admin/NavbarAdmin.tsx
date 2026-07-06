"use client";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Menu, X, LogOut, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NavbarAdmin({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/admin-login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="h-[52px] bg-white border-b border-[#dfe1e6] flex items-center justify-between px-5 fixed top-0 left-0 right-0 z-50">
      {/* Left: Brand & Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded hover:bg-[#f4f5f7] text-[#6b778c] hover:text-[#172b4d] transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0078d4] rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <h1 className="text-[15px] font-semibold text-[#172b4d] hidden md:block">
            Dheeran <span className="text-[#0078d4]">Admin</span>
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded hover:bg-[#f4f5f7] text-[#6b778c] relative">
          <Bell size={18} />
        </button>

        {user && (
          <span className="text-xs text-[#6b778c] hidden sm:block mr-2">
            {user.email}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#6b778c] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
