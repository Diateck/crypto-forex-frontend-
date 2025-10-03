// Admin Authentication API Service
const API_BASE_URL = 'https://crypto-forex-backend-9mme.onrender.com/api';

const adminAuthAPI = {
  // Login admin
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Login API Error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection.' 
      };
    }
  },

  // Logout admin
  async logout() {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin-auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Clear local storage regardless of response
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      
      return await response.json();
    } catch (error) {
      console.error('Logout API Error:', error);
      // Still clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      return { success: true };
    }
  },

  // Verify token validity
  async verifyToken() {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch(`${API_BASE_URL}/admin-auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (!result.success) {
        // Token is invalid, clear local storage
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
      
      return result;
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      return { success: false, error: 'Token verification failed' };
    }
  },

  // Get admin profile
  async getProfile() {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin-auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: 'Failed to fetch profile' };
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin-auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Failed to change password' };
    }
  },

  // Update profile
  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin-auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      const result = await response.json();
      
      // Update local storage if successful
      if (result.success && result.data.admin) {
        localStorage.setItem('adminData', JSON.stringify(result.data.admin));
      }
      
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  },

  // Get login history
  async getLoginHistory() {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin-auth/login-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Get login history error:', error);
      return { success: false, error: 'Failed to fetch login history' };
    }
  },

  // Check if admin is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    return !!(token && adminData);
  },

  // Get stored admin data
  getStoredAdminData() {
    try {
      const adminData = localStorage.getItem('adminData');
      return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
      console.error('Error parsing admin data:', error);
      return null;
    }
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('adminToken');
  }
};

export default adminAuthAPI;