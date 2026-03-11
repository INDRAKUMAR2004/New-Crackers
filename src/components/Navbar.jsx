import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Menu, X, ShoppingCart, Search, ChevronRight } from 'lucide-react';
import logo from '/src/assets/dheeran_logo.png';
import { useCart } from '../context/CartContext';
import CartPopup from '../context/CartPopup';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search text

  const { cart, openCart, setOpenCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate(); // Hook to change pages

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  const totalQty = cart.reduce((a, b) => a + b.qty, 0);

  // Function to handle the actual search
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      // Navigate to products page with search query
      navigate(`/products?search=${searchTerm}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] py-2'
            : 'bg-white border-b border-slate-100/50 py-3 md:py-4'
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-500 via-red-500 to-amber-500" />

        <div className="container-custom mx-auto flex items-center justify-between px-4 md:px-8 relative">
          <Link
            to="/"
            className={`flex items-center gap-2 md:gap-3 group z-50 transition-opacity duration-300 ${
              searchOpen
                ? 'opacity-0 pointer-events-none md:opacity-100'
                : 'opacity-100'
            }`}
          >
            <img
              src={logo}
              alt="Logo"
              className="w-12 h-12 md:w-20 md:h-20 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-black text-slate-900">
                DHEERAN
              </span>
              <span className="text-[0.65rem] md:text-base font-bold text-red-600 tracking-[0.2em]">
                CRACKERS
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-full">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-red-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4 z-50">
            {/* WORKING SEARCH BAR */}
            <div
              className={`relative flex items-center transition-all duration-500 ${searchOpen ? 'w-48 md:w-64' : 'w-10 md:w-11'}`}
            >
              <div
                className={`flex items-center w-full bg-slate-100 rounded-full overflow-hidden transition-all duration-300 border ${searchOpen ? 'border-red-500 bg-white shadow-sm' : 'border-transparent'}`}
              >
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="flex items-center justify-center min-w-[40px] h-10 text-slate-600 hover:text-red-600"
                >
                  {searchOpen ? <X size={18} /> : <Search size={20} />}
                </button>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update state
                  onKeyDown={handleSearch} // Trigger search on Enter
                  className={`w-full bg-transparent border-none outline-none ring-0 focus:ring-0 text-black text-sm font-bold transition-all h-10 ${searchOpen ? 'opacity-100 px-2' : 'opacity-0 w-0'}`}
                  autoFocus={searchOpen}
                />
              </div>
            </div>

            <button
              onClick={() => setOpenCart(true)}
              className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-slate-50 text-slate-700 hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
            >
              <ShoppingCart size={20} />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center rounded-full border-2 border-white">
                  {totalQty}
                </span>
              )}
            </button>

            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        <div
          className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] transition-opacity duration-500 lg:hidden ${
            open
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[1000] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden transform ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-red-600"></div>

          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <span className="font-black text-2xl text-slate-900 tracking-tight">
              MENU
            </span>
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between p-4 rounded-xl font-bold transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <span>{item.name}</span>
                <ChevronRight size={18} />
              </NavLink>
            ))}
          </div>

          {/* Drawer Footer - Cart Primary Action */}
          <div className="absolute bottom-0 w-full p-4 bg-white border-t border-slate-100">
            <button
              onClick={() => {
                setOpen(false);
                setOpenCart(true);
              }}
              className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-red-600 text-white shadow-lg font-bold"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} />
                <span>Go to Cart</span>
              </div>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {totalQty} Items
              </span>
            </button>
          </div>
        </div>
      </header>

      {openCart && <CartPopup />}
    </>
  );
};

export default Navbar;
