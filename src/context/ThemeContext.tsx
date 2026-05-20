'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  setIsDark: (d: boolean) => void;
  toggleDark: () => void;
  isBoxed: boolean;
  toggleBoxed: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [isBoxed, setIsBoxed] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('buildmore_theme');
    if (storedTheme !== null) setIsDark(storedTheme === 'dark');
    const storedLayout = localStorage.getItem('buildmore_layout');
    if (storedLayout !== null) setIsBoxed(storedLayout !== 'full');
  }, []);

  const handleSetIsDark = (d: boolean) => {
    setIsDark(d);
    localStorage.setItem('buildmore_theme', d ? 'dark' : 'light');
  };

  const handleToggleBoxed = () => {
    setIsBoxed(b => {
      const next = !b;
      localStorage.setItem('buildmore_layout', next ? 'boxed' : 'full');
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark: handleSetIsDark, toggleDark: () => handleSetIsDark(!isDark), isBoxed, toggleBoxed: handleToggleBoxed }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
