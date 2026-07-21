import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: 'WORKER' | 'EMPLOYER' | 'CONTRACTOR' | 'ADMIN' | 'MODERATOR';
  avatarUrl?: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('accessToken'),
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({ user: null, token: null });
  },
}));
