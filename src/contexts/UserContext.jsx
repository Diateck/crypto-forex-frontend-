import React, { createContext, useContext, useState, useEffect } from 'react';
import userAuthAPI from '../services/userAuthAPI';

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
  const [userStats, setUserStats] = useState({
    totalBalance: 0,
    profit: 0,
    totalBonus: 0,
    accountStatus: 'UNVERIFIED',
    totalTrades: 0,
    openTrades: 0,
    closedTrades: 0,
    winLossRatio: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      if (userAuthAPI.isAuthenticated()) {
        // Verify token with backend
        const result = await userAuthAPI.verifyToken();
        
        if (result.success) {
          setIsAuthenticated(true);
          await loadUserData();
        } else {
          // Token invalid, clear auth state
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // Not authenticated
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      setError(null);
      
      // Get user profile and balance
      const [profileResult, balanceResult] = await Promise.all([
        userAuthAPI.getProfile(),
        userAuthAPI.getBalance()
      ]);
      
      if (profileResult.success) {
        setUser(profileResult.user);
        
        // Update user stats from balance
        if (balanceResult.success) {
          setUserStats(prev => ({
            ...prev,
            totalBalance: balanceResult.balance.totalBalance || 0,
            availableBalance: balanceResult.balance.availableBalance || 0,
            tradingBalance: balanceResult.balance.tradingBalance || 0,
            accountStatus: profileResult.user.verification?.isKYCVerified ? 'VERIFIED' : 'UNVERIFIED'
          }));
        }
      } else {
        setError(profileResult.error);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to load user data:', err);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userAuthAPI.register(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        await loadUserData();
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userAuthAPI.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        await loadUserData();
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await userAuthAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setUserStats({
        totalBalance: 0,
        profit: 0,
        totalBonus: 0,
        accountStatus: 'UNVERIFIED',
        totalTrades: 0,
        openTrades: 0,
        closedTrades: 0,
        winLossRatio: 0
      });
      setIsAuthenticated(false);
      setError(null);
    }
  };

  const updateUser = async (userData) => {
    try {
      const result = await userAuthAPI.updateProfile(userData);
      
      if (result.success) {
        setUser(result.user);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const refreshUserData = () => {
    return loadUserData();
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const result = await userAuthAPI.changePassword(currentPassword, newPassword);
      
      if (result.success && result.requireRelogin) {
        // Password changed successfully, user needs to login again
        await logout();
      }
      
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    userStats,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
    refreshUserData,
    changePassword,
    checkAuthStatus,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
