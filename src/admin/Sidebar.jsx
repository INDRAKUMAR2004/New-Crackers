import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Tags,
  Images,
  Boxes,
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const menus = [
  {
    name: 'Dashboard',
    path: '/admin-dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: 'Products',
    icon: <Package size={18} />,
    isSubmenu: true,
    subItems: [
      {
        name: 'Add Product',
        path: '/admin/add-product',
        icon: <PlusCircle size={16} />,
      },
      {
        name: 'All Products',
        path: '/admin/products',
        icon: <ListChecks size={16} />,
      },
      {
        name: 'Inventory',
        path: '/admin/inventory',
        icon: <Boxes size={16} />,
      },
    ],
  },
  { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={18} /> },
  {
    name: 'Categories',
    path: '/admin/category-management',
    icon: <Tags size={18} />,
  },
  {
    name: 'Sliders',
    path: '/admin/slider-management',
    icon: <Images size={18} />,
  },
];

export default function Sidebar({ isOpen, setIsOpen, isMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({ Products: true });

  const toggleSubmenu = (name) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/admin-login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const sidebarClasses = `
    border-r border-[#dfe1e6] z-40 transition-all duration-200 bg-white
    ${
      isMobile
        ? 'fixed top-[52px] left-0 h-[calc(100vh-52px)]'
        : 'sticky top-[52px] h-[calc(100vh-52px)] shrink-0'
    }
    ${
      isOpen
        ? 'translate-x-0 w-[220px]'
        : `${isMobile ? '-translate-x-full' : 'w-[56px]'} lg:translate-x-0`
    }
  `;

  const overlayClasses = `
    fixed inset-0 bg-black/20 z-30 lg:hidden transition-opacity duration-200
    ${isOpen && isMobile ? 'opacity-100 visible' : 'opacity-0 invisible'}
  `;

  return (
    <>
      <div className={overlayClasses} onClick={() => setIsOpen(false)} />

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Navigation */}
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
            {menus.map((item, index) => {
              const isSubmenu = item.isSubmenu;
              const isActive = location.pathname === item.path;
              const isChildActive =
                isSubmenu &&
                item.subItems.some((sub) => location.pathname === sub.path);
              const isExpanded = expandedMenus[item.name];

              if (isSubmenu) {
                return (
                  <div key={index}>
                    <button
                      onClick={() =>
                        !isOpen ? setIsOpen(true) : toggleSubmenu(item.name)
                      }
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded text-[13px] font-medium transition-colors
                        ${isChildActive ? 'bg-[#e9f2ff] text-[#0078d4]' : 'text-[#42526e] hover:bg-[#f4f5f7]'}
                        ${!isOpen && 'justify-center'}
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={
                            isChildActive ? 'text-[#0078d4]' : 'text-[#6b778c]'
                          }
                        >
                          {item.icon}
                        </span>
                        {isOpen && <span>{item.name}</span>}
                      </div>
                      {isOpen && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${isChildActive ? 'text-[#0078d4]' : 'text-[#a5adba]'}`}
                        />
                      )}
                    </button>

                    {/* Submenu */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ${isOpen && isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="ml-5 pl-3 border-l border-[#dfe1e6] space-y-0.5 py-1">
                        {item.subItems.map((sub) => {
                          const isSubActive = location.pathname === sub.path;
                          return (
                            <Link
                              key={sub.name}
                              to={sub.path}
                              onClick={() => isMobile && setIsOpen(false)}
                              className={`
                                flex items-center gap-2 px-2.5 py-1.5 rounded text-[13px] transition-colors
                                ${
                                  isSubActive
                                    ? 'text-[#0078d4] font-semibold bg-[#e9f2ff]'
                                    : 'text-[#6b778c] hover:text-[#172b4d] hover:bg-[#f4f5f7]'
                                }
                              `}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded text-[13px] font-medium transition-colors
                    ${!isOpen && 'justify-center'}
                    ${
                      isActive
                        ? 'bg-[#e9f2ff] text-[#0078d4]'
                        : 'text-[#42526e] hover:bg-[#f4f5f7]'
                    }
                  `}
                >
                  <span
                    className={isActive ? 'text-[#0078d4]' : 'text-[#6b778c]'}
                  >
                    {item.icon}
                  </span>
                  {isOpen && <span>{item.name}</span>}

                  {!isOpen && (
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#172b4d] text-white text-xs px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom: Logout */}
          <div className="p-2 border-t border-[#dfe1e6]">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-[13px] font-medium text-[#6b778c] hover:text-red-600 hover:bg-red-50 transition-colors ${!isOpen && 'justify-center'}`}
            >
              <LogOut size={18} />
              {isOpen && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
