'use client'

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isAdminAuthenticated, router, pathname]);

  if (!isAdminAuthenticated) return null;

  return <>{children}</>;
};
