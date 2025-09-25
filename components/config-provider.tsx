"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminConfig } from '@/lib/config'; // Assuming the interface is exported from here
import { apiClient } from '@/lib/api-client';

interface ConfigContextType {
  config: AdminConfig | null;
  isLoading: boolean;
  error: string | null;
  refetchConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedConfig = await apiClient.getConfig();
      setConfig(fetchedConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Set a default/empty config on error to prevent crashes
      setConfig({
        employeeRanges: [],
        baseManDays: {},
        riskLevels: [],
        haccpMultiplier: 0,
        multiSiteMultiplier: 0,
        integratedSystemReduction: 0,
        integratedStandards: [],
        categories: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const contextValue = {
    config,
    isLoading,
    error,
    refetchConfig: fetchConfig,
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
