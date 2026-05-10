import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdminUI: boolean;
  unlockAdmin: (password: string) => boolean;
  lockAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminUI, setIsAdminUI] = useState(() => {
    return localStorage.getItem('isAdminUI') === 'true';
  });

  const unlockAdmin = (password: string) => {
    if (password === '0305') {
      setIsAdminUI(true);
      localStorage.setItem('isAdminUI', 'true');
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsAdminUI(false);
    localStorage.removeItem('isAdminUI');
  };

  return (
    <AdminContext.Provider value={{ isAdminUI, unlockAdmin, lockAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
