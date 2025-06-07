import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import AboutPage from './pages/AboutPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminExperiencePage from './pages/admin/AdminExperiencePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminSkillsPage from './pages/admin/AdminSkillsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import BlogPage from './pages/BlogPage';
import BlogPostDetailsPage from './pages/BlogPostDetailsPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  const location = useLocation();
  const { loading } = useAuth();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostDetailsPage />} />

          {/* Admin Routes */}
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/profile"
            element={
              <ProtectedRoute>
                <AdminProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/skills"
            element={
              <ProtectedRoute>
                <AdminSkillsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/experience"
            element={
              <ProtectedRoute>
                <AdminExperiencePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/projects"
            element={
              <ProtectedRoute>
                <AdminProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/blog"
            element={
              <ProtectedRoute>
                <AdminBlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/settings"
            element={
              <ProtectedRoute>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;