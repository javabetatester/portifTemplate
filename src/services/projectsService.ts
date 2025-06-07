import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { Project } from '../types';

const PROJECTS_COLLECTION = 'projects';

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsQuery = query(
      collection(firestore, PROJECTS_COLLECTION),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(projectsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Project
    }));
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const addProject = async (project: Project): Promise<Project> => {
  try {
    const newProjectRef = doc(collection(firestore, PROJECTS_COLLECTION));
    const projectWithId = { ...project, id: newProjectRef.id };
    
    await setDoc(newProjectRef, projectWithId);
    return projectWithId;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const updateProject = async (project: Project): Promise<void> => {
  if (!project.id) throw new Error('Project must have an ID to update');
  
  try {
    await setDoc(doc(firestore, PROJECTS_COLLECTION, project.id), project, { merge: true });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, PROJECTS_COLLECTION, projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Initialize with default projects if collection is empty
export const initializeProjectsIfNeeded = async (): Promise<void> => {
  const projects = await getProjects();
  
  if (projects.length === 0) {
    const defaultProjects: Omit<Project, 'id'>[] = [
      {
        title: 'API RESTful de Gerenciamento de Tarefas',
        description: 'Uma API completa para gerenciamento de tarefas usando Spring Boot, seguindo padrões RESTful e boas práticas de design. Implementa autenticação JWT, documentação com Swagger e testes automatizados.',
        imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
        technologies: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'Swagger', 'JUnit', 'Mockito'],
        githubUrl: 'https://github.com/javabetatester',
        featured: true,
        order: 1
      },
      {
        title: 'Sistema de Gerenciamento de Biblioteca',
        description: 'Aplicação para gerenciamento de acervo de biblioteca universitária. Implementa funcionalidades de empréstimo, devolução, reserva e controle de acervo usando arquitetura em camadas.',
        imageUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
        technologies: ['Java', 'Spring MVC', 'Thymeleaf', 'MySQL', 'Hibernate', 'Bootstrap'],
        githubUrl: 'https://github.com/javabetatester',
        featured: true,
        order: 2
      },
      {
        title: 'Microservices com Spring Cloud',
        description: 'Arquitetura de microserviços implementada com Spring Cloud, incluindo service discovery, API gateway, circuit breakers e comunicação entre serviços.',
        imageUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
        technologies: ['Java', 'Spring Boot', 'Spring Cloud', 'Netflix Eureka', 'Resilience4j', 'Docker', 'Kubernetes'],
        githubUrl: 'https://github.com/javabetatester',
        featured: false,
        order: 3
      }
    ];
    
    for (const project of defaultProjects) {
      await addProject(project);
    }
  }
};