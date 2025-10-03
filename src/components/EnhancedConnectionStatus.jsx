import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Collapse,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Button
} from '@mui/material';
import { 
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import connectionManager from '../services/connectionManager';
import keepAliveService from '../services/keepAliveService';

function EnhancedConnectionStatus() {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState({});
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  useEffect(() => {
    // Listen to connection events
    const handleSuccess = (event) => {
      setStatus('connected');
      setLastCheck(new Date());
      setResponseTime(event.detail.responseTime);
      setIsManualRefresh(false);
      
      // Update stats
      const keepAliveStats = keepAliveService.getStatus();
      setStats(keepAliveStats);
    };

    const handleFailure = (event) => {
      setStatus('disconnected');
      setLastCheck(new Date());
      setResponseTime(null);
      setIsManualRefresh(false);
    };

    const handleReconnecting = () => {
      setStatus('reconnecting');
    };

    // Add event listeners
    window.addEventListener('backend-ping-success', handleSuccess);
    window.addEventListener('backend-ping-failed', handleFailure);
    window.addEventListener('connection-status-reconnecting', handleReconnecting);

    // Update stats every 30 seconds
    const statsInterval = setInterval(() => {
      const keepAliveStats = keepAliveService.getStatus();
      setStats(keepAliveStats);
    }, 30000);

    return () => {
      window.removeEventListener('backend-ping-success', handleSuccess);
      window.removeEventListener('backend-ping-failed', handleFailure);
      window.removeEventListener('connection-status-reconnecting', handleReconnecting);
      clearInterval(statsInterval);
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsManualRefresh(true);
    setStatus('checking');
    try {
      await keepAliveService.healthCheck();
    } catch (error) {
      console.error('Manual refresh failed:', error);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'success';
      case 'disconnected': return 'error';
      case 'reconnecting': return 'warning';
      case 'checking': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return <WifiIcon />;
      case 'disconnected': return <WifiOffIcon />;
      case 'reconnecting': return <RefreshIcon className="animate-spin" />;
      case 'checking': return <RefreshIcon className="animate-spin" />;
      default: return <WifiOffIcon />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Backend Online';
      case 'disconnected': return 'Backend Offline';
      case 'reconnecting': return 'Reconnecting...';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 20, 
      right: 20, 
      zIndex: 9999,
      minWidth: 200
    }}>
      <Card elevation={3} sx={{ backgroundColor: 'background.paper' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Chip
              icon={getStatusIcon()}
              label={getStatusText()}
              color={getStatusColor()}
              variant="filled"
              size="small"
            />
            
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                size="small" 
                onClick={handleManualRefresh}
                disabled={isManualRefresh}
              >
                <RefreshIcon sx={{ fontSize: 16 }} />
              </IconButton>
              
              <IconButton 
                size="small" 
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>

          {/* Response Time Indicator */}
          {responseTime && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <SpeedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {responseTime}ms
              </Typography>
            </Box>
          )}

          {/* Last Check Time */}
          {lastCheck && (
            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
              Last check: {lastCheck.toLocaleTimeString()}
            </Typography>
          )}

          {/* Expanded Details */}
          <Collapse in={isExpanded}>
            <Box mt={2}>
              {/* Keep-Alive Stats */}
              {stats.totalPings > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="caption" component="div">
                    <strong>Keep-Alive Stats:</strong><br />
                    Success Rate: {stats.successRate}<br />
                    Total Pings: {stats.totalPings}<br />
                    Failures: {stats.consecutiveFailures}
                  </Typography>
                </Alert>
              )}

              {/* Manual Actions */}
              <Box display="flex" gap={1} flexWrap="wrap">
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => window.location.reload()}
                >
                  Reload App
                </Button>
                
                {process.env.NODE_ENV === 'development' && (
                  <>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => window.keepAliveDebugger?.exportLogs()}
                    >
                      Export Logs
                    </Button>
                    
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={async () => {
                        const stats = await keepAliveService.getBackendStats();
                        if (stats) {
                          console.log('Backend Stats:', stats);
                          alert(`Backend Uptime: ${stats.server.uptime.formatted}\nTotal Requests: ${stats.requests.total}`);
                        }
                      }}
                    >
                      Backend Stats
                    </Button>
                  </>
                )}
              </Box>

              {/* Loading indicator for manual refresh */}
              {isManualRefresh && (
                <Box mt={1}>
                  <LinearProgress size="small" />
                  <Typography variant="caption" color="text.secondary">
                    Testing connection...
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EnhancedConnectionStatus;