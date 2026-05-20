'use client'

import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@/src/context/AuthContext'
import { AdminAuthProvider } from '@/src/context/AdminAuthContext'
import { CartProvider } from '@/src/context/CartContext'
import { ThemeProvider } from '@/src/context/ThemeContext'
import { ToastProvider } from '@/src/context/ToastContext'
import { CategoryProvider } from '@/src/context/CategoryContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <ToastProvider>
                <CategoryProvider>
                  {children}
                </CategoryProvider>
              </ToastProvider>
            </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
