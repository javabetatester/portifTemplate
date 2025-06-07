import { useEffect, useState } from 'react';
import HeroSection from '../components/sections/HeroSection';
import SkillsSection from '../components/sections/SkillsSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ContactSection from '../components/sections/ContactSection';
import { getProfile } from '../services/profileService';
import { getSkills } from '../services/skillsService';
import { getExperiences } from '../services/experienceService';
import { getProjects } from '../services/projectsService';
import { Experience, Profile, Project, Skill } from '../types';

const HomePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, skillsData, experiencesData, projectsData] = await Promise.all([
          getProfile(),
          getSkills(),
          getExperiences(),
          getProjects(),
        ]);

        setProfile(profileData);
        setSkills(skillsData);
        setExperiences(experiencesData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <>
      <HeroSection profile={profile} />
      <SkillsSection skills={skills} />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={projects} />
      <ContactSection profile={profile} />
    </>
  );
};

export default HomePage;