// src/pages/BlogPostDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPostBySlug } from '../services/blogService';
import { BlogPost } from '../types';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
// Para syntax highlighting no Markdown (opcional, mas recomendado)
// npm install react-syntax-highlighter @types/react-syntax-highlighter
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const BlogPostDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("Slug do post não encontrado.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const postData = await getBlogPostBySlug(slug);
        if (postData) {
          setPost(postData);
        } else {
          setError("Post não encontrado.");
        }
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError("Erro ao carregar o post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="mt-16 py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <Link to="/blog" className="btn-primary btn-md">
            <ArrowLeft size={18} className="mr-2" /> Voltar para o Blog
          </Link>
        </div>
      </section>
    );
  }

  if (!post) {
    return ( // Caso de post não encontrado mas sem erro explícito (pouco provável com a lógica atual)
         <section className="mt-16 py-16 md:py-24">
            <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
            <Link to="/blog" className="btn-primary btn-md">
                <ArrowLeft size={18} className="mr-2" /> Voltar para o Blog
            </Link>
            </div>
      </section>
    );
  }

  return (
    <section className="mt-16 py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-4">
              <ArrowLeft size={18} className="mr-2" />
              Voltar para todos os posts
            </Link>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-dark-900 dark:text-white md:text-5xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-dark-500 dark:text-dark-400">
              <span className="flex items-center">
                <User size={16} className="mr-1.5" /> {post.authorName}
              </span>
              {post.publishedAt && (
                <span className="flex items-center">
                  <Calendar size={16} className="mr-1.5" /> {new Date(post.publishedAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          {post.imageUrl && (
            <motion.div 
              className="mb-8 overflow-hidden rounded-lg shadow-lg aspect-video"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Classe 'prose' do Tailwind Typography ou sua customizada */}
          <div className="prose prose-lg dark:prose-invert max-w-none 
                          prose-headings:font-semibold prose-headings:text-dark-800 dark:prose-headings:text-gray-100
                          prose-a:text-primary-600 hover:prose-a:text-primary-700 dark:prose-a:text-primary-400 dark:hover:prose-a:text-primary-300
                          prose-code:before:content-none prose-code:after:content-none prose-code:font-mono prose-code:px-1 prose-code:py-0.5 prose-code:bg-gray-100 dark:prose-code:bg-dark-700 prose-code:rounded-sm
                          prose-blockquote:border-primary-500 dark:prose-blockquote:border-primary-400">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            //   components={{ // Opcional para customizar ou adicionar syntax highlighting
            //     code({node, inline, className, children, ...props}) {
            //       const match = /language-(\w+)/.exec(className || '')
            //       return !inline && match ? (
            //         <SyntaxHighlighter
            //           style={atomDark} // Escolha um tema
            //           language={match[1]}
            //           PreTag="div"
            //           {...props}
            //         >
            //           {String(children).replace(/\n$/, '')}
            //         </SyntaxHighlighter>
            //       ) : (
            //         <code className={className} {...props}>
            //           {children}
            //         </code>
            //       )
            //     }
            //   }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-dark-700">
              <h3 className="text-sm font-medium text-dark-600 dark:text-dark-300 mb-2 flex items-center">
                <Tag size={16} className="mr-2"/>
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="badge-accent text-xs"> {/* Use a cor de sua preferência */}
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </div>
    </section>
  );
};

export default BlogPostDetailsPage;