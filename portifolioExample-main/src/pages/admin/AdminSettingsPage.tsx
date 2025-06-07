import { motion } from 'framer-motion';
import { ArrowLeft, Save, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';

type Theme = 'light' | 'dark';

interface Settings {
  siteTitle: string;
  siteDescription: string;
  enableAnimations: boolean;
  showBlogSection: boolean;
  contactFormEmail: string;
  googleAnalyticsId: string;
  enableDarkMode: boolean;
  defaultTheme: Theme;
}

const AdminSettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    siteTitle: 'Bernardo Kunz | Java Developer',
    siteDescription: 'Professional portfolio of Bernardo Kunz, Java Junior Developer specializing in clean code, SOLID principles, and enterprise applications.',
    enableAnimations: true,
    showBlogSection: false,
    contactFormEmail: 'bernardokunz@gmail.com',
    googleAnalyticsId: '',
    enableDarkMode: true,
    defaultTheme: theme,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev: Settings) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setSettings((prev: Settings) => ({ ...prev, defaultTheme: newTheme }));
    if (newTheme !== theme) {
      toggleTheme();
    }
  };

  return (
    <section className="mt-16 py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Configurações do Site</h1>
            <Link to="/admin" className="btn-outline btn-md flex items-center">
              <ArrowLeft size={18} className="mr-2" />
              Voltar
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Configurações Gerais */}
            <div className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
              <h2 className="mb-4 text-xl font-semibold">Configurações Gerais</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="siteTitle" className="label">
                    Título do Site
                  </label>
                  <input
                    type="text"
                    id="siteTitle"
                    name="siteTitle"
                    value={settings.siteTitle}
                    onChange={handleChange}
                    className="input mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="siteDescription" className="label">
                    Descrição do Site
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    className="textarea mt-1"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="contactFormEmail" className="label">
                    Email do Formulário de Contato
                  </label>
                  <input
                    type="email"
                    id="contactFormEmail"
                    name="contactFormEmail"
                    value={settings.contactFormEmail}
                    onChange={handleChange}
                    className="input mt-1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Configurações de Tema */}
            <div className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
              <h2 className="mb-4 text-xl font-semibold">Configurações de Tema</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="label mb-3">Tema Padrão</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleThemeChange('light')}
                      className={`flex items-center gap-2 rounded-lg border p-3 transition-colors ${
                        settings.defaultTheme === 'light'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'border-dark-200 hover:bg-gray-50 dark:border-dark-700 dark:hover:bg-dark-800'
                      }`}
                    >
                      <Sun size={20} />
                      <span>Claro</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleThemeChange('dark')}
                      className={`flex items-center gap-2 rounded-lg border p-3 transition-colors ${
                        settings.defaultTheme === 'dark'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'border-dark-200 hover:bg-gray-50 dark:border-dark-700 dark:hover:bg-dark-800'
                      }`}
                    >
                      <Moon size={20} />
                      <span>Escuro</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableDarkMode"
                    name="enableDarkMode"
                    checked={settings.enableDarkMode}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <label htmlFor="enableDarkMode" className="label">
                    Permitir alternância entre temas claro/escuro
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações de Interface */}
            <div className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
              <h2 className="mb-4 text-xl font-semibold">Configurações de Interface</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableAnimations"
                    name="enableAnimations"
                    checked={settings.enableAnimations}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <label htmlFor="enableAnimations" className="label">
                    Habilitar animações
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showBlogSection"
                    name="showBlogSection"
                    checked={settings.showBlogSection}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <label htmlFor="showBlogSection" className="label">
                    Mostrar seção de blog (em desenvolvimento)
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações de Analytics */}
            <div className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
              <h2 className="mb-4 text-xl font-semibold">Analytics e SEO</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="googleAnalyticsId" className="label">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    id="googleAnalyticsId"
                    name="googleAnalyticsId"
                    value={settings.googleAnalyticsId}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="G-XXXXXXXXXX"
                  />
                  <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
                    Opcional: ID do Google Analytics para rastreamento
                  </p>
                </div>
              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
              <h2 className="mb-4 text-xl font-semibold">Informações do Sistema</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-medium">Versão do Portfolio:</p>
                  <p className="text-dark-600 dark:text-dark-400">v1.0.0</p>
                </div>
                <div>
                  <p className="font-medium">Framework:</p>
                  <p className="text-dark-600 dark:text-dark-400">React 18 + TypeScript</p>
                </div>
                <div>
                  <p className="font-medium">Banco de Dados:</p>
                  <p className="text-dark-600 dark:text-dark-400">Firebase Firestore</p>
                </div>
                <div>
                  <p className="font-medium">Última Atualização:</p>
                  <p className="text-dark-600 dark:text-dark-400">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary btn-md flex items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Salvar Configurações
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default AdminSettingsPage;