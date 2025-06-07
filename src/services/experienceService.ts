import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { Experience } from '../types';

const EXPERIENCES_COLLECTION = 'experiences';

export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const experiencesQuery = query(
      collection(firestore, EXPERIENCES_COLLECTION),
      orderBy('startDate', 'desc')
    );
    const querySnapshot = await getDocs(experiencesQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Experience
    }));
  } catch (error) {
    console.error('Error getting experiences:', error);
    throw error;
  }
};

export const addExperience = async (experience: Experience): Promise<Experience> => {
  try {
    const newExperienceRef = doc(collection(firestore, EXPERIENCES_COLLECTION));
    const experienceWithId = { ...experience, id: newExperienceRef.id };
    
    await setDoc(newExperienceRef, experienceWithId);
    return experienceWithId;
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
};

export const updateExperience = async (experience: Experience): Promise<void> => {
  if (!experience.id) throw new Error('Experience must have an ID to update');
  
  try {
    await setDoc(doc(firestore, EXPERIENCES_COLLECTION, experience.id), experience, { merge: true });
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

export const deleteExperience = async (experienceId: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, EXPERIENCES_COLLECTION, experienceId));
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};

// Initialize with default experiences if collection is empty
export const initializeExperiencesIfNeeded = async (): Promise<void> => {
  const experiences = await getExperiences();
  
  if (experiences.length === 0) {
    const defaultExperiences: Omit<Experience, 'id'>[] = [
      {
        title: 'Assistente de T.I',
        company: 'Metasa S.A.',
        location: 'Passo Fundo, RS - Presencial',
        startDate: '2025-02-01',
        endDate: null,
        current: true,
        description: 'Desenvolvimento e manutenção de sistemas ERP corporativos usando Java e Spring Boot.',
        responsibilities: [
          'Desenvolvimento e manutenção de componentes backend para sistemas ERP utilizando Java 17+ e Spring Boot',
          'Implementação de APIs REST para integração entre sistemas internos',
          'Modelagem e otimização de consultas em Oracle Database, resultando em 30% de melhoria na performance',
          'Aplicação de Design Patterns (Factory, Strategy) e Clean Architecture para melhorar manutenibilidade',
          'Automação de processos usando Spring Batch para atualização e consistência de dados corporativos',
          'Implementação de testes unitários com JUnit 5 e Mockito, alcançando 80% de cobertura'
        ],
        technologies: ['Java 17', 'Spring Boot', 'Oracle Database', 'REST APIs', 'JUnit 5', 'Mockito'],
        order: 1
      },
      {
        title: 'Auxiliar de T.I',
        company: 'KUHN Group',
        location: 'Brasil - Presencial',
        startDate: '2020-11-01',
        endDate: '2021-12-31',
        current: false,
        description: 'Auxiliar no desenvolvimento e manutenção de módulos para sistemas ERP.',
        responsibilities: [
          'Desenvolvimento de módulos em Java e Delphi para sistemas ERP corporativos',
          'Implementação de scripts PL/SQL para manutenção e migração de banco de dados',
          'Colaboração no desenvolvimento de APIs REST para integração de sistemas legados',
          'Manutenção de ambientes de desenvolvimento e homologação usando Docker',
          'Participação em code reviews e aplicação de boas práticas de desenvolvimento'
        ],
        technologies: ['Java', 'Delphi', 'PL/SQL', 'Docker', 'REST APIs'],
        order: 2
      },
      {
        title: 'Jovem Aprendiz - Serviços Comerciais',
        company: 'Havan',
        location: 'Passo Fundo, RS - Presencial',
        startDate: '2019-02-01',
        endDate: '2020-03-31',
        current: false,
        description: 'Auxiliar em atividades comerciais e administrativas.',
        responsibilities: [
          'Atuação na área de escritórios auxiliando com documentações empresariais',
          'Trabalho com Microsoft Excel e Office 365 para controle de dados',
          'Auxiliar na restocagem de produtos e manutenção de setores',
          'Desenvolvimento de habilidades organizacionais e trabalho em equipe'
        ],
        technologies: ['Microsoft Office', 'Excel', 'Office 365'],
        order: 3
      },
      {
        title: 'Jovem Aprendiz - Auxiliar de Escritório',
        company: 'Flexsul Distribuidora',
        location: 'Passo Fundo, RS - Presencial',
        startDate: '2017-06-01',
        endDate: '2018-07-31',
        current: false,
        description: 'Auxiliar em atividades administrativas e de escritório.',
        responsibilities: [
          'Auxiliar na parte administrativa em organização de documentos',
          'Atualização de dados de funcionários em Excel e sistemas internos',
          'Trabalho com Microsoft Power BI para relatórios básicos',
          'Controle de estoque e documentação empresarial'
        ],
        technologies: ['Microsoft Office', 'Excel', 'Power BI'],
        order: 4
      },
      {
        title: 'Jovem Aprendiz - Desenvolvedor',
        company: 'Splora Tecnologia',
        location: 'Brasil - Presencial',
        startDate: '2016-01-01',
        endDate: '2017-01-31',
        current: false,
        description: 'Desenvolvimento de funcionalidades para sistema interno de gestão.',
        responsibilities: [
          'Desenvolvimento de funcionalidades CRUD para sistema interno de gestão usando Java',
          'Implementação de interfaces web responsivas com JavaScript, HTML e CSS',
          'Participação em projetos colaborativos usando metodologia Scrum',
          'Aplicação inicial de conceitos de qualidade de código e testes unitários'
        ],
        technologies: ['Java', 'JavaScript', 'HTML', 'CSS', 'Scrum'],
        order: 5
      }
    ];
    
    for (const experience of defaultExperiences) {
      await addExperience(experience);
    }
  }
};