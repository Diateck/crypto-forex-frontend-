import connectionManager from './connectionManager';
import { safeParseResponse } from '../utils/safeResponse.js';

const API_BASE_URL = 'https://crypto-forex-backend-9mme.onrender.com/api/auth';

class UserAuthAPI {
  // Register new user
  async register(userData) {
    try {
      const response = await connectionManager.fetchWithRetry(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const parsed = await safeParseResponse(response);

      if (parsed.status === 429) {
        return parsed;
      }

      if (parsed.success) {
        // Store token and user data
        const userObj = parsed.data?.user || parsed.data;
        const token = parsed.data?.token || parsed.data?.accessToken || null;
        if (token) localStorage.setItem('userToken', token);
        if (userObj) localStorage.setItem('userData', JSON.stringify(userObj));
        localStorage.setItem('isAuth', 'true');

        return {
          success: true,
          user: userObj,
          token,
          message: parsed.data?.message || parsed.message
        };
      }

      return { success: false, error: parsed.error || parsed.message };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Server is currently busy. Please try again in a few minutes.'
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await connectionManager.fetchWithRetry(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const parsed = await safeParseResponse(response);

      if (parsed.status === 429) return parsed;

      if (parsed.success) {
        const userObj = parsed.data?.user || parsed.data;
        const token = parsed.data?.token || parsed.data?.accessToken || null;
        if (token) localStorage.setItem('userToken', token);
        if (userObj) localStorage.setItem('userData', JSON.stringify(userObj));
        localStorage.setItem('isAuth', 'true');

        return { success: true, user: userObj, token, message: parsed.data?.message || parsed.message };
      }

      return { success: false, error: parsed.error || parsed.message };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Server is currently busy. Please try again in a few minutes.'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem('userToken');
      
      if (token) {
        await connectionManager.fetchWithRetry(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('isAuth');
    }
  }

  // Verify token
  async verifyToken() {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await connectionManager.fetchWithRetry(`${API_BASE_URL}/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const parsed = await safeParseResponse(response);

      // Respect rate limiting
      if (parsed.status === 429) return parsed;

      if (parsed.success) {
        return { success: true, data: parsed.data };
      }

      // Only clear auth on explicit unauthorized response
      if (parsed.status === 401) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('isAuth');
        return { success: false, error: parsed.error || 'Unauthorized' };
      }

      return { success: false, error: parsed.error || parsed.message || 'Token verification failed' };
    } catch (error) {
      console.error('Token verification error:', error);
      
      // Do not clear localStorage on transient network errors
      return { success: false, error: 'Token verification failed' };
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await connectionManager.fetchWithRetry(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const parsed = await safeParseResponse(response);

      if (parsed.status === 429) return parsed;

      if (parsed.success) {
        localStorage.setItem('userData', JSON.stringify(parsed.data));
        return { success: true, user: parsed.data };
      }

      return { success: false, error: parsed.error || parsed.message };
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        error: 'Network error occurred while fetching profile'
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await connectionManager.fetchWithRetry(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      const parsed = await safeParseResponse(response);

      if (parsed.status === 429) return parsed;

      if (parsed.success) {
        localStorage.setItem('userData', JSON.stringify(parsed.data));
        return { success: true, user: parsed.data, message: parsed.data?.message || parsed.message };
      }

      return { success: false, error: parsed.error || parsed.message };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: 'Server is currently busy. Please try again in a few minutes.'
      };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await connectionManager.fetchWithRetry(`${API_BASE_URL}/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const parsed = await safeParseResponse(response);

      if (parsed.status === 429) return parsed;

      if (parsed.success) {
        // Password changed successfully, force logout
        this.logout();
        return { success: true, message: parsed.data?.message || parsed.message, requireRelogin: true };
      }

      return { success: false, error: parsed.error || parsed.message };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'Server is currently busy. Please try again in a few minutes.'
      };
    }
  }

  // Get user balance
  async getBalance() {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await connectionManager.fetchWithRetry(`${API_BASE_URL}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const parsed = await safeParseResponse(response);
      if (parsed.success) return { success: true, balance: parsed.data };
      return { success: false, error: parsed.error || parsed.message };
    } catch (error) {
      console.error('Balance fetch error:', error);
      return {
        success: false,
        error: 'Server is currently busy. Please try again in a few minutes.'
      };
    }
  }

  // Get user activities
  async getActivities(options = {}) {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const { limit = 50, offset = 0, type } = options;
      const params = new URLSearchParams({ limit, offset });
      if (type) params.append('type', type);

      const response = await connectionManager.fetchWithRetry(`${API_BASE_URL}/activities?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const parsed = await safeParseResponse(response);
      if (parsed.success) {
        return {
          success: true,
          activities: parsed.data.activities,
          total: parsed.data.total,
          offset: parsed.data.offset,
          limit: parsed.data.limit
        };
      }
      return { success: false, error: parsed.error || parsed.message };
    } catch (error) {
      console.error('Activities fetch error:', error);
      return {
        success: false,
        error: 'Server is currently busy. Please try again in a few minutes.'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('userToken');
    const isAuth = localStorage.getItem('isAuth');
    return !!(token && isAuth === 'true');
  }

  // Get stored user data
  getStoredUserData() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // Get authentication token
  getToken() {
    return localStorage.getItem('userToken');
  }
}

export default new UserAuthAPI();