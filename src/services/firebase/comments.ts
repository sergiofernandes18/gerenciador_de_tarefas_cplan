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
import { Comment } from '../../types';

export async function createComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
  const docRef = await addDoc(collection(db, 'comments'), comment);
  return { ...comment, id: docRef.id };
}

export async function updateComment(id: string, content: string, userId: string): Promise<void> {
  await updateDoc(doc(db, 'comments', id), {
    content,
    updatedAt: new Date().toISOString(),
    updatedBy: userId
  });
}

export async function deleteComment(id: string): Promise<void> {
  await deleteDoc(doc(db, 'comments', id));
}

export async function getCommentsByTask(taskId: string): Promise<Comment[]> {
  const q = query(
    collection(db, 'comments'),
    where('taskId', '==', taskId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
}