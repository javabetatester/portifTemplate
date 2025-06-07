import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Profile } from '../../types';

interface ContactSectionProps {
  profile: Profile;
}

const ContactSection = ({ profile }: ContactSectionProps) => {
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
    <section id="contact" className="section">
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
              Entre em Contato
            </h2>
            <p className="mx-auto max-w-2xl text-dark-600 dark:text-dark-400">
              Estou disponível para novas oportunidades e colaborações. Entre em contato comigo através dos canais abaixo.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6 rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
              <h3 className="text-xl font-semibold">Informações de Contato</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 text-primary-600 dark:text-primary-400" size={18} />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a 
                      href={`mailto:${profile.email}`}
                      className="text-dark-600 hover:text-primary-600 dark:text-dark-400 dark:hover:text-primary-400"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 text-primary-600 dark:text-primary-400" size={18} />
                  <div>
                    <h4 className="font-medium">Telefone</h4>
                    <a 
                      href={`tel:${profile.phone}`}
                      className="text-dark-600 hover:text-primary-600 dark:text-dark-400 dark:hover:text-primary-400"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 text-primary-600 dark:text-primary-400" size={18} />
                  <div>
                    <h4 className="font-medium">Localização</h4>
                    <p className="text-dark-600 dark:text-dark-400">
                      {profile.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Linkedin className="mt-1 text-primary-600 dark:text-primary-400" size={18} />
                  <div>
                    <h4 className="font-medium">LinkedIn</h4>
                    <a 
                      href={`https://${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark-600 hover:text-primary-600 dark:text-dark-400 dark:hover:text-primary-400"
                    >
                      {profile.linkedin}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Github className="mt-1 text-primary-600 dark:text-primary-400" size={18} />
                  <div>
                    <h4 className="font-medium">GitHub</h4>
                    <a 
                      href="https://github.com/javabetatester"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark-600 hover:text-primary-600 dark:text-dark-400 dark:hover:text-primary-400"
                    >
                      github.com/javabetatester
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
              <h3 className="mb-4 text-xl font-semibold">Envie uma Mensagem</h3>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="label">
                    Nome
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input mt-1"
                    placeholder="Seu nome"
                    requi
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input mt-1"
                    placeholder="Seu email"
                    requi
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="label">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    className="textarea mt-1"
                    placeholder="Sua mensagem"
                    rows={4}
                    requi
                  ></textarea>
                </div>
                
                <button type="submit" className="btn-primary btn-md w-full">
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;