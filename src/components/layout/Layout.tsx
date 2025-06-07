import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import { useEffect } from 'react';
import { initializeData } from '../../services/dataService';

const Layout = () => {
  // Initialize default data if needed
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white transition-colors duration-300 dark:bg-dark-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;