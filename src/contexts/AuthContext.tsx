import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  user_id: string;
  mobile: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  pan?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  authToken: string | null;
  login: (userData: UserData, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setAuthToken(savedToken);
      } catch (error) {
        console.error('Error loading saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = (userData: UserData, token: string) => {
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
  };

  const updateUser = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!authToken,
    authToken,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 