import { Github as GitHub, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-100 bg-white py-8 dark:border-dark-800 dark:bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo and Bio */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-primary-600 dark:text-primary-400">
                {'${BK}'}
              </span>
              <span className="font-semibold">Bernardo Kunz</span>
            </Link>
            <p className="mt-4 text-sm text-dark-600 dark:text-dark-400">
              Desenvolvedor Java especializado em criar soluções robustas e escaláveis 
              com foco em código limpo e boas práticas de desenvolvimento.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Projetos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary-600 dark:text-primary-400" />
                <a 
                  href="mailto:bernardokunz@gmail.com"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  bernardokunz@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin size={16} className="text-primary-600 dark:text-primary-400" />
                <a 
                  href="https://www.linkedin.com/in/bernardokunz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  linkedin.com/in/bernardokunz
                </a>
              </li>
              <li className="flex items-center gap-2">
                <GitHub size={16} className="text-primary-600 dark:text-primary-400" />
                <a 
                  href="https://github.com/javabetatester"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  github.com/javabetatester
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-dark-100 pt-6 text-center text-sm dark:border-dark-800">
          <p>
            &copy; {currentYear} Bernardo Kunz. Todos os direitos reservados.
          </p>
          <p className="mt-2 text-dark-500 dark:text-dark-400">
            Desenvolvido com React, TypeScript e Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;