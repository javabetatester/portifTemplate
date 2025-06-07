import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Experience } from '../../types';
import { getExperiences, addExperience, updateExperience, deleteExperience } from '../../services/experienceService';

const AdminExperiencePage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
        toast.error('Error loading experiences.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingExperience) return;
    
    setSaving(true);
    
    try {
      if (editingExperience.id) {
        await updateExperience(editingExperience);
        setExperiences(experiences.map(exp => 
          exp.id === editingExperience.id ? editingExperience : exp
        ));
        toast.success('Experience updated successfully!');
      } else {
        const newExperience = await addExperience(editingExperience);
        setExperiences([...experiences, newExperience]);
        toast.success('Experience added successfully!');
      }
      setEditingExperience(null);
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Error saving experience.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter(exp => exp.id !== id));
      toast.success('Experience deleted successfully!');
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Error deleting experience.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingExperience) {
      setEditingExperience({
        ...editingExperience,
        [name]: value,
      });
    }
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
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Manage Experience</h1>
            <Link to="/admin" className="btn-outline btn-md flex items-center">
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Link>
          </div>

          <div className="mb-8">
            <button
              onClick={() => setEditingExperience({
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: null,
                current: false,
                description: '',
                responsibilities: [],
                technologies: [],
              })}
              className="btn-primary btn-md"
            >
              Add New Experience
            </button>
          </div>

          {editingExperience && (
            <form onSubmit={handleSubmit} className="mb-8 space-y-6">
              <div className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
                <h2 className="mb-4 text-xl font-semibold">
                  {editingExperience.id ? 'Edit Experience' : 'Add Experience'}
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="title" className="label">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editingExperience.title}
                      onChange={handleChange}
                      className="input mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="label">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={editingExperience.company}
                      onChange={handleChange}
                      className="input mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="label">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={editingExperience.location}
                      onChange={handleChange}
                      className="input mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="startDate" className="label">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={editingExperience.startDate}
                      onChange={handleChange}
                      className="input mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="label">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={editingExperience.endDate || ''}
                      onChange={handleChange}
                      className="input mt-1"
                      disabled={editingExperience.current}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="current"
                      name="current"
                      checked={editingExperience.current}
                      onChange={(e) => setEditingExperience({
                        ...editingExperience,
                        current: e.target.checked,
                        endDate: e.target.checked ? null : editingExperience.endDate
                      })}
                      className="mr-2"
                    />
                    <label htmlFor="current" className="label">Current Position</label>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="label">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={editingExperience.description}
                      onChange={handleChange}
                      className="textarea mt-1"
                      rows={4}
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingExperience(null)}
                    className="btn-outline btn-md"
                  >
                    Cancel
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Experience
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-6">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{experience.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingExperience(experience)}
                      className="btn-outline btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => experience.id && handleDelete(experience.id)}
                      className="btn-outline btn-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <p className="mb-2 font-medium">{experience.company}</p>
                <p className="mb-2 text-dark-600 dark:text-dark-400">{experience.location}</p>
                <p className="mb-4 text-dark-600 dark:text-dark-400">
                  {new Date(experience.startDate).toLocaleDateString()} - 
                  {experience.current ? ' Present' : experience.endDate ? ` ${new Date(experience.endDate).toLocaleDateString()}` : ''}
                </p>
                <p className="text-dark-700 dark:text-dark-300">{experience.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdminExperiencePage;