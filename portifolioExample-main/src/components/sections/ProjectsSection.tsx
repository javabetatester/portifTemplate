import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Project } from '../../types';
import ProjectCard from '../ui/ProjectCard';

interface ProjectsSectionProps {
  projects: Project[];
  limit?: number;
  showViewAll?: boolean;
}

const ProjectsSection = ({ 
  projects, 
  limit = 3, 
  showViewAll = true 
}: ProjectsSectionProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Sort projects by featured first, then by order
  const sortedProjects = [...projects]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.order || 0) - (b.order || 0);
    })
    .slice(0, limit);

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

  return (
    <section id="projects" className="section bg-gray-50 dark:bg-dark-900">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div variants={titleVariants} className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Projetos em Destaque
            </h2>
            <p className="mx-auto max-w-2xl text-dark-600 dark:text-dark-400">
              Uma seleção dos meus projetos em Java, Spring Boot e tecnologias relacionadas, demonstrando minhas habilidades e experiência.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {showViewAll && projects.length > limit && (
            <motion.div 
              variants={titleVariants}
              className="mt-12 flex justify-center"
            >
              <Link 
                to="/projects" 
                className="btn-outline btn-md flex items-center"
              >
                Ver Todos os Projetos
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;