// Connection Manager for handling retries and connection status
class ConnectionManager {
  constructor() {
    this.isConnected = true;
    this.isConnecting = false;
    this.connectionStatus = 'connected'; // 'connected', 'connecting', 'disconnected'
    this.retryAttempts = 0;
    this.maxRetries = 3;
    this.retryDelays = [1000, 3000, 5000]; // 1s, 3s, 5s
    this.listeners = new Set();
  }

  // Add connection status listener
  addListener(callback) {
    this.listeners.add(callback);
    // Immediately call with current status
    callback(this.getStatus());
  }

  // Remove connection status listener
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  // Notify all listeners of status change
  notifyListeners() {
    const status = this.getStatus();
    this.listeners.forEach(callback => callback(status));
  }

  // Update connection status
  setStatus(status, message = '') {
    const oldStatus = this.connectionStatus;
    this.connectionStatus = status;
    this.isConnected = status === 'connected';
    this.isConnecting = status === 'connecting';
    
    if (oldStatus !== status) {
      console.log(`🔄 Connection status changed: ${oldStatus} → ${status}`, message);
      this.notifyListeners();
    }
  }

  // Get current connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      status: this.connectionStatus,
      retryAttempts: this.retryAttempts,
      maxRetries: this.maxRetries
    };
  }

  // Enhanced fetch with retry logic
  async fetchWithRetry(url, options = {}) {
    this.retryAttempts = 0;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // Set connecting status on first attempt or retries
        if (attempt > 0 || this.connectionStatus !== 'connected') {
          this.setStatus('connecting', `Attempt ${attempt + 1}/${this.maxRetries + 1}`);
        }

        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // If we get here, the network transported a response.
        // Do NOT treat 429 (Too Many Requests) as a connectivity failure here
        // — return the response to the caller so they can inspect status and
        // Retry-After header and decide on backoff behavior.
        if (this.connectionStatus !== 'connected') {
          this.setStatus('connected', 'Connection restored');
        }
        this.retryAttempts = 0;

        return response;

      } catch (error) {
        this.retryAttempts = attempt + 1;
        
        console.warn(`🔄 Request failed (attempt ${attempt + 1}/${this.maxRetries + 1}):`, error.message);

        // If this was the last attempt, mark as disconnected
        if (attempt === this.maxRetries) {
          this.setStatus('disconnected', 'All retry attempts failed');
          throw new Error(`Connection failed after ${this.maxRetries + 1} attempts: ${error.message}`);
        }

        // Wait before retrying (with exponential backoff)
        const delay = this.retryDelays[attempt] || 5000;
        console.log(`⏳ Retrying in ${delay/1000}s...`);
        await this.delay(delay);
      }
    }
  }

  // Helper method for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Test connection to backend
  async testConnection() {
    try {
      this.setStatus('connecting', 'Testing connection...');
      
      const response = await this.fetchWithRetry('https://crypto-forex-backend-9mme.onrender.com/health');
  const { safeParseResponse } = await import('../utils/safeResponse.js');
      const parsed = await safeParseResponse(response);

      if (parsed.status === 429) {
        // Respect server's retry suggestion but treat as failure for connection test
        this.setStatus('disconnected', 'Rate limited during connection test');
        return { success: false, status: 429, retryAfter: parsed.retryAfter };
      }

      if (parsed.success) {
        this.setStatus('connected', 'Connection test successful');
        return { success: true, data: parsed.data };
      }

      throw new Error(parsed.error || 'Connection test failed');
    } catch (error) {
      this.setStatus('disconnected', `Connection test failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Reset connection state
  reset() {
    this.retryAttempts = 0;
    this.setStatus('connected', 'Connection reset');
  }

  // Handle backend ping events
  setupKeepAliveListeners() {
    // Listen for keep-alive ping results
    window.addEventListener('backend-ping-success', () => {
      if (this.connectionStatus !== 'connected') {
        this.setStatus('connected', 'Backend ping successful');
      }
    });

    window.addEventListener('backend-ping-failed', (event) => {
      const { failures } = event.detail;
      if (failures >= 2) {
        this.setStatus('disconnected', 'Backend ping failed multiple times');
      }
    });
  }
}

// Create singleton instance
const connectionManager = new ConnectionManager();

// Set up keep-alive listeners
connectionManager.setupKeepAliveListeners();

export default connectionManager;