import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    return `${count} items`;
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-500 text-sm">
            Browse our curated collections of premium crackers
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : isMobile ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            loop={categories.length > 2}
            spaceBetween={12}
            slidesPerView={2.3}
            pagination={{ clickable: true }}
            className="pb-10"
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
          <div className="grid grid-cols-3 md:grid-cols-6 gap-5">
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
    className="group cursor-pointer flex flex-col items-center text-center"
  >
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-3 border-2 border-gray-100 bg-gray-50 transition-all duration-300 group-hover:border-accent group-hover:shadow-md">
      <img
        src={cat.img}
        alt={cat.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-accent transition-colors mb-0.5">
      {cat.name}
    </h3>
    <p className="text-xs text-gray-400">{countText}</p>
  </div>
);
