import { create } from 'zustand';
import { User, UserRole } from '../types';
import { loginUser, registerUser, logoutUser } from '../services/firebase/auth';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: 'createActionPlan' | 'createTask') => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  login: async (email: string, password: string) => {
    const user = await loginUser(email, password);
    set({ user });
  },
  register: async (email: string, password: string, name: string) => {
    const user = await registerUser(email, password, name);
    set({ user });
  },
  logout: async () => {
    await logoutUser();
    set({ user: null });
  },
  hasPermission: (permission) => {
    const user = get().user;
    if (!user) return false;

    switch (permission) {
      case 'createActionPlan':
      case 'createTask':
        return ['admin', 'manager'].includes(user.role);
      default:
        return false;
    }
  },
}));