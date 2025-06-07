import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getProfile } from '../services/profileService';
import { getSkills } from '../services/skillsService';
import { getExperiences } from '../services/experienceService';
import { Experience, Profile, Skill } from '../types';
import SkillBar from '../components/ui/SkillBar';
import ExperienceCard from '../components/ui/ExperienceCard';

const AboutPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, skillsData, experiencesData] = await Promise.all([
          getProfile(),
          getSkills(),
          getExperiences(),
        ]);

        setProfile(profileData);
        setSkills(skillsData);
        setExperiences(experiencesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Failed to load profile data.</p>
      </div>
    );
  }

  return (
    <section className="mt-16 py-16 md:py-24">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={titleVariants} className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Sobre Mim
            </h1>
            <p className="mx-auto max-w-2xl text-dark-600 dark:text-dark-400">
              Conheça mais sobre minha trajetória profissional, habilidades e experiências.
            </p>
          </motion.div>

          <motion.div variants={titleVariants} className="mb-12">
            <div className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
              <h2 className="mb-4 text-2xl font-semibold">Perfil Profissional</h2>
              <p className="mb-6 text-dark-700 dark:text-dark-300">
                {profile.bio}
              </p>
              
              <h3 className="mb-3 text-xl font-medium">Informações Pessoais</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-medium">Nome:</p>
                  <p className="text-dark-600 dark:text-dark-400">{profile.name}</p>
                </div>
                <div>
                  <p className="font-medium">Localização:</p>
                  <p className="text-dark-600 dark:text-dark-400">{profile.location}</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-dark-600 dark:text-dark-400">{profile.email}</p>
                </div>
                <div>
                  <p className="font-medium">LinkedIn:</p>
                  <p className="text-dark-600 dark:text-dark-400">{profile.linkedin}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={titleVariants} className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Minhas Habilidades</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {skills.slice(0, 8).map((skill) => (
                <SkillBar key={skill.id} skill={skill} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={titleVariants}>
            <h2 className="mb-6 text-2xl font-semibold">Experiência Profissional</h2>
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
        </motion.div>
      </div>
    </section>
  );
};

export default AboutPage;