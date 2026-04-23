import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User, LoginResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextData {
  user: User | null;
  signed: boolean;
  signIn(credentials: { email: string; password: string }): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@TaskApp:user');
    const storagedToken = localStorage.getItem('@TaskApp:token');

    if (storagedUser && storagedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storagedUser));
    }
  }, []);

  async function signIn(credentials: { email: string; password: string }) {
    try {
      const response: LoginResponse = await authService.login(credentials);
      
      setUser(response.user);

      localStorage.setItem('@TaskApp:user', JSON.stringify(response.user));
      localStorage.setItem('@TaskApp:token', response.token);
    } catch (error) {
      console.error("Erro no login", error);
      throw error; 
    }
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}