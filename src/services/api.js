// API Configuration and Base Service
import { safeParseResponse } from '../utils/safeResponse.js';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://crypto-forex-backend.onrender.com';
const API_TIMEOUT = 5000; // Reduced timeout to prevent long waits

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token
  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token
  removeToken() {
    localStorage.removeItem('authToken');
  }

  // Build headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.getToken()) {
      headers.Authorization = `Bearer ${this.getToken()}`;
    }

    return headers;
  }

  // Generic request method with fallback
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses gracefully
      if (!response.ok) {
        const retryAfter = response.headers.get('Retry-After') || null;
        const contentType = response.headers.get('content-type') || '';

        // Try to parse JSON error body if present using safe parser
        const parsedErr = await safeParseResponse(response).catch(() => ({ success: false, error: response.statusText }));
        return { success: false, status: response.status, error: parsedErr.error || parsedErr.data || { message: response.statusText }, retryAfter };
      }

      // Try to parse JSON, but handle non-JSON safely
      const contentType = response.headers.get('content-type') || '';
      // Use safe parser for OK responses as well
      const parsed = await safeParseResponse(response).catch(() => ({ success: false, error: 'Invalid server response' }));
      if (parsed.success) return { success: true, data: parsed.data };
      // If parsing failed but response.ok, return raw text fallback
      const text = await response.text().catch(() => null);
      return { success: true, data: text };
    } catch (error) {
      console.warn(`API Request failed for ${endpoint}:`, error.message);
      return this.getFallbackData(endpoint, error);
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return response.data || { status: 'ok' };
    } catch (error) {
      return { status: 'error', message: 'Backend unavailable' };
    }
  }

  // Fallback data when backend is unavailable
  getFallbackData(endpoint, error) {
    const fallbackData = {
      '/health': { status: 'fallback' },
      '/auth/profile': {
        id: 'demo_user',
        username: 'theophilus',
        email: 'demo@elonbroker.com',
        firstName: 'Demo',
        lastName: 'User',
        kycStatus: 'pending',
        accountType: 'demo'
      },
      '/auth/stats': {
        totalBalance: 0,
        profit: 0,
        totalBonus: 0,
        accountStatus: 'UNVERIFIED',
        totalTrades: 0,
        openTrades: 0,
        closedTrades: 0,
        winLossRatio: 0
      },
      '/market/ticker': [
        { label: 'Nasdaq 100', value: '24,344.8', change: '+98.90 (+0.41%)', color: 'green' },
        { label: 'EUR/USD', value: '1.18099', change: '-0.00059 (-0.05%)', color: 'red' },
        { label: 'BTC/USD', value: '116,747', change: '+270.00 (+0.23%)', color: 'green' },
        { label: 'ETH/USD', value: '4,620.8', change: '+28.50', color: 'green' }
      ],
      '/market/chart': []
    };

    return {
      success: false,
      data: fallbackData[endpoint] || fallbackData[endpoint.split('?')[0]] || {},
      error: error.message,
      fallback: true
    };
  }
}

export const apiService = new ApiService();

// User API endpoints
export const userAPI = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  register: (userData) => apiService.post('/auth/register', userData),
  logout: () => apiService.post('/auth/logout'),
  getProfile: () => apiService.get('/auth/profile'),
  updateProfile: (data) => apiService.put('/auth/profile', data),
  getStats: () => apiService.get('/auth/stats'),
  
  // Real-time dashboard data
  getDashboardData: () => apiService.get('/dashboard/stats'),
  getBalanceHistory: () => apiService.get('/dashboard/balance-history'),
  
  // KYC Management (User Side)
  submitKYC: (kycData) => apiService.post('/auth/kyc', kycData), // Creates pending KYC
  getKYCStatus: () => apiService.get('/auth/kyc-status'),
  uploadKYCDocument: (documentData) => apiService.post('/auth/kyc-upload', documentData)
};

// Admin API endpoints for monitoring and approval
export const adminAPI = {
  // Dashboard monitoring
  getAllUsersStats: () => apiService.get('/admin/users-stats'),
  getUserDashboard: (userId) => apiService.get(`/admin/user-dashboard/${userId}`),
  
  // KYC Management (Admin Side)
  getPendingKYC: () => apiService.get('/admin/pending-kyc'),
  getKYCDetails: (userId) => apiService.get(`/admin/kyc-details/${userId}`),
  approveKYC: (userId) => apiService.post(`/admin/approve-kyc/${userId}`),
  rejectKYC: (userId, reason) => apiService.post(`/admin/reject-kyc/${userId}`, { reason }),
  
  // Financial monitoring
  getPendingDeposits: () => apiService.get('/admin/pending-deposits'),
  getPendingWithdrawals: () => apiService.get('/admin/pending-withdrawals'),
  getAllTransactions: () => apiService.get('/admin/all-transactions'),
  
  // User management
  getAllUsers: () => apiService.get('/admin/users'),
  getUserDetails: (userId) => apiService.get(`/admin/user/${userId}`),
  updateUserBalance: (userId, balanceData) => apiService.post(`/admin/update-balance/${userId}`, balanceData),
  
  // Bonus management
  giveBonus: (userId, bonusData) => apiService.post(`/admin/give-bonus/${userId}`, bonusData),
  getBonusHistory: () => apiService.get('/admin/bonus-history')
};

// Financial API endpoints - Enhanced with Admin Approval System
export const financialAPI = {
  getDeposits: () => apiService.get('/financial/deposits'),
  getWithdrawals: () => apiService.get('/financial/withdrawals'),
  getLoans: () => apiService.get('/financial/loans'),
  applyLoan: (loanData) => apiService.post('/financial/loans', loanData),
  
  // Real-time balance updates (Admin Controlled)
  getCurrentBalance: () => apiService.get('/financial/current-balance'),
  getBonusHistory: () => apiService.get('/financial/bonus-history'),
  getPendingActions: (userId) => apiService.get(`/financial/pending-actions/${userId}`),
  
  // User Actions (Require Admin Approval)
  deposit: (depositData) => apiService.post('/financial/deposit', depositData), // Creates pending deposit
  withdraw: (withdrawData) => apiService.post('/financial/withdraw', withdrawData), // Creates pending withdrawal
  
  // Admin-only endpoints (for admin dashboard)
  getPendingDeposits: () => apiService.get('/admin/pending-deposits'),
  approveDeposit: (depositId) => apiService.post(`/admin/approve-deposit/${depositId}`),
  rejectDeposit: (depositId) => apiService.post(`/admin/reject-deposit/${depositId}`),
  
  getPendingWithdrawals: () => apiService.get('/admin/pending-withdrawals'),
  approveWithdrawal: (withdrawalId) => apiService.post(`/admin/approve-withdrawal/${withdrawalId}`),
  rejectWithdrawal: (withdrawalId) => apiService.post(`/admin/reject-withdrawal/${withdrawalId}`),
  
  // Admin bonus management
  giveBonus: (userId, bonusData) => apiService.post(`/admin/give-bonus/${userId}`, bonusData)
};

// Real-time Trading API endpoints
export const tradingAPI = {
  getPositions: () => apiService.get('/trading/positions'),
  getOrders: () => apiService.get('/trading/orders'),
  getHistory: () => apiService.get('/trading/history'),
  getSignals: () => apiService.get('/trading/signals'),
  getCopyTraders: () => apiService.get('/trading/copy-traders'),
  // Real-time trading stats
  getLiveTradingStats: () => apiService.get('/trading/live-stats'),
  getWinLossRatio: () => apiService.get('/trading/win-loss-ratio'),
  placeTrade: (tradeData) => apiService.post('/trading/place-order', tradeData),
  closeTrade: (tradeId) => apiService.post(`/trading/close/${tradeId}`)
};

// Market API endpoints
export const marketAPI = {
  getTickerData: () => apiService.get('/market/ticker'),
  getChartData: (symbol, timeframe) => apiService.get('/market/chart', { symbol, timeframe }),
  getNews: (category) => apiService.get('/market/news', { category })
};

// Contact Management API endpoints
export const contactAPI = {
  // Get current contact information
  getContactInfo: () => apiService.get('/admin/contact-info'),
  
  // Update contact information (admin only)
  updateContactInfo: (contactData) => apiService.put('/admin/contact-info', contactData),
  
  // Get default contact information
  getDefaultContactInfo: () => {
    return Promise.resolve({
      companyName: 'Elon Investment Broker',
      supportEmail: 'support@eloninvestmentbroker.com',
      salesEmail: 'sales@eloninvestmentbroker.com',
      phone: '+1 (555) 123-4567',
      whatsapp: '+1 (555) 123-4567',
      telegram: '@eloninvestmentbroker',
      address: '123 Financial District, New York, NY 10004',
      businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM (EST)',
      responseTime: 'We typically respond within 2-4 hours during business hours',
      emergencySupport: '24/7 for critical trading issues'
    });
  },

  // Submit contact form (public)
  submitContactForm: (formData) => apiService.post('/contact/submit', formData)
};

// Investment Plans API endpoints
export const plansAPI = {
  getPlans: () => apiService.get('/plans'),
  getUserPlans: (userId) => apiService.get(`/plans/user/${userId}`),
  purchasePlan: (planData) => apiService.post('/plans/purchase', planData),
  getPlanStatistics: () => apiService.get('/plans/statistics')
};

// KYC API endpoints
export const kycAPI = {
  getStatus: (userId) => apiService.get(`/kyc/status/${userId}`),
  submitKYC: (kycData) => apiService.post('/kyc/submit', kycData),
  uploadDocument: (documentData) => apiService.post('/kyc/upload-document', documentData),
  getPendingApplications: () => apiService.get('/kyc/pending'),
  reviewApplication: (applicationId, reviewData) => apiService.post(`/kyc/review/${applicationId}`, reviewData)
};

// Referrals API endpoints
export const referralsAPI = {
  getUserReferrals: (userId) => apiService.get(`/referrals/${userId}`),
  registerReferral: (referralData) => apiService.post('/referrals/register', referralData),
  addCommission: (commissionData) => apiService.post('/referrals/commission', commissionData),
  getLeaderboard: () => apiService.get('/referrals/leaderboard'),
  getStatistics: () => apiService.get('/referrals/statistics')
};

// Loans API endpoints
export const loansAPI = {
  getProducts: () => apiService.get('/loans/products'),
  getUserLoans: (userId) => apiService.get(`/loans/user/${userId}`),
  applyLoan: (loanData) => apiService.post('/loans/apply', loanData),
  getPendingApplications: () => apiService.get('/loans/pending'),
  reviewApplication: (applicationId, reviewData) => apiService.post(`/loans/review/${applicationId}`, reviewData),
  getStatistics: () => apiService.get('/loans/statistics')
};

export default apiService;