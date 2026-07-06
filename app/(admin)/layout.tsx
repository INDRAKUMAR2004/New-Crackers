import Layout from '@/src/admin/Layout';
import ProtectedRoute from '@/src/admin/ProtectedRoute';
import { Suspense } from 'react';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <Layout>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Layout>
      </Suspense>
    </ProtectedRoute>
  );
}
