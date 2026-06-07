import React, { useCallback, useState, createContext, useContext } from 'react';
import { storageGet, storageSet, storageRemove, KEYS } from '../utils/storage';
interface Barangay {
  region: string;
  province: string;
  municipality: string;
  barangay: string;
}
interface AppContextType {
  selectedBarangay: Barangay | null;
  setSelectedBarangay: (b: Barangay | null) => void;
  user: {
    name: string;
    email: string;
  } | null;
  setUser: (
  u: {
    name: string;
    email: string;
  } | null)
  => void;
}
const DEFAULT_BARANGAY: Barangay = {
  region: 'Region I',
  province: 'Ilocos Norte',
  municipality: 'Laoag City',
  barangay: 'Barangay 1'
};
const DEFAULT_USER = {
  name: 'PMNP User',
  email: 'user@pmnp.gov.ph'
};
const AppContext = createContext<AppContextType | undefined>(undefined);
export function AppProvider({ children }: {children: ReactNode;}) {
  const [selectedBarangay, setSelectedBarangayState] =
  useState<Barangay | null>(() =>
  storageGet<Barangay | null>(KEYS.BARANGAY, DEFAULT_BARANGAY)
  );
  const [user, setUserState] = useState<{
    name: string;
    email: string;
  } | null>(() =>
  storageGet<{
    name: string;
    email: string;
  } | null>(KEYS.USER, DEFAULT_USER)
  );
  const setSelectedBarangay = useCallback((b: Barangay | null) => {
    setSelectedBarangayState(b);
    if (b) {
      storageSet(KEYS.BARANGAY, b);
    } else {
      storageRemove(KEYS.BARANGAY);
    }
  }, []);
  const setUser = useCallback(
    (
    u: {
      name: string;
      email: string;
    } | null) =>
    {
      setUserState(u);
      if (u) {
        storageSet(KEYS.USER, u);
      } else {
        storageRemove(KEYS.USER);
        storageRemove(KEYS.BARANGAY);
        setSelectedBarangayState(null);
      }
    },
    []
  );
  return (
    <AppContext.Provider
      value={{
        selectedBarangay,
        setSelectedBarangay,
        user,
        setUser
      }}>
      
      {children}
    </AppContext.Provider>);

}
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}