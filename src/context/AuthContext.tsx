import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  checkAdminStatus,
  fetchUserProfile,
  loginUserWithEmail,
  registerNewUser,
  logoutCurrentUser,
  sendUserPasswordReset,
} from '../services/authService';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isPremium: boolean;
  isPlanExpired: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; isAdmin: boolean; error?: string }>;
  register: (email: string, pass: string, name: string) => Promise<{ success: boolean; isAdmin: boolean; error?: string }>;
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

  const isPlanExpired = Boolean(
    !isAdmin &&
    userProfile?.plan === 'premium' &&
    !userProfile?.isLifetime &&
    userProfile?.planExpiresAt &&
    Date.now() > userProfile.planExpiresAt
  );

  const isPremium = isAdmin || (userProfile?.plan === 'premium' && !isPlanExpired);

  const checkAndSetAdminStatus = async (user: User | null): Promise<boolean> => {
    if (!user) {
      setIsAdmin(false);
      setUserProfile(null);
      return false;
    }
    const admin = await checkAdminStatus(user.uid);
    setIsAdmin(admin);
    const profile = await fetchUserProfile(user.uid);
    setUserProfile(profile);
    return admin;
  };

  const refreshUserProfile = async (): Promise<UserProfile | null> => {
    if (!currentUser) return null;
    const profile = await fetchUserProfile(currentUser.uid);
    setUserProfile(profile);
    return profile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await checkAndSetAdminStatus(user);
      } else {
        setIsAdmin(false);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await loginUserWithEmail(email, pass);
      setIsAdmin(res.isAdmin);
      if (res.user) {
        const profile = await fetchUserProfile(res.user.uid);
        setUserProfile(profile);
      }
      return { success: true, isAdmin: res.isAdmin };
    } catch (err: any) {
      return { success: false, isAdmin: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    try {
      const res = await registerNewUser(email, pass, name);
      setIsAdmin(res.isAdmin);
      if (res.user) {
        const profile = await fetchUserProfile(res.user.uid);
        setUserProfile(profile);
      }
      return { success: true, isAdmin: res.isAdmin };
    } catch (err: any) {
      return { success: false, isAdmin: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    await logoutCurrentUser();
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
