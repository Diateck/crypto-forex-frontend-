const API_BASE_URL = 'https://crypto-forex-backend-9mme.onrender.com/api/auth';

class UserAuthAPI {
  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('userToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        localStorage.setItem('isAuth', 'true');
        
        return {
          success: true,
          user: data.data.user,
          token: data.data.token,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: data.message
        };
      }
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
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('userToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        localStorage.setItem('isAuth', 'true');
        
        return {
          success: true,
          user: data.data.user,
          token: data.data.token,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: data.message
        };
      }
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
        await fetch(`${API_BASE_URL}/logout`, {
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

      const response = await fetch(`${API_BASE_URL}/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          data: data.data
        };
      } else {
        // Token is invalid, clear localStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('isAuth');
        
        return {
          success: false,
          error: data.message
        };
      }
    } catch (error) {
      console.error('Token verification error:', error);
      
      // Clear localStorage on error
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('isAuth');
      
      return {
        success: false,
        error: 'Token verification failed'
      };
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        // Update stored user data
        localStorage.setItem('userData', JSON.stringify(data.data));
        return {
          success: true,
          user: data.data
        };
      } else {
        return {
          success: false,
          error: data.message
        };
      }
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

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (data.success) {
        // Update stored user data
        localStorage.setItem('userData', JSON.stringify(data.data));
        return {
          success: true,
          user: data.data,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: data.message
        };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: 'Network error occurred while updating profile'
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

      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (data.success) {
        // Password changed successfully, force logout
        this.logout();
        return {
          success: true,
          message: data.message,
          requireRelogin: true
        };
      } else {
        return {
          success: false,
          error: data.message
        };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'Network error occurred while changing password'
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

      const response = await fetch(`${API_BASE_URL}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          balance: data.data
        };
      } else {
        return {
          success: false,
          error: data.message
        };
      }
    } catch (error) {
      console.error('Balance fetch error:', error);
      return {
        success: false,
        error: 'Network error occurred while fetching balance'
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

      const response = await fetch(`${API_BASE_URL}/activities?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          activities: data.data.activities,
          total: data.data.total,
          offset: data.data.offset,
          limit: data.data.limit
        };
      } else {
        return {
          success: false,
          error: data.message
        };
      }
    } catch (error) {
      console.error('Activities fetch error:', error);
      return {
        success: false,
        error: 'Network error occurred while fetching activities'
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