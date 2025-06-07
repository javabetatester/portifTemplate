import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../../services/profileService';
import { uploadImage } from '../../services/storageService';
import { Profile } from '../../types';

const AdminProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Erro ao carregar o perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (profile) {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    setSaving(true);
    
    try {
      let photoUrl = profile.photoUrl;
      
      // Upload photo if selected
      if (photoFile) {
        photoUrl = await uploadImage(
          photoFile,
          'profile',
          (progress) => setUploadProgress(progress)
        );
      }
      
      // Update profile with new photo URL
      const updatedProfile = {
        ...profile,
        photoUrl,
      };
      
      await updateProfile(updatedProfile);
      setProfile(updatedProfile);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar o perfil.');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Editar Perfil</h1>
            <Link to="/admin" className="btn-outline btn-md flex items-center">
              <ArrowLeft size={18} className="mr-2" />
              Voltar
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
              <h2 className="mb-4 text-xl font-semibold">Informações Pessoais</h2>
              
              <div className="mb-6">
                <label htmlFor="photo" className="label mb-2">
                  Foto de Perfil
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-lg bg-gray-200">
                    {(photoPreview || profile.photoUrl) ? (
                      <img
                        src={photoPreview || profile.photoUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="input"
                    />
                    <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
                      Recomendado: 400x400px, máximo 2MB
                    </p>
                  </div>
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-dark-700">
                      <div
                        className="h-2 rounded-full bg-primary-500"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-sm">{Math.round(uploadProgress)}% uploaded</p>
                  </div>
                )}
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="input mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="title" className="label">
                    Título Profissional
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={profile.title}
                    onChange={handleChange}
                    className="input mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="label">
                    Localização
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="input mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="label">
                    Telefone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="input mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="input mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="linkedin" className="label">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleChange}
                    className="input mt-1"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="label">
                    Biografia
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    className="textarea mt-1"
                    rows={4}
                    required
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="objective" className="label">
                    Objetivo Profissional
                  </label>
                  <input
                    type="text"
                    id="objective"
                    name="objective"
                    value={profile.objective}
                    onChange={handleChange}
                    className="input mt-1"
                    required
                  />
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
                    Salvar Alterações
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

export default AdminProfilePage;