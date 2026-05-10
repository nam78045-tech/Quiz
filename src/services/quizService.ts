import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError } from '../lib/utils';
import { Subject, Question, OperationType } from '../types';

const SUBJECTS_COL = 'subjects';
const QUESTIONS_COL = 'questions';

export const quizService = {
  async getSubjects(): Promise<Subject[]> {
    try {
      const q = query(collection(db, SUBJECTS_COL), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, SUBJECTS_COL);
      return [];
    }
  },

  async addSubject(name: string): Promise<string> {
    if (!auth.currentUser) throw new Error('Must be logged in');
    try {
      const docRef = await addDoc(collection(db, SUBJECTS_COL), {
        name,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, SUBJECTS_COL);
      return '';
    }
  },

  async getQuestions(subjectId: string): Promise<Question[]> {
    try {
      const q = query(
        collection(db, QUESTIONS_COL), 
        where('subjectId', '==', subjectId),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, QUESTIONS_COL);
      return [];
    }
  },

  async addQuestion(question: Omit<Question, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
    if (!auth.currentUser) throw new Error('Must be logged in');
    try {
      const docRef = await addDoc(collection(db, QUESTIONS_COL), {
        ...question,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, QUESTIONS_COL);
      return '';
    }
  },

  async updateQuestion(id: string, data: Partial<Question>): Promise<void> {
    try {
      const docRef = doc(db, QUESTIONS_COL, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${QUESTIONS_COL}/${id}`);
    }
  },

  async deleteQuestion(id: string): Promise<void> {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, QUESTIONS_COL, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${QUESTIONS_COL}/${id}`);
    }
  },

  async deleteSubject(id: string): Promise<void> {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, SUBJECTS_COL, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${SUBJECTS_COL}/${id}`);
    }
  },

  async toggleNote(id: string, isNoted: boolean): Promise<void> {
    try {
      const docRef = doc(db, QUESTIONS_COL, id);
      await updateDoc(docRef, { isNoted });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${QUESTIONS_COL}/${id}`);
    }
  },

  async getNotedQuestions(): Promise<Question[]> {
    try {
      const q = query(collection(db, QUESTIONS_COL), where('isNoted', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, QUESTIONS_COL);
      return [];
    }
  }
};
