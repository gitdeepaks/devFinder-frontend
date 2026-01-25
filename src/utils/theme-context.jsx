import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then default to 'monokai-pro-dark'
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devfinder-theme');
      const initialTheme = saved || 'monokai-pro-dark';
      // Apply immediately to prevent flash
      document.documentElement.setAttribute('data-theme', initialTheme);
      return initialTheme;
    }
    return 'monokai-pro-dark';
  });

  useEffect(() => {
    // Apply theme to document and persist
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('devfinder-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'monokai-pro-dark' ? 'monokai-pro-light' : 'monokai-pro-dark'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
