import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Skill, SkillCategory } from '../../types';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../../services/skillsService';

const AdminSkillsPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Erro ao carregar habilidades.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSkill) return;
    
    setSaving(true);
    
    try {
      if (editingSkill.id) {
        await updateSkill(editingSkill);
        setSkills(skills.map(skill => 
          skill.id === editingSkill.id ? editingSkill : skill
        ));
        toast.success('Habilidade atualizada com sucesso!');
      } else {
        const newSkill = await addSkill(editingSkill);
        setSkills([...skills, newSkill]);
        toast.success('Habilidade adicionada com sucesso!');
      }
      
      setEditingSkill(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving skill:', error);
      toast.error('Erro ao salvar habilidade.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta habilidade?')) return;
    
    try {
      await deleteSkill(id);
      setSkills(skills.filter(skill => skill.id !== id));
      toast.success('Habilidade excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Erro ao excluir habilidade.');
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSkill({
      name: '',
      category: SkillCategory.LANGUAGE,
      proficiency: 50,
      icon: '',
      color: '#0d96ea',
      featured: false,
      order: skills.length + 1
    });
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (editingSkill) {
      setEditingSkill({
        ...editingSkill,
        [name]: type === 'number' ? parseInt(value) : 
                type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const cancelEdit = () => {
    setEditingSkill(null);
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
            <h1 className="text-3xl font-bold">Gerenciar Habilidades</h1>
            <div className="flex gap-4">
              <button
                onClick={handleAddNew}
                className="btn-primary btn-md flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Adicionar Habilidade
              </button>
              <Link to="/admin" className="btn-outline btn-md flex items-center">
                <ArrowLeft size={18} className="mr-2" />
                Voltar
              </Link>
            </div>
          </div>

          {showForm && editingSkill && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <form onSubmit={handleSubmit} className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
                <h2 className="mb-4 text-xl font-semibold">
                  {editingSkill.id ? 'Editar Habilidade' : 'Adicionar Habilidade'}
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label htmlFor="name" className="label">Nome</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editingSkill.name}
                      onChange={handleChange}
                      className="input mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="label">Categoria</label>
                    <select
                      id="category"
                      name="category"
                      value={editingSkill.category}
                      onChange={handleChange}
                      className="input mt-1"
                      required
                    >
                      {Object.values(SkillCategory).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="proficiency" className="label">
                      Proficiência ({editingSkill.proficiency}%)
                    </label>
                    <input
                      type="range"
                      id="proficiency"
                      name="proficiency"
                      min="0"
                      max="100"
                      value={editingSkill.proficiency}
                      onChange={handleChange}
                      className="mt-1 w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="icon" className="label">Ícone</label>
                    <input
                      type="text"
                      id="icon"
                      name="icon"
                      value={editingSkill.icon}
                      onChange={handleChange}
                      className="input mt-1"
                      placeholder="Ex: java, spring, etc."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="color" className="label">Cor</label>
                    <input
                      type="color"
                      id="color"
                      name="color"
                      value={editingSkill.color}
                      onChange={handleChange}
                      className="mt-1 h-10 w-full rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="order" className="label">Ordem</label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      value={editingSkill.order || 0}
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
                      checked={editingSkill.featured || false}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="featured" className="label">Destacar</label>
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
                        Salvar Habilidade
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: skill.color }}
                    ></div>
                    <h3 className="text-lg font-semibold">{skill.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => skill.id && handleDelete(skill.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <span className="badge-secondary text-xs">
                    {skill.category}
                  </span>
                  {skill.featured && (
                    <span className="ml-2 badge-accent text-xs">
                      Destacado
                    </span>
                  )}
                </div>
                
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Proficiência</span>
                  <span className="font-medium">{skill.proficiency}%</span>
                </div>
                
                <div className="skill-bar mb-4">
                  <div
                    className="skill-progress"
                    style={{
                      width: `${skill.proficiency}%`,
                      backgroundColor: skill.color
                    }}
                  ></div>
                </div>
                
                <div className="text-sm text-dark-600 dark:text-dark-400">
                  <p>Ícone: {skill.icon}</p>
                  <p>Ordem: {skill.order || 0}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {skills.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-600 dark:text-dark-400">
                Nenhuma habilidade encontrada. Adicione sua primeira habilidade!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AdminSkillsPage;