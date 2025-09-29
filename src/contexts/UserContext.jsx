import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI, apiService } from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check if user is authenticated based on stored token
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  });

  useEffect(() => {
    checkBackendStatus();
    if (isAuthenticated) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const checkBackendStatus = async () => {
    try {
      const health = await apiService.healthCheck();
      setBackendStatus(health.status === 'ok' ? 'connected' : 'fallback');
    } catch (error) {
      setBackendStatus('fallback');
      console.warn('Backend unavailable, using fallback data');
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileResponse, statsResponse] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getStats()
      ]);
      
      // Handle backend response format
      if (profileResponse.success) {
        setUser(profileResponse.data.user || profileResponse.data);
      } else {
        setUser(profileResponse); // Fallback format
      }
      
      if (statsResponse.success) {
        setUserStats(statsResponse.data.stats || statsResponse.data);
      } else {
        setUserStats(statsResponse); // Fallback format
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to load user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await userAPI.updateProfile(userData);
      const updatedUser = response.success ? response.data.user : response;
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const refreshStats = () => {
    return loadUserData();
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await userAPI.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        await loadUserData(); // Load complete user data after login
        return response.data.user;
      } else {
        // Handle fallback response
        setUser(response);
        setIsAuthenticated(true);
        return response;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    apiService.removeToken();
    setUser(null);
    setUserStats(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = {
    user,
    userStats,
    loading,
    error,
    isAuthenticated,
    backendStatus,
    updateUser,
    refreshStats,
    login,
    logout,
    checkBackendStatus,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
