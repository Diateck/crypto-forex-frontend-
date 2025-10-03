// Keep-Alive Service to prevent backend from sleeping
class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    this.pingInterval = 5 * 60 * 1000; // 5 minutes (more aggressive)
    this.baseUrl = 'https://crypto-forex-backend-9mme.onrender.com';
    this.lastPingTime = null;
    this.consecutiveFailures = 0;
    this.maxFailures = 3;
    this.totalPings = 0;
    this.successfulPings = 0;
  }

  // Start the keep-alive service
  start() {
    if (this.isRunning) {
      console.log('Keep-alive service is already running');
      return;
    }

    console.log('🚀 Starting aggressive keep-alive service (5-minute intervals)...');
    this.isRunning = true;
    
    // Initial ping immediately
    this.ping();
    
    // Set up interval - ping every 5 minutes
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.pingInterval);

    // Also add a secondary safety net - ping every 3 minutes during active sessions
    this.startActiveSessionMode();
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
      this.totalPings++;
      console.log(`🏓 Pinging backend server... (${this.totalPings} total pings)`);
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache', // Prevent caching
        },
        // Short timeout for health checks
        signal: AbortSignal.timeout(10000) // 10 seconds timeout
      });

      const responseTime = Date.now() - startTime;
      this.lastPingTime = new Date().toISOString();

      if (response.ok) {
        const data = await response.json();
        this.consecutiveFailures = 0;
        this.successfulPings++;
        
        console.log(`✅ Backend alive - Response: ${responseTime}ms | Success Rate: ${this.successfulPings}/${this.totalPings}`, {
          status: data.status,
          timestamp: data.timestamp
        });
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('backend-ping-success', {
          detail: { responseTime, data, totalPings: this.totalPings }
        }));
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      this.consecutiveFailures++;
      console.warn(`⚠️ Backend ping failed (${this.consecutiveFailures}/${this.maxFailures}) | Success Rate: ${this.successfulPings}/${this.totalPings}:`, error.message);
      
      // Dispatch failure event
      window.dispatchEvent(new CustomEvent('backend-ping-failed', {
        detail: { error: error.message, failures: this.consecutiveFailures }
      }));

      // If too many failures, increase ping frequency even more
      if (this.consecutiveFailures >= this.maxFailures) {
        console.log('🔄 Too many failures, switching to emergency mode (2-minute pings)');
        this.emergencyMode();
      }
    }
  }

  // Start active session mode for more frequent pings during user activity
  startActiveSessionMode() {
    // Detect user activity (mouse, keyboard, scroll)
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    let lastActivity = Date.now();
    let activeSessionInterval = null;

    const handleActivity = () => {
      lastActivity = Date.now();
      
      // If not already in active session mode, start it
      if (!activeSessionInterval) {
        console.log('👤 User active - Starting intensive keep-alive mode (3-minute intervals)');
        activeSessionInterval = setInterval(() => {
          // Check if user was active in last 15 minutes
          if (Date.now() - lastActivity < 15 * 60 * 1000) {
            this.ping();
          } else {
            // User inactive, stop intensive mode
            console.log('💤 User inactive - Stopping intensive keep-alive mode');
            clearInterval(activeSessionInterval);
            activeSessionInterval = null;
          }
        }, 3 * 60 * 1000); // 3 minutes during active sessions
      }
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });
  }

  // Emergency mode for when server is struggling
  emergencyMode() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      
      console.log('🚨 Emergency mode activated - Pinging every 2 minutes');
      // Ping every 2 minutes during emergency
      this.intervalId = setInterval(() => {
        this.ping();
      }, 2 * 60 * 1000);

      // Reset to normal frequency after 20 minutes
      setTimeout(() => {
        this.resetFrequency();
      }, 20 * 60 * 1000);
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
      pingInterval: this.pingInterval,
      totalPings: this.totalPings,
      successfulPings: this.successfulPings,
      successRate: this.totalPings > 0 ? ((this.successfulPings / this.totalPings) * 100).toFixed(1) + '%' : '0%'
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