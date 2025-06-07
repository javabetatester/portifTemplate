import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { Profile } from '../types';

const PROFILE_COLLECTION = 'profile';
const PROFILE_DOCUMENT_ID = 'main'; // We'll just use a single profile document

export const getProfile = async (): Promise<Profile | null> => {
  try {
    const docRef = doc(firestore, PROFILE_COLLECTION, PROFILE_DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Profile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

export const updateProfile = async (profile: Profile): Promise<void> => {
  try {
    const docRef = doc(firestore, PROFILE_COLLECTION, PROFILE_DOCUMENT_ID);
    await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Initialize with default profile if it doesn't exist
export const initializeProfileIfNeeded = async (): Promise<void> => {
  const profile = await getProfile();
  
  if (!profile) {
    const defaultProfile: Profile = {
      name: 'Bernardo Kunz',
      title: 'Java Junior Developer',
      location: 'Passo Fundo, Rio Grande do Sul, Brasil',
      phone: '+55 54 9 96315683',
      email: 'bernardokunz@gmail.com',
      linkedin: 'www.linkedin.com/in/bernardokunz/',
      bio: 'Desenvolvedor Backend especializado em Java e Spring Boot com experiência sólida em desenvolvimento de sistemas corporativos e APIs RESTful. Possuo conhecimentos avançados em arquitetura de software, bancos de dados Oracle e desenvolvimento de soluções escaláveis. Focado em código limpo, boas práticas e entrega de valor através de soluções robustas que impactem positivamente o negócio.',
      objective: 'Desenvolvedor Backend',
      photoUrl: 'https://cdn.discordapp.com/attachments/1378163011579281511/1378535365157195848/1747363212609.png?ex=6845865b&is=684434db&hm=0dfa8f1665427f5579d615fa667b6ba48871e40f7902ceaf0b95c07a52da4b12&'
    };
    
    await updateProfile(defaultProfile);
  }
};