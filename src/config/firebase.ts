import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAPVPrrOjtWyUi1mjTYfwHvrew5PR-9KYk",
  authDomain: "gerenciador-de-tarefas---cplan.firebaseapp.com",
  projectId: "gerenciador-de-tarefas---cplan",
  storageBucket: "gerenciador-de-tarefas---cplan.firebasestorage.app",
  messagingSenderId: "1002943225583",
  appId: "1:1002943225583:web:5e7cbb386d743c44b9851a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize auth state listener
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
});