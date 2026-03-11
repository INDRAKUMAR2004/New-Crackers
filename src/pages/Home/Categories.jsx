import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Navigation-ku mukkiyam
import { db } from '../../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import 'swiper/css';
import 'swiper/css/pagination';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const qCat = query(
      collection(db, 'categories'),
      orderBy('createdAt', 'desc')
    );
    const unsubCat = onSnapshot(qCat, (snapshot) => {
      setCategories(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    const qProd = collection(db, 'products');
    const unsubProd = onSnapshot(qProd, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    });

    return () => {
      unsubCat();
      unsubProd();
    };
  }, []);

  const getProductCount = (categoryName) => {
    const count = products.filter((p) => p.category === categoryName).length;
    return `${count} ${count === 1 ? 'Style' : 'Styles'}`;
  };

  // Category card click panna intha function run aagum
  const handleCategoryClick = (categoryName) => {
    // Unga route /products nu sonnathala inga mathiruken
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-20 bg-white font-body relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Collections
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-3 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-slate-500 max-w-md text-base">
            Browse our curated collections of premium crackers
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : isMobile ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            loop={categories.length > 2}
            spaceBetween={16}
            slidesPerView={1.5}
            centeredSlides={true}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <CategoryCard
                  cat={cat}
                  countText={getProductCount(cat.name)}
                  onClick={() => handleCategoryClick(cat.name)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 justify-items-center">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                countText={getProductCount(cat.name)}
                onClick={() => handleCategoryClick(cat.name)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const CategoryCard = ({ cat, countText, onClick }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer flex flex-col items-center text-center w-full max-w-[180px]"
  >
    <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-[3px] border-white shadow-lg transition-all duration-500 group-hover:border-orange-400 group-hover:-translate-y-3 group-hover:shadow-xl group-hover:shadow-orange-500/15">
      <img
        src={cat.img}
        alt={cat.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <h3 className="text-sm md:text-base font-bold text-slate-800 group-hover:text-orange-600 transition-colors duration-300 mb-1">
      {cat.name}
    </h3>
    <p className="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
      {countText}
    </p>
  </div>
);
