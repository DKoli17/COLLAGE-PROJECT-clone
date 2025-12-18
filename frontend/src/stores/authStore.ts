import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: UserRole, additionalInfo?: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (email: string, password: string, role: UserRole) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Mock authentication - in production, this would call your backend
          const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
            role,
            university: role === 'student' ? 'State University' : undefined,
            companyName: role === 'vendor' ? 'Tech Company' : undefined,
            isVerified: role === 'vendor',
            createdAt: new Date().toISOString(),
          };

          const mockToken = 'mock-jwt-token-' + Math.random().toString(36);

          set({
            user: mockUser,
            isAuthenticated: true,
            token: mockToken,
          });

          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      signup: async (email: string, password: string, name: string, role: UserRole, additionalInfo?: any) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            role,
            university: role === 'student' ? additionalInfo?.university : undefined,
            companyName: role === 'vendor' ? additionalInfo?.companyName : undefined,
            isVerified: false,
            createdAt: new Date().toISOString(),
          };

          const mockToken = 'mock-jwt-token-' + Math.random().toString(36);

          set({
            user: mockUser,
            isAuthenticated: true,
            token: mockToken,
          });

          return true;
        } catch (error) {
          console.error('Signup failed:', error);
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
