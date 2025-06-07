// src/services/dataService.ts
import { initializeProfileIfNeeded } from './profileService';
import { initializeSkillsIfNeeded } from './skillsService';
import { initializeExperiencesIfNeeded } from './experienceService';
import { initializeProjectsIfNeeded } from './projectsService';
import { initializeBlogPostsIfNeeded } from './blogService'; // Assegure que esta linha está correta

export const initializeData = async (): Promise<void> => {
  try {
    await Promise.all([
      initializeProfileIfNeeded(),
      initializeSkillsIfNeeded(),
      initializeExperiencesIfNeeded(),
      initializeProjectsIfNeeded(),
      initializeBlogPostsIfNeeded(),
    ]);
    console.log('Database initialized with default data (including blog posts).');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};