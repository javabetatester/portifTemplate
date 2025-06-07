// src/components/ui/BlogPostCard.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import { Calendar, Tag, User } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // Exemplo de sombra no hover
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="card flex flex-col overflow-hidden h-full" // card e h-full para mesma altura em grid
    >
      {post.imageUrl && (
        <Link to={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="mb-2 text-xl font-semibold hover:text-primary-600 dark:hover:text-primary-400">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-dark-500 dark:text-dark-400">
          <span className="flex items-center">
            <User size={14} className="mr-1" /> {post.authorName}
          </span>
          {post.publishedAt && (
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" /> {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>

        <p className="mb-4 text-sm text-dark-600 dark:text-dark-300 flex-grow">
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Tag size={14} className="text-dark-400 dark:text-dark-500" />
            {post.tags.map((tag, index) => (
              <span 
                key={index} 
                className="badge-secondary text-xs" // Usar badge-secondary ou outra de sua preferência
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto">
            <Link 
                to={`/blog/${post.slug}`} 
                className="btn-outline btn-sm hover:bg-primary-500 hover:text-white dark:hover:bg-primary-600"
            >
                Ler Mais &rarr;
            </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPostCard;