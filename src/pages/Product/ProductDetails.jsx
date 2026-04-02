import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  ShoppingCart,
  Truck,
  Star,
  ChevronRight,
  Minus,
  Plus,
  Zap,
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState('');

  const currentStock = Number(product?.stock) || 0;
  const isOutOfStock = Boolean(product?.outOfStock) || currentStock <= 0;

  useEffect(() => {
    const fetchProduct = async () => {
      const directSnap = await getDoc(doc(db, 'products', id));
      if (directSnap.exists()) {
        const data = { id: directSnap.id, ...directSnap.data() };
        setProduct(data);
        setActiveImg(data.image);
        fetchRelated(data.category, data.id);
        return;
      }

      const bySlugQuery = query(
        collection(db, 'products'),
        where('slug', '==', id),
        limit(1)
      );
      const bySlugSnap = await getDocs(bySlugQuery);
      if (!bySlugSnap.empty) {
        const first = bySlugSnap.docs[0];
        const data = { id: first.id, ...first.data() };
        setProduct(data);
        setActiveImg(data.image);
        fetchRelated(data.category, data.id);
      }
    };
    fetchProduct();
    scrollTo(0, 0);
  }, [id]);

  const fetchRelated = async (category, currentId) => {
    const q = query(
      collection(db, 'products'),
      where('category', '==', category)
    );
    const snap = await getDocs(q);
    const items = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => p.id !== currentId);
    setRelated(items.slice(0, 6));
  };

  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => (q > 1 ? q - 1 : 1));
  const add = async () => {
    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    await addToCart({ ...product, qty });
    toast.success('Added to cart');
  };

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-accent rounded-full animate-spin" />
      </div>
    );

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white pt-16 pb-28 md:pb-16">
      <div className="container-custom mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-400 py-4 gap-1">
          <span
            className="hover:text-accent cursor-pointer"
            onClick={() => navigate('/')}
          >
            Home
          </span>
          <ChevronRight size={14} />
          <span
            className="hover:text-accent cursor-pointer"
            onClick={() => navigate('/products')}
          >
            Products
          </span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT COLUMN - IMAGES */}
          <div className="h-fit lg:sticky lg:top-20 space-y-4">
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
              {discount > 0 && (
                <span className="absolute top-3 left-3 z-10 bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded">
                  {discount}% OFF
                </span>
              )}
              {product.tag && (
                <span className="absolute top-3 right-3 z-10 bg-gray-900 text-white text-xs font-medium px-2.5 py-1 rounded">
                  {product.tag}
                </span>
              )}
              <img
                src={activeImg}
                className="w-full h-full object-contain p-6"
                alt={product.name}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {[product.image, ...(product.images || [])].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`shrink-0 w-16 h-16 rounded-lg border overflow-hidden transition-colors ${
                    activeImg === img
                      ? 'border-accent'
                      : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - DETAILS */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
              {product.productCode && (
                <span className="bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-gray-500 text-xs">
                  Code:{' '}
                  <strong className="text-gray-900">
                    {product.productCode}
                  </strong>
                </span>
              )}
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} fill="currentColor" />
                <span className="text-gray-900 font-semibold text-xs">
                  {product.rating || '4.8'}
                </span>
                <span className="text-gray-400 text-xs">
                  ({product.reviewCount || 120} reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6">
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                {product.mrp && (
                  <div className="flex items-center gap-2 pb-1">
                    <span className="text-gray-400 text-lg line-through">
                      ₹{product.mrp}
                    </span>
                    <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded">
                      Save ₹{product.mrp - product.price}
                    </span>
                  </div>
                )}
              </div>
              {isOutOfStock && (
                <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  Out of stock
                </div>
              )}
              <div className="h-px bg-gray-200 my-4" />
              {currentStock > 0 && (
                <p className="text-xs font-medium text-green-700 mb-3">
                  Stock: {currentStock}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-light text-accent flex items-center justify-center">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Fast Delivery
                    </p>
                    <p className="text-[11px] text-gray-400">2-4 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Quality Check
                    </p>
                    <p className="text-[11px] text-gray-400">Certified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls (Hidden on Mobile) */}
            <div className="hidden md:flex gap-3 mb-8">
              {!isOutOfStock && (
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={dec}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900">
                    {qty}
                  </span>
                  <button
                    onClick={inc}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
              <button
                onClick={add}
                disabled={isOutOfStock}
                className={`flex-1 font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-brand-dark'
                }`}
              >
                <ShoppingCart size={18} />
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>

            {/* Info Tabs */}
            <div>
              <div className="flex gap-6 border-b border-gray-100 mb-4">
                {['description', 'highlights', 'safety'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-3 text-sm font-medium capitalize relative transition-colors ${
                      tab === t
                        ? 'text-accent'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {t}
                    {tab === t && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-t" />
                    )}
                  </button>
                ))}
              </div>
              <div className="text-gray-600 text-sm leading-relaxed min-h-[120px]">
                {tab === 'description' && (
                  <p>
                    {product.description ||
                      'Premium high-quality product designed for the best experience.'}
                  </p>
                )}
                {tab === 'highlights' && (
                  <ul className="space-y-2">
                    {product.highlights ? (
                      product.highlights.split(',').map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Zap
                            size={14}
                            className="text-accent mt-0.5 shrink-0"
                          />
                          <span>{h.trim()}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start gap-2">
                        <Zap size={14} className="text-accent mt-0.5" />
                        <span>Premium Quality Assured</span>
                      </li>
                    )}
                  </ul>
                )}
                {tab === 'safety' && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-700 mb-2 text-sm">
                      Safety Instructions
                    </h4>
                    <p className="text-amber-600 text-sm">
                      {product.safety ||
                        'Always maintain a safe distance. Light fuses with care and ensure proper adult supervision at all times.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                You might also like
              </h2>
              <button
                onClick={() => navigate('/products')}
                className="text-accent text-sm font-medium flex items-center gap-1 hover:text-brand-dark transition-colors"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {related.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white border border-gray-100 rounded-xl p-3 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() =>
                    navigate(`/products/${encodeURIComponent(p.slug || p.id)}`)
                  }
                >
                  <div className="aspect-square bg-gray-50 rounded-lg mb-2 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 truncate mb-1 group-hover:text-accent transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900">
                      ₹{p.price}
                    </span>
                    {p.mrp && (
                      <span className="text-[10px] text-gray-400 line-through">
                        ₹{p.mrp}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 z-50">
        <div className="flex gap-3 max-w-lg mx-auto">
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[10px] text-gray-400">Total</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-gray-900">
                ₹{product.price * qty}
              </span>
              {product.mrp && (
                <span className="text-[10px] text-gray-400 line-through">
                  ₹{product.mrp * qty}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isOutOfStock && (
              <div className="flex items-center border border-gray-200 rounded-lg h-10">
                <button
                  onClick={dec}
                  className="w-8 h-full flex items-center justify-center text-gray-400"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-bold text-gray-900 text-sm">
                  {qty}
                </span>
                <button
                  onClick={inc}
                  className="w-8 h-full flex items-center justify-center text-gray-400"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
            <button
              onClick={add}
              disabled={isOutOfStock}
              className={`font-semibold rounded-lg h-10 px-5 flex items-center gap-1.5 text-sm ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-accent text-white'
              }`}
            >
              <ShoppingCart size={16} /> {isOutOfStock ? 'Sold Out' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
