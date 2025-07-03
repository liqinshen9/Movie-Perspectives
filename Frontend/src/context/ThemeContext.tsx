// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({
  theme: 'light',
  toggle: () => {},
});

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('theme') as Theme) || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
