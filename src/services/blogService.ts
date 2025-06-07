// src/services/blogService.ts
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
  limit,
  type QueryConstraint,
} from 'firebase/firestore';
import { firestore } from './firebase';
import { BlogPost } from '../types';

const BLOG_POSTS_COLLECTION = 'blogPosts';

const generateSlug = (title: string): string => {
  if (!title) return `post-${Date.now()}`;
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const getBlogPostBySlugInternal = async (slug: string): Promise<BlogPost | null> => {
  try {
    const q = query(collection(firestore, BLOG_POSTS_COLLECTION), where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt === undefined ? null : data.excerpt,
      imageUrl: data.imageUrl === undefined ? null : data.imageUrl,
      authorName: data.authorName,
      authorId: data.authorId === undefined ? null : data.authorId,
      tags: data.tags || [],
      isPublished: data.isPublished,
      publishedAt: (data.publishedAt as Timestamp)?.toDate().toISOString(),
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
    } as BlogPost;
  } catch (error) {
    console.error(`Error getting blog post by slug (internal) ${slug}:`, error);
    throw error;
  }
};

export const getBlogPosts = async (count?: number, onlyPublished = true): Promise<BlogPost[]> => {
  // ... (código de getBlogPosts permanece o mesmo da resposta anterior, já estava bom)
  console.log(`[blogService] Fetching blog posts. Count: ${count}, Only Published: ${onlyPublished}`);
  try {
    const queryConstraints: QueryConstraint[] = [];

    if (onlyPublished) {
      console.log("[blogService] Applying filter: isPublished == true");
      queryConstraints.push(where('isPublished', '==', true));
    }
    console.log("[blogService] Applying order: publishedAt desc");
    queryConstraints.push(orderBy('publishedAt', 'desc'));


    if (count) {
      console.log(`[blogService] Applying limit: ${count}`);
      queryConstraints.push(limit(count));
    }

    const postsCollectionRef = collection(firestore, BLOG_POSTS_COLLECTION);
    const postsQuery = query(postsCollectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(postsQuery);

    console.log(`[blogService] Firestore query successful. Found ${querySnapshot.size} documents.`);

    if (querySnapshot.empty) {
      console.log("[blogService] No documents matched the query.");
      return [];
    }

    const posts = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const postEntry: BlogPost = {
        id: docSnap.id,
        title: data.title || "Título Ausente",
        slug: data.slug || "",
        content: data.content || "",
        excerpt: data.excerpt === undefined ? null : data.excerpt,
        imageUrl: data.imageUrl === undefined ? null : data.imageUrl,
        authorName: data.authorName || "Autor Desconhecido",
        authorId: data.authorId === undefined ? null : data.authorId,
        tags: Array.isArray(data.tags) ? data.tags : [],
        isPublished: data.isPublished === true,
        publishedAt: (data.publishedAt as Timestamp)?.toDate().toISOString(),
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
      };
      return postEntry;
    });

    console.log('[blogService] Mapped posts being returned:', posts);
    return posts;
  } catch (error) {
    console.error('[blogService] Error getting blog posts:', error);
    throw error;
  }
};


export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    console.log(`[blogService] Fetching post by slug: ${slug}`);
    return getBlogPostBySlugInternal(slug);
};

export const addBlogPost = async (
  postData: Omit<BlogPost, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'publishedAt'>
): Promise<BlogPost> => {
  console.log("[blogService] Adding new blog post:", postData);
  try {
    const newPostRef = doc(collection(firestore, BLOG_POSTS_COLLECTION));
    let slug = generateSlug(postData.title);

    let counter = 1;
    const originalSlug = slug;
    while (await getBlogPostBySlugInternal(slug)) {
      slug = `${originalSlug}-${counter}`;
      counter++;
      if (counter > 10) {
          throw new Error("Não foi possível gerar um slug único após 10 tentativas.");
      }
    }
    console.log(`[blogService] Generated slug: ${slug}`);

    const now = Timestamp.now();
    // Definindo dataToSave para o Firestore
    const dataToSave = {
      title: postData.title,
      slug: slug, // Slug gerado
      content: postData.content,
      excerpt: postData.excerpt || postData.content.substring(0, 200) + (postData.content.length > 200 ? '...' : '') || null,
      imageUrl: postData.imageUrl || null,
      authorName: postData.authorName,
      authorId: postData.authorId || null,
      tags: postData.tags || [],
      isPublished: postData.isPublished || false,
      createdAt: now,
      updatedAt: now,
      // CORREÇÃO: publishedAt deve ser baseado em isPublished, não em postData.publishedAt (que foi omitido)
      publishedAt: postData.isPublished ? now : null,
    };

    await setDoc(newPostRef, dataToSave);
    console.log("[blogService] Blog post added successfully with ID:", newPostRef.id);

    // Construindo o objeto de retorno explicitamente para garantir a tipagem correta
    const newPostForReturn: BlogPost = {
        id: newPostRef.id,
        title: dataToSave.title,
        slug: dataToSave.slug,
        content: dataToSave.content,
        excerpt: dataToSave.excerpt, // já é string | null
        imageUrl: dataToSave.imageUrl, // já é string | null
        authorName: dataToSave.authorName,
        authorId: dataToSave.authorId, // já é string | null
        tags: dataToSave.tags,
        isPublished: dataToSave.isPublished,
        createdAt: dataToSave.createdAt.toDate().toISOString(),
        updatedAt: dataToSave.updatedAt.toDate().toISOString(),
        publishedAt: dataToSave.publishedAt ? dataToSave.publishedAt.toDate().toISOString() : undefined, // Converte para string ISO ou undefined
    };
    return newPostForReturn;

  } catch (error) {
    console.error('[blogService] Error adding blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (post: BlogPost): Promise<void> => {
  // ... (código de updateBlogPost permanece o mesmo da resposta anterior, já estava bom)
  if (!post.id) throw new Error('Blog post must have an ID to update');
  console.log(`[blogService] Updating blog post ID: ${post.id}`, post);

  try {
    const postRef = doc(firestore, BLOG_POSTS_COLLECTION, post.id);
    const now = Timestamp.now();
    const slug = post.slug || generateSlug(post.title);

    const dataToUpdate = {
      title: post.title,
      slug: slug,
      content: post.content,
      excerpt: post.excerpt || post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '') || null,
      imageUrl: post.imageUrl || null,
      authorName: post.authorName,
      authorId: post.authorId || null,
      tags: post.tags || [],
      isPublished: post.isPublished,
      updatedAt: now,
      publishedAt: post.isPublished
          ? (post.publishedAt ? Timestamp.fromDate(new Date(post.publishedAt)) : now)
          : null,
      // createdAt não é atualizado aqui, mas precisamos lê-lo para convertê-lo de volta para Timestamp se estiver como string
      // Se o post.createdAt já é uma string ISO, convertemos. Se for um Timestamp, usamos diretamente.
      // No entanto, para setDoc com merge, só precisamos fornecer os campos que mudam.
      // Se createdAt não muda, não precisamos incluí-lo.
      // Mas se a estrutura do objeto 'post' que recebemos tem createdAt como string,
      // e quiséssemos ter certeza que ele permanece Timestamp no DB (sem mudá-lo), seria mais complexo.
      // Para {merge: true}, só envie o que mudou.
    };
    
    // Para garantir que createdAt não seja sobrescrito se estiver no objeto 'post'
    // e para manter a consistência, vamos reconstruir o objeto que vai para o Firestore
    // apenas com os campos que queremos salvar/atualizar.
    const firestoreUpdateData: any = {
        title: dataToUpdate.title,
        slug: dataToUpdate.slug,
        content: dataToUpdate.content,
        excerpt: dataToUpdate.excerpt,
        imageUrl: dataToUpdate.imageUrl,
        authorName: dataToUpdate.authorName,
        authorId: dataToUpdate.authorId,
        tags: dataToUpdate.tags,
        isPublished: dataToUpdate.isPublished,
        updatedAt: dataToUpdate.updatedAt, // Já é Timestamp
        publishedAt: dataToUpdate.publishedAt, // Já é Timestamp ou null
    };


    await setDoc(postRef, firestoreUpdateData, { merge: true });
    console.log(`[blogService] Blog post ID: ${post.id} updated successfully.`);
  } catch (error) {
    console.error(`[blogService] Error updating blog post ID: ${post.id}:`, error);
    throw error;
  }
};

export const deleteBlogPost = async (postId: string): Promise<void> => {
  // ... (código de deleteBlogPost permanece o mesmo)
  console.log(`[blogService] Deleting blog post ID: ${postId}`);
  try {
    await deleteDoc(doc(firestore, BLOG_POSTS_COLLECTION, postId));
    console.log(`[blogService] Blog post ID: ${postId} deleted successfully.`);
  } catch (error) {
    console.error(`[blogService] Error deleting blog post ID: ${postId}:`, error);
    throw error;
  }
};

export const initializeBlogPostsIfNeeded = async (): Promise<void> => {
  // ... (código de initializeBlogPostsIfNeeded permanece o mesmo)
  console.log("[blogService] Checking if blog posts need initialization...");
  const postsSnapshot = await getDocs(query(collection(firestore, BLOG_POSTS_COLLECTION), limit(1)));
  if (postsSnapshot.empty) {
    console.log("[blogService] No blog posts found. Initializing with default data...");
    const defaultPosts: Array<Omit<BlogPost, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'publishedAt'>> = [
      {
        title: 'Bem-vindo ao Novo Blog!',
        content: 'Este é o conteúdo do meu **primeiro post** usando *Markdown*. \n\n## Funcionalidades\n\n- Listagem de Posts\n- Visualização Individual\n- Gerenciamento via Admin\n\n```typescript\nfunction greet(message: string) {\n  console.log(message);\n}\ngreet("Olá, Mundo do Blog!");\n```\n\nEspero que gostem!',
        authorName: 'Bernardo Kunz',
        tags: ['introdução', 'react', 'firebase'],
        isPublished: true,
        excerpt: 'Uma breve introdução e visão geral sobre o novo sistema de blog implementado neste portfólio.',
        imageUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        title: 'Dominando Tailwind CSS para Designs Responsivos',
        content: 'Tailwind CSS é um framework CSS utility-first que pode acelerar drasticamente seu fluxo de trabalho de desenvolvimento frontend...\n\n### Principais Vantagens\n\n1.  **Desenvolvimento Rápido:** Classes utilitárias prontas para uso.\n2.  **Customizável:** Altamente configurável através do `tailwind.config.js`.\n3.  **Responsividade:** Modificadores como `sm:`, `md:`, `lg:` facilitam o design responsivo.\n\nNeste portfólio, Tailwind foi essencial para criar uma UI moderna e consistente.',
        authorName: 'Bernardo Kunz',
        tags: ['css', 'tailwindcss', 'frontend', 'design responsivo'],
        isPublished: true,
        excerpt: 'Explore como o Tailwind CSS pode transformar sua maneira de construir interfaces de usuário responsivas e elegantes.',
        imageUrl: 'https://images.pexels.com/photos/169573/pexels-photo-169573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      }
    ];
    try {
      for (const post of defaultPosts) {
        await addBlogPost(post);
      }
      console.log('[blogService] Blog posts initialized with default data');
    } catch (initError) {
        console.error("[blogService] Error initializing blog posts: ", initError);
    }
  } else {
    console.log("[blogService] Blog posts already exist or initialization is not needed.");
  }
};