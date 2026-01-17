import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  steam_id: string;
  username: string;
  avatar_url: string;
  balance: number;
  privilege: string;
  play_time: number;
  last_daily_spin: string | null;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('cs16_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = () => {
    window.location.href = '/auth/callback';
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cs16_user');
  };

  const isAdmin = user?.privilege === 'admin' || user?.privilege === 'moderator';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
