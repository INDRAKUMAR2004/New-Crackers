import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import NavbarAdmin from './NavbarAdmin';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#172b4d',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '6px',
            padding: '10px 16px',
          },
          success: { style: { background: '#0078d4' } },
          error: { style: { background: '#de350b' } },
        }}
      />

      {/* Top Navbar */}
      <NavbarAdmin
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Spacer for fixed navbar */}
      <div className="h-[52px]"></div>

      <div className="flex relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setSidebarOpen}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-52px)] transition-all duration-200">
          <div className="p-6 max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
