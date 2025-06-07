import { collection, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase';

// Interface para os dados do formulário que serão salvos
export interface ContactFormDBData {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Timestamp; // Usar Timestamp do Firebase para ordenação/queries
  replied?: boolean; // Opcional: para marcar se já foi respondido
}

export const saveContactMessage = async (
  formData: Omit<ContactFormDBData, 'createdAt' | 'replied'>
): Promise<string> => {
  console.log("[contactService] Attempting to save contact message:", formData);
  try {
    const dataToSave = {
      ...formData,
      createdAt: serverTimestamp(), // Usa o timestamp do servidor do Firebase
      replied: false, // Valor inicial
    };
    const docRef = await addDoc(collection(firestore, 'contactMessages'), dataToSave);
    console.log("[contactService] Contact message saved successfully with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("[contactService] Error saving contact message: ", error);
    throw error; // Re-throw para que o componente possa tratar
  }
};