// src/pages/ContactPage.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { getProfile } from '../services/profileService';
import { Profile } from '../types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
// Importar o novo serviço e o tipo de dados do formulário
import { saveContactMessage, type ContactFormDBData } from '../services/contactService';

// Interface para os inputs do formulário (pode omitir createdAt e replied)
interface ContactFormInputs extends Omit<ContactFormDBData, 'createdAt' | 'replied'> {}

const ContactPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormInputs>();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Falha ao carregar informações de contato.");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setIsSubmitting(true);
    console.log("[ContactPage] Form submitted with data:", data);
    try {
      await saveContactMessage(data); // Chama o serviço para salvar no Firestore
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      reset(); // Limpa o formulário
    } catch (error: any) {
      console.error('[ContactPage] Error submitting contact form to Firestore:', error);
      toast.error(`Falha ao enviar mensagem: ${error.message || "Tente novamente mais tarde."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = { /* ... */ };
  const itemVariants = { /* ... */ };

  if (loadingProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <section className="mt-16 py-16 md:py-24">
        <div className="container text-center">
          <p className="text-xl">Não foi possível carregar as informações de contato.</p>
        </div>
      </section>
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
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Entre em Contato
            </h1>
            <p className="mx-auto max-w-2xl text-dark-600 dark:text-dark-400">
              Estou disponível para novas oportunidades e colaborações. Entre em contato comigo através dos canais abaixo ou preenchendo o formulário.
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
                    <a href={`mailto:${profile.email}`} className="text-dark-600 hover:text-primary-600 dark:text-dark-400 dark:hover:text-primary-400 break-all">
                      {profile.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 text-primary-600 dark:text-primary-400" size={18} />
                  <div>
                    <h4 className="font-medium">Telefone</h4>
                    <a href={`tel:${profile.phone}`} className="text-dark-600 hover:text-primary-600 dark:text-dark-400 dark:hover:text-primary-400">
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
                    <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-dark-600 hover:text-primary-600 dark:text-dark-400 dark:hover:text-primary-400 break-all">
                      {profile.linkedin}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Github className="mt-1 text-primary-600 dark:text-primary-400" size={18} />
                  <div>
                    <h4 className="font-medium">GitHub</h4>
                    <a href="https://github.com/javabetatester" target="_blank" rel="noopener noreferrer" className="text-dark-600 hover:text-primary-600 dark:text-dark-400 dark:hover:text-primary-400">
                      github.com/javabetatester
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
              <h3 className="mb-4 text-xl font-semibold">Envie uma Mensagem</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="label">Nome</label>
                  <input
                    id="name"
                    type="text"
                    className={`input mt-1 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Seu nome completo"
                    {...register("name", { required: "Nome é obrigatório" })}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className={`input mt-1 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="seu.email@exemplo.com"
                    {...register("email", { 
                        required: "Email é obrigatório",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Endereço de email inválido"
                        }
                    })}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="subject" className="label">Assunto</label>
                  <input
                    id="subject"
                    type="text"
                    className={`input mt-1 ${errors.subject ? 'border-red-500' : ''}`}
                    placeholder="Assunto da mensagem"
                    {...register("subject", { required: "Assunto é obrigatório" })}
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="message" className="label">Mensagem</label>
                  <textarea
                    id="message"
                    className={`textarea mt-1 min-h-[100px] ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="Sua mensagem detalhada aqui..."
                    rows={4}
                    {...register("message", { required: "Mensagem é obrigatória" })}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                </div>
                
                <button 
                    type="submit" 
                    className="btn-primary btn-md flex w-full items-center justify-center"
                    disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                    </>
                  ) : (
                    <>
                        <Send size={16} className="mr-2" />
                        Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactPage;