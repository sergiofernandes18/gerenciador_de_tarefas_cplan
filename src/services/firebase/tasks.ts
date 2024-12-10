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
import { Task } from '../../types';

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  const docRef = await addDoc(collection(db, 'tasks'), task);
  return { ...task, id: docRef.id };
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  await updateDoc(doc(db, 'tasks', id), updates);
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, 'tasks', id));
}

export async function getTasks(actionPlanId: string): Promise<Task[]> {
  const q = query(
    collection(db, 'tasks'),
    where('actionPlanId', '==', actionPlanId),
    orderBy('plannedStart', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
}