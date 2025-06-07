import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ui/ThemeToggle';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'Sobre' },
    { to: '/projects', label: 'Projetos' },
    { to: '/blog', label: 'Blog' }, // Novo link
    { to: '/contact', label: 'Contato' },
  ];

  const variants = {
    hidden: { opacity: 0, y: -25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={variants}
      className={`fixed top-0 z-50 w-full ${scrolled
          ? 'bg-white bg-opacity-90 shadow-md backdrop-blur-md dark:bg-dark-950 dark:bg-opacity-90'
          : 'bg-transparent'
        } transition-all duration-300`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold text-primary-600 dark:text-primary-400">
            {'<BK>'}
          </span>
          <span className="hidden font-semibold sm:inline-block">
            Bernardo Kunz
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-medium transition-colors duration-300 hover:text-primary-600 dark:hover:text-primary-400 ${isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-dark-700 dark:text-dark-200'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {currentUser && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `font-medium transition-colors duration-300 hover:text-primary-600 dark:hover:text-primary-400 ${isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-dark-700 dark:text-dark-200'
                }`
              }
            >
              Admin
            </NavLink>
          )}

          <ThemeToggle />
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-dark-800 dark:text-dark-200"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 right-0 z-20 bg-white shadow-lg dark:bg-dark-900 md:hidden"
        >
          <nav className="container mx-auto flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `border-b border-gray-100 py-3 font-medium dark:border-dark-800 ${isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-dark-700 dark:text-dark-200'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {currentUser && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `border-b border-gray-100 py-3 font-medium dark:border-dark-800 ${isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-dark-700 dark:text-dark-200'
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;