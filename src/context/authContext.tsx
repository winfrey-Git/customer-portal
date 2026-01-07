import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
  };
};

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer';
  customerNo: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isCustomer: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auto-login for development
const TEST_USER: User = {
  id: '1',
  name: 'Test Customer',
  email: 'test@customer.com',
  role: 'customer',
  customerNo: 'CUST001'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(process.env.NODE_ENV === 'development' ? TEST_USER : null);
  const [loading, setLoading] = useState(false);

  // Auto-login for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !user) {
      setUser(TEST_USER);
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, []);

  const login = async (email: string, _password: string) => {
    setLoading(true);
    try {
      // Mock login - replace with actual API call
      // In a real app, you would get this data from your authentication API
      setUser({
        id: '1',
        name: 'Customer User',
        email,
        role: 'customer',
        customerNo: 'CUST001' // This would come from your API response
      });
      localStorage.setItem('isAuthenticated', 'true');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isCustomer: !!user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};