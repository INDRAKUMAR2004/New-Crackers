"use client";
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from '../../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import 'swiper/css';
import 'swiper/css/pagination';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const qCat = query(
      collection(db, 'categories')
    );
    const unsubCat = onSnapshot(qCat, (snapshot) => {
      let docs = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any;
      docs.sort((a: any, b: any) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
      setCategories(docs);
    });
    const qProd = collection(db, 'products');
    const unsubProd = onSnapshot(qProd, (snapshot) => {
      setProducts(snapshot.docs.map((doc: any) => doc.data()) as any);
      setLoading(false);
    });
    return () => {
      unsubCat();
      unsubProd();
    };
  }, []);

  const getProductCount = (categoryName: string, categorySlug: string) => {
    const count = products.filter(
      (p: any) => p.categorySlug === categorySlug || p.category === categoryName
    ).length;
    return `${count} items`;
  };

  const handleCategoryClick = (categoryName: string, categorySlug: string) => {
    const categoryKey = categorySlug || categoryName;
    router.push(`/products?category=${encodeURIComponent(categoryKey)}`);
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
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            loop={categories.length > 2}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 2.3, spaceBetween: 12 },
              768: { slidesPerView: 4.5, spaceBetween: 16 },
              1024: { slidesPerView: 6, spaceBetween: 20 },
            }}
            pagination={{ clickable: true }}
            className="!pb-16"
          >
            {categories.map((cat: any) => (
              <SwiperSlide key={cat.id}>
                <CategoryCard
                  cat={cat}
                  countText={getProductCount(cat.name, cat.slug)}
                  onClick={() => handleCategoryClick(cat.name, cat.slug)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}

const CategoryCard = ({ cat, countText, onClick }: any) => (
  <div
    onClick={onClick}
    className="group cursor-pointer flex flex-col items-center text-center h-full"
  >
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-3 border-2 border-gray-100 bg-gray-50 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-sm shrink-0">
      <img
        src={cat.img}
        alt={cat.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors mb-1 line-clamp-2 min-h-[40px] flex items-center justify-center">
      {cat.name}
    </h3>
    <p className="text-xs text-gray-400 mt-auto">{countText}</p>
  </div>
);
