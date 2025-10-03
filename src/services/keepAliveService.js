// Keep-Alive Service to prevent backend from sleeping
class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    this.pingInterval = 10 * 60 * 1000; // 10 minutes
    this.baseUrl = 'https://crypto-forex-backend-9mme.onrender.com';
    this.lastPingTime = null;
    this.consecutiveFailures = 0;
    this.maxFailures = 3;
  }

  // Start the keep-alive service
  start() {
    if (this.isRunning) {
      console.log('Keep-alive service is already running');
      return;
    }

    console.log('🚀 Starting keep-alive service...');
    this.isRunning = true;
    
    // Initial ping
    this.ping();
    
    // Set up interval
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.pingInterval);
  }

  // Stop the keep-alive service
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🛑 Keep-alive service stopped');
  }

  // Ping the backend health endpoint
  async ping() {
    try {
      const startTime = Date.now();
      console.log('🏓 Pinging backend server...');
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Short timeout for health checks
        signal: AbortSignal.timeout(15000) // 15 seconds timeout
      });

      const responseTime = Date.now() - startTime;
      this.lastPingTime = new Date().toISOString();

      if (response.ok) {
        const data = await response.json();
        this.consecutiveFailures = 0;
        console.log(`✅ Backend alive - Response time: ${responseTime}ms`, {
          status: data.status,
          timestamp: data.timestamp
        });
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('backend-ping-success', {
          detail: { responseTime, data }
        }));
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      this.consecutiveFailures++;
      console.warn(`⚠️ Backend ping failed (${this.consecutiveFailures}/${this.maxFailures}):`, error.message);
      
      // Dispatch failure event
      window.dispatchEvent(new CustomEvent('backend-ping-failed', {
        detail: { error: error.message, failures: this.consecutiveFailures }
      }));

      // If too many failures, increase ping frequency temporarily
      if (this.consecutiveFailures >= this.maxFailures) {
        console.log('🔄 Too many failures, increasing ping frequency');
        this.increaseFrequency();
      }
    }
  }

  // Temporarily increase ping frequency when server is struggling
  increaseFrequency() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      
      // Ping every 5 minutes during issues
      this.intervalId = setInterval(() => {
        this.ping();
      }, 5 * 60 * 1000);

      // Reset to normal frequency after 30 minutes
      setTimeout(() => {
        this.resetFrequency();
      }, 30 * 60 * 1000);
    }
  }

  // Reset to normal ping frequency
  resetFrequency() {
    if (this.intervalId && this.consecutiveFailures > 0) {
      clearInterval(this.intervalId);
      
      this.intervalId = setInterval(() => {
        this.ping();
      }, this.pingInterval);
      
      console.log('🔄 Reset to normal ping frequency');
    }
  }

  // Get service status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastPingTime: this.lastPingTime,
      consecutiveFailures: this.consecutiveFailures,
      pingInterval: this.pingInterval
    };
  }

  // Manual ping for immediate health check
  async healthCheck() {
    return this.ping();
  }
}

// Create singleton instance
const keepAliveService = new KeepAliveService();

export default keepAliveService;