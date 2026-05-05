import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'admin' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const storedSession = localStorage.getItem('ocular_session');
    if (storedSession) {
      try {
        const parsedUser = JSON.parse(storedSession);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse session', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock authentication logic
    if (email === 'admin@netflix.com') {
      const mockUser: User = {
        id: 'usr-1',
        name: 'Ocular Admin',
        email,
        role: 'admin',
      };
      setUser(mockUser);
      localStorage.setItem('ocular_session', JSON.stringify(mockUser));
    } else {
      const mockUser: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'viewer',
      };
      setUser(mockUser);
      localStorage.setItem('ocular_session', JSON.stringify(mockUser));
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ocular_session');
  };

  const hasRole = (role: Role) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has all permissions
    return user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
