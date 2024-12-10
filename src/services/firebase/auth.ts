import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { User, UserRole } from '../../types';

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userData: User = {
    id: user.uid,
    email: user.email!,
    name,
    role: 'user'
  };

  await setDoc(doc(db, 'users', user.uid), userData);
  return userData;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    throw new Error('User data not found');
  }

  return userDoc.data() as User;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function getCurrentUser(firebaseUser: FirebaseUser): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  if (!userDoc.exists()) {
    return null;
  }
  return userDoc.data() as User;
}