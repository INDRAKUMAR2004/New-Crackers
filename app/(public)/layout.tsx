import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { Suspense } from 'react';

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="grow">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
