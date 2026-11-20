import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../services/authService.js';

const AuthContext = createContext(null);

export const dashboardPath = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'instructor') return '/instructor';
  return '/student';
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page load: if a token is saved, ask the backend who the user is
  useEffect(() => {
    const token = localStorage.getItem('learnhub_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('learnhub_token'))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (data) => {
    localStorage.setItem('learnhub_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    return saveSession(res.data);
  };

  const register = async (form) => {
    const res = await registerUser(form);
    return saveSession(res.data);
  };

  const logout = () => {
    localStorage.removeItem('learnhub_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
