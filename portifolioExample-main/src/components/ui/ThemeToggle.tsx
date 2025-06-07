import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-100 text-dark-800 transition-colors hover:bg-dark-200 dark:bg-dark-800 dark:text-dark-200 dark:hover:bg-dark-700"
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {theme === 'light' ? (
        <Sun size={18} className="text-dark-700" />
      ) : (
        <Moon size={18} className="text-dark-300" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;