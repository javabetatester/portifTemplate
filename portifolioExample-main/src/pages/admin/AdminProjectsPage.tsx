import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Edit, ExternalLink, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Project } from '../../types';
import { getProjects, addProject, updateProject, deleteProject } from '../../services/projectsService';

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Erro ao carregar projetos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProject) return;
    
    setSaving(true);
    
    try {
      if (editingProject.id) {
        await updateProject(editingProject);
        setProjects(projects.map(proj => 
          proj.id === editingProject.id ? editingProject : proj
        ));
        toast.success('Projeto atualizado com sucesso!');
      } else {
        const newProject = await addProject(editingProject);
        setProjects([...projects, newProject]);
        toast.success('Projeto adicionado com sucesso!');
      }
      
      setEditingProject(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Erro ao salvar projeto.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;
    
    try {
      await deleteProject(id);
      setProjects(projects.filter(proj => proj.id !== id));
      toast.success('Projeto excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Erro ao excluir projeto.');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProject({
      title: '',
      description: '',
      imageUrl: '',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
      featured: false,
      order: projects.length + 1
    });
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        [name]: type === 'number' ? parseInt(value) : 
                type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingProject) {
      const technologies = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech);
      setEditingProject({
        ...editingProject,
        technologies
      });
    }
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section className="mt-16 py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-6xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Gerenciar Projetos</h1>
            <div className="flex gap-4">
              <button
                onClick={handleAddNew}
                className="btn-primary btn-md flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Adicionar Projeto
              </button>
              <Link to="/admin" className="btn-outline btn-md flex items-center">
                <ArrowLeft size={18} className="mr-2" />
                Voltar
              </Link>
            </div>
          </div>

          {showForm && editingProject && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <form onSubmit={handleSubmit} className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
                <h2 className="mb-4 text-xl font-semibold">
                  {editingProject.id ? 'Editar Projeto' : 'Adicionar Projeto'}
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="label">Título</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editingProject.title}
                      onChange={handleChange}
                      className="input mt-1"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="label">Descrição</label>
                    <textarea
                      id="description"
                      name="description"
                      value={editingProject.description}
                      onChange={handleChange}
                      className="textarea mt-1"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="imageUrl" className="label">URL da Imagem</label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={editingProject.imageUrl}
                      onChange={handleChange}
                      className="input mt-1"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="technologies" className="label">
                      Tecnologias (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      id="technologies"
                      value={editingProject.technologies.join(', ')}
                      onChange={handleTechnologiesChange}
                      className="input mt-1"
                      placeholder="Java, Spring Boot, MySQL"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="githubUrl" className="label">URL do GitHub</label>
                    <input
                      type="url"
                      id="githubUrl"
                      name="githubUrl"
                      value={editingProject.githubUrl || ''}
                      onChange={handleChange}
                      className="input mt-1"
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="liveUrl" className="label">URL do Site (Demo)</label>
                    <input
                      type="url"
                      id="liveUrl"
                      name="liveUrl"
                      value={editingProject.liveUrl || ''}
                      onChange={handleChange}
                      className="input mt-1"
                      placeholder="https://projeto-demo.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="order" className="label">Ordem</label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      value={editingProject.order || 0}
                      onChange={handleChange}
                      className="input mt-1"
                      min="0"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={editingProject.featured || false}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="featured" className="label">Projeto em Destaque</label>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="btn-outline btn-md"
                  >
                    Cancelar
                  </button>
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
                        Salvar Projeto
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="overflow-hidden rounded-lg border border-dark-200 bg-white shadow-sm dark:border-dark-800 dark:bg-dark-900"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => project.id && handleDelete(project.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="mb-3 text-sm text-dark-600 dark:text-dark-400 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="mb-3">
                    {project.featured && (
                      <span className="badge-accent text-xs mr-2">
                        Destaque
                      </span>
                    )}
                    <span className="text-xs text-dark-500 dark:text-dark-400">
                      Ordem: {project.order || 0}
                    </span>
                  </div>
                  
                  <div className="mb-3 flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className="badge-primary text-xs">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-dark-500">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline btn-sm flex items-center"
                      >
                        <Github size={14} className="mr-1" />
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary btn-sm flex items-center"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-600 dark:text-dark-400">
                Nenhum projeto encontrado. Adicione seu primeiro projeto!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AdminProjectsPage;