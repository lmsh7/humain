import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Check user preference and localStorage
  const prefersDarkMode = window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme 
      ? savedTheme === 'dark' 
      : prefersDarkMode;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const contextValue = {
    isDarkMode,
    toggleTheme
  };

  // 支持渲染函数或直接使用上下文
  return (
    <ThemeContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </ThemeContext.Provider>
  );
};