import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ActionPlan } from '../../types';

export async function createActionPlan(actionPlan: Omit<ActionPlan, 'id'>): Promise<ActionPlan> {
  const docRef = await addDoc(collection(db, 'actionPlans'), actionPlan);
  return { ...actionPlan, id: docRef.id };
}

export async function updateActionPlan(id: string, updates: Partial<ActionPlan>): Promise<void> {
  await updateDoc(doc(db, 'actionPlans', id), updates);
}

export async function deleteActionPlan(id: string): Promise<void> {
  await deleteDoc(doc(db, 'actionPlans', id));
}

export async function getActionPlans(): Promise<ActionPlan[]> {
  const q = query(
    collection(db, 'actionPlans'),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActionPlan));
}

export async function getActionPlansByUser(userId: string): Promise<ActionPlan[]> {
  const q = query(
    collection(db, 'actionPlans'),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActionPlan));
}