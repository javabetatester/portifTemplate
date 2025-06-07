import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16 flex min-h-screen items-center justify-center py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md"
        >
          <div className="rounded-lg border border-dark-200 bg-white p-8 shadow-md dark:border-dark-800 dark:bg-dark-900">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold">Admin Login</h1>
              <p className="text-dark-600 dark:text-dark-400">
                Entre com suas credenciais para acessar o painel administrativo
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="input mt-1"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="label">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  className="input mt-1"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn-primary btn-md w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
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
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </button>
              
              <div className="mt-4 text-center text-sm text-dark-600 dark:text-dark-400">
                <p>
                  Para criar uma conta de administrador, configure o Firebase Authentication
                  e crie um usuário com email e senha.
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdminLoginPage;