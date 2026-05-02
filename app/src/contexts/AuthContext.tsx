import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile, UserRole } from '../types/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isMember: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, _setUser] = useState<User | null>(null);
  const [profile, _setProfile] = useState<Profile | null>(null);
  const [session, _setSession] = useState<Session | null>(null);
  const [loading, _setLoading] = useState(false);

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    console.warn('Backend is disabled. Google sign-in is unavailable.');
  };

  // Sign in with Email
  const signInWithEmail = async (_email: string, _pass: string) => {
    console.warn('Backend is disabled. Email sign-in is unavailable.');
    return { error: { message: 'Backend disabled' } };
  };

  // Sign up with Email
  const signUpWithEmail = async (_email: string, _pass: string, _name: string) => {
    console.warn('Backend is disabled. Registration is unavailable.');
    return { error: { message: 'Backend disabled' } };
  };

  // Sign out
  const signOut = async () => {
    console.warn('Backend is disabled.');
  };

  // Check if user has a specific role
  const isRole = (_role: UserRole) => false;
  const isAdmin = false;
  const isMember = false;
  const refreshProfile = async () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        isRole,
        isAdmin,
        isMember,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
