import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}



const ProjectCard = ({ project }: ProjectCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
      }
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="project-card h-full"
    >
      <div className="overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="project-image transform transition-transform duration-500 hover:scale-105" 
        />
      </div>
      <div className="p-5">
        <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
        <p className="mb-4 text-dark-600 dark:text-dark-300">
          {project.description}
        </p>
        
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span 
              key={index} 
              className="badge-primary"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline btn-sm"
            >
              <Github size={16} className="mr-1" /> GitHub
            </a>
          )}
          
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-sm"
            >
              <ExternalLink size={16} className="mr-1" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;