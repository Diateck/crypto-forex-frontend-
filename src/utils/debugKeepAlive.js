// Debug utility for keep-alive service
import keepAliveService from '../services/keepAliveService';

class KeepAliveDebugger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
    this.isLogging = false;
  }

  startLogging() {
    if (this.isLogging) return;
    
    this.isLogging = true;
    console.log('🔍 Keep-Alive Debugger started');

    // Listen to ping events
    window.addEventListener('backend-ping-success', (event) => {
      this.addLog('SUCCESS', event.detail);
    });

    window.addEventListener('backend-ping-failed', (event) => {
      this.addLog('FAILED', event.detail);
    });

    // Log service status every minute
    this.statusInterval = setInterval(() => {
      const status = keepAliveService.getStatus();
      this.addLog('STATUS', status);
    }, 60 * 1000);
  }

  stopLogging() {
    this.isLogging = false;
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
    console.log('🔍 Keep-Alive Debugger stopped');
  }

  addLog(type, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      data
    };

    this.logs.push(logEntry);

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with color coding
    const colors = {
      SUCCESS: 'color: green; font-weight: bold',
      FAILED: 'color: red; font-weight: bold',
      STATUS: 'color: blue; font-weight: bold'
    };

    console.log(
      `%c[${type}] ${logEntry.timestamp}`,
      colors[type] || 'color: black',
      data
    );
  }

  getLogs() {
    return this.logs;
  }

  getRecentLogs(count = 10) {
    return this.logs.slice(-count);
  }

  exportLogs() {
    const logsText = this.logs.map(log => 
      `[${log.timestamp}] ${log.type}: ${JSON.stringify(log.data)}`
    ).join('\n');

    // Create downloadable file
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keep-alive-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Manual test function
  async testBackend() {
    console.log('🧪 Testing backend manually...');
    try {
      await keepAliveService.healthCheck();
      console.log('✅ Manual backend test successful');
      return true;
    } catch (error) {
      console.error('❌ Manual backend test failed:', error);
      return false;
    }
  }

  // Get summary statistics
  getSummary() {
    const successLogs = this.logs.filter(log => log.type === 'SUCCESS');
    const failedLogs = this.logs.filter(log => log.type === 'FAILED');
    
    return {
      totalLogs: this.logs.length,
      successCount: successLogs.length,
      failureCount: failedLogs.length,
      successRate: this.logs.length > 0 ? 
        ((successLogs.length / (successLogs.length + failedLogs.length)) * 100).toFixed(1) + '%' : '0%',
      lastSuccess: successLogs.length > 0 ? successLogs[successLogs.length - 1].timestamp : 'Never',
      lastFailure: failedLogs.length > 0 ? failedLogs[failedLogs.length - 1].timestamp : 'Never'
    };
  }
}

// Create singleton instance
const keepAliveDebugger = new KeepAliveDebugger();

// Make it available globally for console access
window.keepAliveDebugger = keepAliveDebugger;
window.keepAlive = keepAliveService;

export default keepAliveDebugger;