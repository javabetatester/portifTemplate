import { motion } from 'framer-motion';
import { FileEdit, LogOut, Settings, User2, Code, Briefcase, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const AdminDashboardPage = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao fazer logout.');
    }
  };

  const adminLinks = [
    {
      title: 'Perfil',
      description: 'Edite suas informações pessoais e de contato',
      icon: <User2 size={24} />,
      to: '/admin/profile',
      color: 'bg-blue-500',
    },
    {
      title: 'Habilidades',
      description: 'Gerencie suas habilidades técnicas e proficiências',
      icon: <Code size={24} />,
      to: '/admin/skills',
      color: 'bg-green-500',
    },
    {
      title: 'Experiências',
      description: 'Adicione e edite suas experiências profissionais',
      icon: <Briefcase size={24} />,
      to: '/admin/experience',
      color: 'bg-purple-500',
    },
    {
      title: 'Projetos',
      description: 'Gerencie seus projetos e portfólio',
      icon: <FileEdit size={24} />,
      to: '/admin/projects',
      color: 'bg-orange-500',
    },
     { 
      title: 'Blog Posts',
      description: 'Gerencie os artigos do seu blog',
      icon: <Newspaper size={24} />,
      to: '/admin/blog',
      color: 'bg-teal-500',
    },
    {
      title: 'Configurações',
      description: 'Configurações gerais do site',
      icon: <Settings size={24} />,
      to: '/admin/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <section className="mt-16 py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Painel de Administração</h1>
            <button
              onClick={handleLogout}
              className="btn-outline btn-md flex items-center"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {adminLinks.map((link) => (
              <Link
                key={link.title}
                to={link.to}
                className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-dark-800 dark:bg-dark-900"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-white`} style={{ backgroundColor: link.color }}>
                  {link.icon}
                </div>
                <h2 className="mb-2 text-xl font-semibold">{link.title}</h2>
                <p className="text-dark-600 dark:text-dark-400">{link.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
            <h2 className="mb-4 text-xl font-semibold">Início Rápido</h2>
            <p className="mb-4 text-dark-600 dark:text-dark-400">
              Bem-vindo ao painel de administração do seu portfólio. Aqui você pode gerenciar todo o conteúdo do seu site.
            </p>
            <p className="text-dark-600 dark:text-dark-400">
              Para começar, selecione uma das opções acima para editar o conteúdo correspondente.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;