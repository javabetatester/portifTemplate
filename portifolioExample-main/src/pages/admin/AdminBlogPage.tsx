// src/pages/admin/AdminBlogPage.tsx
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Edit } from 'lucide-react'; // Newspaper removido (não usado aqui)
import { useEffect, useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BlogPost } from '../../types';
import { getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from '../../services/blogService';
// import ImageUpload from '../../components/ui/ImageUpload'; // REMOVER ESTA LINHA
// import { uploadImage } from '../../services/storageService'; // REMOVER ESTA LINHA
import { useAuth } from '../../hooks/useAuth';

const AdminBlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [showForm, setShowForm] = useState(false);
  // REMOVER ESTADOS RELACIONADOS AO UPLOAD DE ARQUIVO
  // const [imageFile, setImageFile] = useState<File | null>(null);
  // const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const { currentUser } = useAuth();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBlogPosts(undefined, false);
      setPosts(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Erro ao carregar posts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // REMOVER FUNÇÕES DE CALLBACK DO IMAGEUPLOAD
  // const handleImageSelected = (file: File) => { ... };
  // const handleImageRemoved = () => { ... };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (editingPost) {
      const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
      setEditingPost({
        ...editingPost,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag),
      });
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setShowForm(false);
    // setImageFile(null); // REMOVER
    // setImageUploadProgress(0); // REMOVER
  };

  const handleAddNew = () => {
    setEditingPost({
      title: '',
      content: '',
      authorName: currentUser?.displayName || 'Admin',
      isPublished: false,
      tags: [],
      excerpt: '',
      imageUrl: '', // Inicializar como string vazia para o input
    });
    setShowForm(true);
    // setImageFile(null); // REMOVER
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setShowForm(true);
    // setImageFile(null); // REMOVER
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title || !editingPost.content) {
      toast.error('Título e Conteúdo são obrigatórios.');
      return;
    }
    setIsSaving(true);
    // setImageUploadProgress(0); // REMOVER

    // imageUrl agora vem diretamente do editingPost.imageUrl (que é um input de texto)
    const finalImageUrl = editingPost.imageUrl?.trim() ? editingPost.imageUrl.trim() : null;

    const postDataSubmit = {
      ...editingPost,
      imageUrl: finalImageUrl, // Usar o link do input, ou null se estiver vazio
      authorName: editingPost.authorName || currentUser?.displayName || "Admin",
    };

    try {
      if (editingPost.id) {
        // @ts-ignore // Temporário para contornar checagens de tipo estritas durante a refatoração
        await updateBlogPost(postDataSubmit as BlogPost);
        toast.success('Post atualizado com sucesso!');
      } else {
        const { id, slug, createdAt, updatedAt, publishedAt, ...newPostData } = postDataSubmit;
        // @ts-ignore // Temporário
        await addBlogPost(newPostData as Omit<BlogPost, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { authorName: string });
        toast.success('Post adicionado com sucesso!');
      }
      resetForm();
      fetchPosts();
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(`Erro ao salvar post: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      await deleteBlogPost(postId);
      toast.success('Post excluído com sucesso!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Erro ao excluir post.');
    }
  };

  if (isLoading) {
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
            <h1 className="text-3xl font-bold">Gerenciar Blog Posts</h1>
            <div className="flex gap-4">
              <button
                onClick={handleAddNew}
                className="btn-primary btn-md flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Adicionar Post
              </button>
              <Link to="/admin" className="btn-outline btn-md flex items-center">
                <ArrowLeft size={18} className="mr-2" />
                Voltar
              </Link>
            </div>
          </div>

          {showForm && editingPost && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <form onSubmit={handleSubmit} className="rounded-lg border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-800 dark:bg-dark-900">
                <h2 className="mb-6 text-xl font-semibold">
                  {editingPost.id ? 'Editar Post' : 'Adicionar Novo Post'}
                </h2>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="label">Título</label>
                    <input type="text" id="title" name="title" value={editingPost.title || ''} onChange={handleChange} className="input mt-1" required />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="content" className="label">Conteúdo (Markdown)</label>
                    <textarea id="content" name="content" value={editingPost.content || ''} onChange={handleChange} className="textarea mt-1 min-h-[200px]" rows={10} required />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="excerpt" className="label">Resumo (Opcional)</label>
                    <textarea id="excerpt" name="excerpt" value={editingPost.excerpt || ''} onChange={handleChange} className="textarea mt-1" rows={3} />
                  </div>
                  
                  {/* NOVO CAMPO PARA LINK DA IMAGEM */}
                  <div className="md:col-span-2">
                    <label htmlFor="imageUrl" className="label">Link da Imagem de Destaque (Opcional)</label>
                    <input 
                        type="url" 
                        id="imageUrl" 
                        name="imageUrl" 
                        value={editingPost.imageUrl || ''} 
                        onChange={handleChange} 
                        className="input mt-1" 
                        placeholder="https://exemplo.com/imagem.jpg" 
                    />
                    {editingPost.imageUrl && (
                        <div className="mt-2">
                            <img src={editingPost.imageUrl} alt="Preview da imagem" className="max-h-40 rounded-md border border-dark-200 dark:border-dark-700" />
                        </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tags" className="label">Tags (separadas por vírgula)</label>
                    <input type="text" id="tags" name="tags" value={(editingPost.tags || []).join(', ')} onChange={handleTagsChange} className="input mt-1" />
                  </div>
                   <div className="flex items-center md:col-span-1 self-end pb-1">
                    <input type="checkbox" id="isPublished" name="isPublished" checked={editingPost.isPublished || false} onChange={handleChange} className="mr-2 h-4 w-4" />
                    <label htmlFor="isPublished" className="label">Publicar Post?</label>
                  </div>
                  {/* REMOVER O COMPONENTE ImageUpload */}
                </div>
                
                <div className="mt-8 flex justify-end gap-4 border-t border-dark-200 pt-6 dark:border-dark-700">
                  <button type="button" onClick={resetForm} className="btn-outline btn-md">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary btn-md flex items-center" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Salvar Post
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border border-dark-200 bg-white p-4 shadow-sm dark:border-dark-800 dark:bg-dark-900"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      Autor: {post.authorName} | Criado em: {new Date(post.createdAt).toLocaleDateString()}
                      {post.publishedAt && ` | Publicado em: ${new Date(post.publishedAt).toLocaleDateString()}`}
                    </p>
                     <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100'}`}>
                        {post.isPublished ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => handleEdit(post)} className="btn-outline btn-sm p-2">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => post.id && handleDelete(post.id)} className="btn-outline btn-sm p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {posts.length === 0 && !isLoading && (
            <p className="py-8 text-center text-dark-500 dark:text-dark-400">Nenhum post encontrado. Clique em "Adicionar Post" para começar.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
export default AdminBlogPage;