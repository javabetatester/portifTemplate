import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Experience } from '../../types';
import ExperienceCard from '../ui/ExperienceCard';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection = ({ experiences }: ExperienceSectionProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="experience" className="section">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={titleVariants} className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Experiência Profissional
            </h2>
            <p className="mx-auto max-w-2xl text-dark-600 dark:text-dark-400">
              Minha trajetória profissional e experiências que me ajudaram a desenvolver minhas habilidades técnicas e de negócio.
            </p>
          </motion.div>

          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <ExperienceCard 
                key={experience.id} 
                experience={experience} 
                index={index} 
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;