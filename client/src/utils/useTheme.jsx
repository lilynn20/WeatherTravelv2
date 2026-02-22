import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Context
 * Contexte pour gérer le thème clair/sombre
 */
const ThemeContext = createContext();

/**
 * Hook personnalisé pour utiliser le contexte de thème
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur de ThemeProvider');
  }
  return context;
};

/**
 * Composant Provider pour le thème
 * Gère l'état du thème et persiste les préférences
 */
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Récupère la préférence sauvegardée ou vérifie le système
    const saved = localStorage.getItem('theme-preference');
    if (saved) {
      return saved === 'dark';
    }
    // Utilise la préférence système
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Met à jour la classe du document et sauvegarde la préférence
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      localStorage.setItem('theme-preference', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      localStorage.setItem('theme-preference', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
