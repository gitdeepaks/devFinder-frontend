import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const THEME_KEYS = ['t3-dark', 't3-light', 'system'];
const STORAGE_KEY = 'devfinder-theme';

function getSystemPrefersDark() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveEffectiveTheme(theme) {
  if (theme === 'system') return getSystemPrefersDark() ? 't3-dark' : 't3-light';
  return theme;
}

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      const initial = THEME_KEYS.includes(saved) ? saved : 't3-dark';
      document.documentElement.setAttribute('data-theme', resolveEffectiveTheme(initial));
      return initial;
    }
    return 't3-dark';
  });

  const [effectiveTheme, setEffectiveTheme] = useState(() => resolveEffectiveTheme(theme));

  useEffect(() => {
    const resolved = resolveEffectiveTheme(theme);
    setEffectiveTheme(resolved);
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', resolved);
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const resolved = resolveEffectiveTheme('system');
      setEffectiveTheme(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = useCallback((value) => {
    if (THEME_KEYS.includes(value)) setThemeState(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const idx = THEME_KEYS.indexOf(prev);
      return THEME_KEYS[(idx + 1) % THEME_KEYS.length];
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
