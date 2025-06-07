export interface Profile {
  id?: string;
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  bio: string;
  objective: string;
  photoUrl?: string;
}

export interface Skill {
  id?: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  icon: string;
  color?: string;
  featured?: boolean;
  order?: number;
}

export enum SkillCategory {
  LANGUAGE = 'Programming Languages',
  FRAMEWORK = 'Frameworks & Technologies',
  DATABASE = 'Databases',
  TOOL = 'Tools',
  TESTING = 'Testing & Quality',
  OTHER = 'Other',
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;  // <--- MUDANÇA AQUI
  imageUrl?: string | null; // <--- MUDANÇA AQUI
  authorName: string;
  authorId?: string | null; // <--- MUDANÇA AQUI
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  order?: number;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description?: string;
  order?: number;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order?: number;
}

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  icon: string;
}

export interface ThemeConfig {
  darkMode: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}