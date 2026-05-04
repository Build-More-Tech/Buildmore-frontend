import React, { createContext, useContext, useEffect, useState } from 'react';
import { categoryApi, Category } from '../api';

interface CategoryContextValue {
  categories: Category[];
  loading: boolean;
}

const CategoryContext = createContext<CategoryContextValue>({ categories: [], loading: true });

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi.getAll()
      .then(res => setCategories(res.categories || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);
