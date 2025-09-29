// API Configuration and Base Service
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
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
  getStats: () => apiService.get('/auth/stats')
};

// Market API endpoints
export const marketAPI = {
  getTickerData: () => apiService.get('/market/ticker'),
  getChartData: (symbol, timeframe) => apiService.get('/market/chart', { symbol, timeframe }),
  getNews: (category) => apiService.get('/market/news', { category })
};

// Trading API endpoints
export const tradingAPI = {
  getPositions: () => apiService.get('/trading/positions'),
  getOrders: () => apiService.get('/trading/orders'),
  getHistory: () => apiService.get('/trading/history'),
  getSignals: () => apiService.get('/trading/signals'),
  getCopyTraders: () => apiService.get('/trading/copy-traders')
};

// Financial API endpoints
export const financialAPI = {
  getDeposits: () => apiService.get('/financial/deposits'),
  getWithdrawals: () => apiService.get('/financial/withdrawals'),
  getLoans: () => apiService.get('/financial/loans'),
  applyLoan: (loanData) => apiService.post('/financial/loans', loanData)
};

export default apiService;