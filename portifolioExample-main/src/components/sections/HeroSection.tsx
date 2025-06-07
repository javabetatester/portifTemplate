import { motion } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Profile } from '../../types';

interface HeroSectionProps {
  profile: Profile;
}

const HeroSection = ({ profile }: HeroSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'backOut',
      },
    },
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 dark:from-dark-950 dark:to-dark-900">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0 z-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-[30vw] w-[30vw] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-primary-500 opacity-20"
              style={{
                width: `${30 + i * 10}vw`,
                height: `${30 + i * 10}vw`,
                animationDelay: `${i * 0.2}s`,
                animation: 'ripple 5s linear infinite',
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-6xl"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Texto do perfil */}
            <div className="text-center lg:text-left">
              <motion.h1
                variants={itemVariants}
                className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
              >
                Olá, eu sou{' '}
                <span className="text-primary-600 dark:text-primary-400">
                  {profile.name}
                </span>
              </motion.h1>

              <motion.h2
                variants={itemVariants}
                className="mb-8 text-2xl font-medium text-dark-700 dark:text-dark-300 md:text-3xl"
              >
                {profile.title}
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="mx-auto mb-10 max-w-2xl text-lg text-dark-600 dark:text-dark-400 lg:mx-0"
              >
                {profile.bio}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mb-12 flex flex-wrap justify-center gap-4 lg:justify-start"
              >
                <Link to="/projects" className="btn-primary btn-lg">
                  Ver Projetos
                </Link>
                <Link to="/contact" className="btn-outline btn-lg">
                  Entre em Contato
                </Link>
              </motion.div>

              {/* Redes Sociais - Desktop */}
              <motion.div
                variants={itemVariants}
                className="hidden lg:flex lg:justify-start gap-4"
              >
                <motion.a
                  variants={socialVariants}
                  href={`mailto:${profile.email}`}
                  className="group flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 dark:bg-dark-800"
                  aria-label="Email"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={24} className="text-dark-600 group-hover:text-primary-600 dark:text-dark-300 dark:group-hover:text-primary-400 transition-colors" />
                </motion.a>
                
                <motion.a
                  variants={socialVariants}
                  href={`https://${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 dark:bg-dark-800"
                  aria-label="LinkedIn"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={24} className="text-dark-600 group-hover:text-blue-600 dark:text-dark-300 dark:group-hover:text-blue-400 transition-colors" />
                </motion.a>
                
                <motion.a
                  variants={socialVariants}
                  href="https://github.com/javabetatester"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 dark:bg-dark-800"
                  aria-label="GitHub"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={24} className="text-dark-600 group-hover:text-gray-800 dark:text-dark-300 dark:group-hover:text-white transition-colors" />
                </motion.a>
              </motion.div>
            </div>

            {/* Foto do perfil com redes sociais flutuantes */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-end relative"
            >
              <div className="relative">
                {/* Círculo decorativo */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-20 blur-lg"></div>
                
                {/* Container da foto */}
                <div className="relative h-80 w-80 overflow-hidden rounded-full border-4 border-white shadow-2xl dark:border-dark-800 md:h-96 md:w-96">
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://cdn.discordapp.com/attachments/1378163011579281511/1378535365157195848/1747363212609.png?ex=6845865b&is=684434db&hm=0dfa8f1665427f5579d615fa667b6ba48871e40f7902ceaf0b95c07a52da4b12&`;
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500 text-6xl font-bold text-white">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                


                {/* Redes Sociais Flutuantes - Mobile e como decoração */}
                <div className="lg:hidden">
                  {/* Email */}
                  <motion.a
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    href={`mailto:${profile.email}`}
                    className="absolute -left-6 top-16 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl dark:bg-dark-800 md:-left-8 md:top-20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail size={20} className="text-primary-600 dark:text-primary-400" />
                  </motion.a>

                  {/* LinkedIn */}
                  <motion.a
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    href={`https://${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl dark:bg-dark-800 md:-top-8"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin size={20} className="text-blue-600 dark:text-blue-400" />
                  </motion.a>

                  {/* GitHub */}
                  <motion.a
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                    href="https://github.com/javabetatester"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute -right-6 top-16 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl dark:bg-dark-800 md:-right-8 md:top-20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={20} className="text-gray-800 dark:text-white" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Redes Sociais - Mobile (parte inferior) */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex justify-center gap-6 lg:hidden"
          >
            <motion.a
              variants={socialVariants}
              href={`mailto:${profile.email}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-dark-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={20} className="text-primary-600 dark:text-primary-400" />
            </motion.a>
            
            <motion.a
              variants={socialVariants}
              href={`https://${profile.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-dark-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin size={20} className="text-blue-600 dark:text-blue-400" />
            </motion.a>
            
            <motion.a
              variants={socialVariants}
              href="https://github.com/javabetatester"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-dark-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={20} className="text-gray-800 dark:text-white" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Seta de scroll down */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transform"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="cursor-pointer"
          onClick={() => {
            const nextSection = document.getElementById('skills') || document.querySelector('section:nth-of-type(2)');
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <ChevronDown
            size={32}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;