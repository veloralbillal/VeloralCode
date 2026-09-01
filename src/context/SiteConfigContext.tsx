import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig } from '../types';
import {
  DEFAULT_SITE_CONFIG,
  subscribeToSiteConfig,
  updateSiteConfig,
  resetSiteConfig,
} from '../services/siteConfigService';

interface SiteConfigContextType {
  siteConfig: SiteConfig;
  loading: boolean;
  saveConfig: (newConfig: Partial<SiteConfig>, adminEmail?: string) => Promise<void>;
  resetConfig: (adminEmail?: string) => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToSiteConfig(
      (config) => {
        setSiteConfig(config);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveConfig = async (newConfig: Partial<SiteConfig>, adminEmail?: string) => {
    await updateSiteConfig(newConfig, adminEmail);
  };

  const resetConfig = async (adminEmail?: string) => {
    await resetSiteConfig(adminEmail);
  };

  return (
    <SiteConfigContext.Provider value={{ siteConfig, loading, saveConfig, resetConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
