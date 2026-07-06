"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartPopup from '../context/CartPopup';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  const { cart, openCart, setOpenCart } = useCart() as any;
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  const totalQty = (cart || []).reduce((a: any, b: any) => a + b.qty, 0);

  const handleSearch = (e: any) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      router.push(`/products?search=${searchTerm}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white ${
          scrolled
            ? 'shadow-sm border-b border-gray-100'
            : 'border-b border-transparent'
        }`}
      >
        <div className="container-custom mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Dheeran <span className="text-accent">Crackers</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                    isActive
                      ? 'text-accent bg-gray-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className={`relative flex items-center transition-all duration-300 ${searchOpen ? 'w-48 md:w-56' : 'w-9'}`}
            >
              {searchOpen && (
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  autoFocus
                  className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-gray-500 transition-all"
                />
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`${searchOpen ? 'absolute left-2 top-1/2 -translate-y-1/2' : ''} w-9 h-9 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors`}
              >
                {searchOpen ? <X size={16} /> : <Search size={18} />}
              </button>
            </div>

            {/* Cart */}
            <button
              onClick={() => setOpenCart(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart size={18} />
              {mounted && totalQty > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {totalQty}
                </span>
              )}
            </button>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`fixed inset-0 bg-black/30 z-[999] transition-opacity duration-300 lg:hidden ${
            open
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white z-[1000] shadow-xl transition-transform duration-300 lg:hidden ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-3">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center px-4 py-3 rounded text-sm font-medium transition-colors mb-1 ${
                    isActive
                      ? 'text-accent bg-gray-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <button
              onClick={() => {
                setOpen(false);
                setOpenCart(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded font-medium text-sm hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={16} />
              View Cart ({mounted ? totalQty : 0})
            </button>
          </div>
        </div>
      </header>

      {openCart && <CartPopup />}
    </>
  );
};

export default Navbar;
