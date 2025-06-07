// src/pages/BlogPage.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getBlogPosts } from '../services/blogService';
import { BlogPost } from '../types';
import BlogPostCard from '../components/ui/BlogPostCard'; // Certifique-se que este componente existe

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Para mostrar erros na UI

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("[BlogPage] Fetching posts...");
      setLoading(true);
      setError(null);
      try {
        const postsData = await getBlogPosts(); // Por padrão, pega apenas os publicados e ordenados
        console.log('[BlogPage] Posts received from service:', postsData);
        if (postsData && postsData.length > 0) {
          setPosts(postsData);
        } else {
          setPosts([]);
          console.log('[BlogPage] No posts data received or data is empty.');
        }
      } catch (err: any) {
        console.error('[BlogPage] Error fetching blog posts:', err);
        setError(`Falha ao carregar posts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const containerVariants = { /* ... */ };
  const titleVariants = { /* ... */ };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section className="mt-16 py-16 md:py-24 bg-gray-50 dark:bg-dark-900 min-h-screen">
      <div className="container">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={titleVariants} className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl text-dark-800 dark:text-white">
              Blog
            </h1>
            <p className="mx-auto max-w-2xl text-dark-600 dark:text-dark-400">
              Artigos, tutoriais e pensamentos sobre desenvolvimento de software e tecnologia.
            </p>
          </motion.div>

          {error && ( // Mostrar mensagem de erro se houver
            <motion.div variants={titleVariants} className="text-center py-12">
              <p className="text-xl text-red-500 dark:text-red-400">
                {error}
              </p>
            </motion.div>
          )}

          {!error && posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            !error && !loading && ( // Só mostra "nenhum post" se não houver erro e não estiver carregando
              <motion.div variants={titleVariants} className="text-center py-12">
                <p className="text-xl text-dark-600 dark:text-dark-400">
                  Ainda não há posts por aqui. Volte em breve!
                </p>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPage;