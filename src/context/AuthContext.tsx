import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  checkAdminStatus,
  fetchUserProfile,
  resolveFullUserSession,
  registerNewUser,
  logoutCurrentUser,
  sendUserPasswordReset,
} from '../services/authService';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isSeller: boolean;
  isCreator: boolean;
  isPremium: boolean;
  isPlanExpired: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; isAdmin: boolean; isSeller?: boolean; isCreator?: boolean; userRole?: UserRole; error?: string }>;
  register: (email: string, pass: string, name: string) => Promise<{ success: boolean; isAdmin: boolean; isSeller?: boolean; isCreator?: boolean; userRole?: UserRole; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshAdminStatus: () => Promise<boolean>;
  refreshUserProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const isSeller = !isAdmin && userProfile?.role === 'seller';
  const isCreator = !isAdmin && userProfile?.role === 'creator';

  const isPlanExpired = Boolean(
    !isAdmin &&
    userProfile?.plan === 'premium' &&
    !userProfile?.isLifetime &&
    userProfile?.planExpiresAt &&
    Date.now() > userProfile.planExpiresAt
  );

  const isPremium = isAdmin || isSeller || isCreator || (userProfile?.plan === 'premium' && !isPlanExpired);

  const checkAndSetAdminStatus = async (user: User | null): Promise<boolean> => {
    if (!user) {
      setIsAdmin(false);
      setUserProfile(null);
      return false;
    }
    const session = await resolveFullUserSession(user);
    setIsAdmin(session.isAdmin);
    setUserProfile(session.profile);
    return session.isAdmin;
  };

  const refreshUserProfile = async (): Promise<UserProfile | null> => {
    if (!currentUser) return null;
    const session = await resolveFullUserSession(currentUser);
    setIsAdmin(session.isAdmin);
    setUserProfile(session.profile);
    return session.profile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        try {
          const session = await resolveFullUserSession(user);
          setCurrentUser(user);
          setIsAdmin(session.isAdmin);
          setUserProfile(session.profile);
        } catch (err) {
          console.warn('Auth state session resolution error:', err);
          setCurrentUser(user);
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = credential.user;
      const session = await resolveFullUserSession(user);
      
      setCurrentUser(user);
      setIsAdmin(session.isAdmin);
      setUserProfile(session.profile);
      setLoading(false);

      return { 
        success: true, 
        isAdmin: session.isAdmin, 
        isSeller: session.isSeller, 
        isCreator: session.isCreator,
        userRole: session.role,
      };
    } catch (err: any) {
      setLoading(false);
      return { success: false, isAdmin: false, isSeller: false, isCreator: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    try {
      setLoading(true);
      const res = await registerNewUser(email.trim(), pass, name);
      const session = await resolveFullUserSession(res.user);

      setCurrentUser(res.user);
      setIsAdmin(session.isAdmin);
      setUserProfile(session.profile);
      setLoading(false);

      return { 
        success: true, 
        isAdmin: session.isAdmin, 
        isSeller: session.isSeller, 
        isCreator: session.isCreator,
        userRole: session.role,
      };
    } catch (err: any) {
      setLoading(false);
      return { success: false, isAdmin: false, isSeller: false, isCreator: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    await logoutCurrentUser();
    setCurrentUser(null);
    setIsAdmin(false);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendUserPasswordReset(email);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset failed' };
    }
  };

  const refreshAdminStatus = async (): Promise<boolean> => {
    if (currentUser) {
      return await checkAndSetAdminStatus(currentUser);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        isSeller,
        isCreator,
        isPremium,
        isPlanExpired,
        loading,
        login,
        register,
        logout,
        resetPassword,
        refreshAdminStatus,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
