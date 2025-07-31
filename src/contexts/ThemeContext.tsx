'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackEvent } from '@/lib/gtag';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // 应用主题到DOM
  const applyTheme = (themeToApply: Theme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (themeToApply === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    }
  };

  // 初始化主题
  useEffect(() => {
    // 从localStorage读取保存的主题设置
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      // 如果没有保存的主题，检测系统偏好作为默认值
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = systemPrefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
    }
  }, []);

  // 主题变化时更新
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    const previousTheme = theme;
    setTheme(newTheme);
    
    // 跟踪主题切换事件
    if (previousTheme !== newTheme) {
      trackEvent.themeSwitch(newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    handleSetTheme(newTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme: handleSetTheme, 
        toggleTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}