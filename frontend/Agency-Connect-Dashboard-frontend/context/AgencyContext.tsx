import React, { createContext, useContext, useMemo } from 'react';
import { IAgencyService } from '../types';
import { MockAgencyService, RealAgencyService } from '../services/agencyService';
import { USE_MOCK_API } from '../constants';

interface AgencyContextType {
  service: IAgencyService;
  isMockMode: boolean;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const AgencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We initialize the service once. 
  // In a real Next.js app, this might be handled via Dependency Injection or Server Components.
  const service = useMemo(() => {
    return USE_MOCK_API ? new MockAgencyService() : new RealAgencyService();
  }, []);

  return (
    <AgencyContext.Provider value={{ service, isMockMode: USE_MOCK_API }}>
      {children}
    </AgencyContext.Provider>
  );
};

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
};