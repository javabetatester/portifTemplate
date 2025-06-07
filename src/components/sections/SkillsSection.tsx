import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Skill, SkillCategory } from '../../types';
import SkillBar from '../ui/SkillBar';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'ALL'>('ALL');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const filteredSkills = skills.filter(
    (skill) => activeCategory === 'ALL' || skill.category === activeCategory
  );

  // Group skills by category
  const categories = Object.values(SkillCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="skills" className="section bg-gray-50 dark:bg-dark-900">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Habilidades &amp; Competências
            </h2>
            <p className="mx-auto max-w-2xl text-dark-600 dark:text-dark-400">
              Minhas habilidades técnicas e competências como desenvolvedor Java, com foco em
              frameworks, bancos de dados, e ferramentas relacionadas.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-8 flex flex-wrap justify-center gap-2"
          >
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === 'ALL'
                  ? 'bg-primary-600 text-white dark:bg-primary-700'
                  : 'bg-white text-dark-700 hover:bg-gray-100 dark:bg-dark-800 dark:text-dark-300 dark:hover:bg-dark-700'
              }`}
            >
              Todos
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white dark:bg-primary-700'
                    : 'bg-white text-dark-700 hover:bg-gray-100 dark:bg-dark-800 dark:text-dark-300 dark:hover:bg-dark-700'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-8 md:grid-cols-2">
            {filteredSkills.map((skill) => (
              <SkillBar key={skill.id} skill={skill} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;