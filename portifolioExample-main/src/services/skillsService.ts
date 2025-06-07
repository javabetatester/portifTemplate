import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { Skill, SkillCategory } from '../types';

const SKILLS_COLLECTION = 'skills';

export const getSkills = async (): Promise<Skill[]> => {
  try {
    const skillsQuery = query(collection(firestore, SKILLS_COLLECTION), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(skillsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Skill
    }));
  } catch (error) {
    console.error('Error getting skills:', error);
    throw error;
  }
};

export const addSkill = async (skill: Skill): Promise<Skill> => {
  try {
    const newSkillRef = doc(collection(firestore, SKILLS_COLLECTION));
    const skillWithId = { ...skill, id: newSkillRef.id };
    
    await setDoc(newSkillRef, skillWithId);
    return skillWithId;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};

export const updateSkill = async (skill: Skill): Promise<void> => {
  if (!skill.id) throw new Error('Skill must have an ID to update');
  
  try {
    await setDoc(doc(firestore, SKILLS_COLLECTION, skill.id), skill, { merge: true });
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

export const deleteSkill = async (skillId: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, SKILLS_COLLECTION, skillId));
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

// Initialize with default skills if collection is empty
export const initializeSkillsIfNeeded = async (): Promise<void> => {
  const skills = await getSkills();
  
  if (skills.length === 0) {
    const defaultSkills: Omit<Skill, 'id'>[] = [
      {
        name: 'Java',
        category: SkillCategory.LANGUAGE,
        proficiency: 85,
        icon: 'java',
        color: '#5382a1',
        featured: true,
        order: 1
      },
      {
        name: 'Spring Boot',
        category: SkillCategory.FRAMEWORK,
        proficiency: 80,
        icon: 'spring',
        color: '#6db33f',
        featured: true,
        order: 2
      },
      {
        name: 'Hibernate/JPA',
        category: SkillCategory.FRAMEWORK,
        proficiency: 75,
        icon: 'hibernate',
        color: '#bcae79',
        featured: true,
        order: 3
      },
      {
        name: 'Oracle Database',
        category: SkillCategory.DATABASE,
        proficiency: 75,
        icon: 'oracle',
        color: '#f80000',
        featured: true,
        order: 4
      },
      {
        name: 'Git',
        category: SkillCategory.TOOL,
        proficiency: 80,
        icon: 'git',
        color: '#f05032',
        featured: true,
        order: 5
      },
      {
        name: 'REST APIs',
        category: SkillCategory.FRAMEWORK,
        proficiency: 85,
        icon: 'api',
        color: '#44CC11',
        featured: true,
        order: 6
      }
    ];
    
    for (const skill of defaultSkills) {
      await addSkill(skill);
    }
  }
};