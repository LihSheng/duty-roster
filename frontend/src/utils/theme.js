/**
 * Theme utility for managing dark mode
 */

// Check if user has a theme preference in localStorage or prefers dark mode
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('color-theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }

  return 'light'; // Default theme
};

// Apply theme to document
const applyTheme = (theme) => {
  const root = window.document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Save theme preference to localStorage
  localStorage.setItem('color-theme', theme);
};

// Toggle between light and dark themes
const toggleTheme = () => {
  const currentTheme = localStorage.getItem('color-theme') || getInitialTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);

  return newTheme;
};

// Initialize theme on page load
const initializeTheme = () => {
  const theme = getInitialTheme();
  applyTheme(theme);

  return theme;
};

export { getInitialTheme, applyTheme, toggleTheme, initializeTheme };
