// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('API Login Response (Raw):', JSON.stringify(response.data, null, 2));

      const { token, user: userData } = response.data;

      if (!token) {
        throw new Error(`Login successful but no token received. Response: ${JSON.stringify(response.data)}`);
      }

      // Fallback: If token exists but user is missing, fetch user details
      let finalUser = userData;
      if (token && !userData) {
        console.log('⚠️ User data missing in login response, fetching /auth/me...');
        const meRes = await api.get('/auth/me');
        console.log('API /auth/me Response:', meRes.data);
        finalUser = meRes.data.user;
      }

      if (!finalUser) {
        throw new Error('Failed to retrieve user data');
      }

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(finalUser));

      setUser(finalUser);
      setIsAuthenticated(true);

      // ✅ Dispatch event to trigger DataContext refresh
      window.dispatchEvent(new StorageEvent('storage', { key: 'token' }));

      return { success: true, user: finalUser };
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    }
  };

  // Google Login
  const loginWithGoogle = async (accessToken, role) => {
    try {
      console.log("Google Access Token:", accessToken);

      const response = await api.post('/auth/google', { accessToken, role });
      const { token, user: userData, isNewUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      window.dispatchEvent(new StorageEvent('storage', { key: 'token' }));

      // Return isNewUser status so caller can redirect if needed
      if (isNewUser) {
        return { success: true, user: userData, isNewUser: true };
      }

      return { success: true, user: userData };
    } catch (error) {
      console.error("Google login error", error);
      return {
        success: false,
        error: error.response?.data?.error || 'Google login failed'
      };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);

      // ✅ Dispatch event to trigger DataContext refresh
      window.dispatchEvent(new StorageEvent('storage', { key: 'token' }));

      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);

    // ✅ Dispatch event to trigger DataContext refresh
    window.dispatchEvent(new StorageEvent('storage', { key: 'token' }));
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      loginWithGoogle,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;