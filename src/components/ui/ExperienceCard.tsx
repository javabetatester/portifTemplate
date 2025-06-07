import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { Experience } from '../../types';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  // Format date to display as MMM YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="timeline-item"
    >
      <div className="timeline-dot"></div>
      <div className="rounded-lg border border-dark-200 bg-white p-5 shadow-sm dark:border-dark-800 dark:bg-dark-900">
        <h3 className="mb-1 text-xl font-semibold text-primary-700 dark:text-primary-400">
          {experience.title}
        </h3>
        <h4 className="mb-2 font-medium">{experience.company}</h4>
        
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-dark-600 dark:text-dark-400">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>
              {formatDate(experience.startDate)} - {experience.current ? 'Presente' : formatDate(experience.endDate!)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{experience.location}</span>
          </div>
        </div>
        
        <p className="mb-4 text-dark-700 dark:text-dark-300">
          {experience.description}
        </p>
        
        {experience.responsibilities && experience.responsibilities.length > 0 && (
          <div className="mb-4">
            <h5 className="mb-2 font-medium">Responsabilidades</h5>
            <ul className="ml-5 list-disc space-y-1 text-dark-600 dark:text-dark-400">
              {experience.responsibilities.map((responsibility, i) => (
                <li key={i}>{responsibility}</li>
              ))}
            </ul>
          </div>
        )}
        
        {experience.technologies && experience.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech, i) => (
              <span 
                key={i}
                className="badge-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExperienceCard;