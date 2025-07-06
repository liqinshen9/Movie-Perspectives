import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext<{ theme:string; toggle:()=>void }>({
  theme: 'light',
  toggle: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light'|'dark'>('light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  function toggle() {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
