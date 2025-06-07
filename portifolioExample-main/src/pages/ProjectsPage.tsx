import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProjects } from '../services/projectsService';
import { Project } from '../types';
import ProjectCard from '../components/ui/ProjectCard';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section className="mt-16 py-16 md:py-24">
      <div className="container">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={titleVariants} className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Meus Projetos
            </h1>
            <p className="mx-auto max-w-2xl text-dark-600 dark:text-dark-400">
              Conheça os projetos que desenvolvi utilizando Java, Spring Boot e outras tecnologias relacionadas.
            </p>
          </motion.div>

          {projects.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p>Nenhum projeto encontrado.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsPage;