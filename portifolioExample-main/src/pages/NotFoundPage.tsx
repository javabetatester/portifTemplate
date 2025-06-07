import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="flex min-h-screen items-center justify-center py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md text-center"
        >
          <div className="mb-6 text-9xl font-bold text-primary-500 dark:text-primary-400">
            404
          </div>
          <h1 className="mb-4 text-3xl font-bold">Página Não Encontrada</h1>
          <p className="mb-8 text-dark-600 dark:text-dark-400">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link to="/" className="btn-primary btn-lg inline-flex items-center">
            <ArrowLeft size={18} className="mr-2" />
            Voltar para Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFoundPage;