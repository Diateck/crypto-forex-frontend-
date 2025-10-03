import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  Box, 
  Chip, 
  LinearProgress, 
  Snackbar,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon
} from '@mui/icons-material';
import connectionManager from '../services/connectionManager';

const ConnectionStatus = ({ showDetailedStatus = false }) => {
  const [status, setStatus] = useState(connectionManager.getStatus());
  const [showAlert, setShowAlert] = useState(false);
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    // Listen for connection status changes
    const handleStatusChange = (newStatus) => {
      setStatus(newStatus);
      
      // Show alert for important status changes
      if (newStatus.status === 'disconnected') {
        setLastMessage('Server connection lost. Attempting to reconnect...');
        setShowAlert(true);
      } else if (newStatus.status === 'connected' && status.status !== 'connected') {
        setLastMessage('Connected to server successfully!');
        setShowAlert(true);
        // Auto-hide success message
        setTimeout(() => setShowAlert(false), 3000);
      }
    };

    connectionManager.addListener(handleStatusChange);

    return () => {
      connectionManager.removeListener(handleStatusChange);
    };
  }, [status.status]);

  // Handle manual reconnection
  const handleReconnect = async () => {
    setLastMessage('Testing connection...');
    setShowAlert(true);
    await connectionManager.testConnection();
  };

  // Get status color and icon
  const getStatusProps = () => {
    switch (status.status) {
      case 'connected':
        return {
          color: 'success',
          icon: <CloudDoneIcon />,
          label: 'Connected',
          bgcolor: '#4caf50'
        };
      case 'connecting':
        return {
          color: 'warning',
          icon: <WifiIcon />,
          label: `Connecting${status.retryAttempts > 0 ? ` (${status.retryAttempts}/${status.maxRetries})` : ''}`,
          bgcolor: '#ff9800'
        };
      case 'disconnected':
        return {
          color: 'error',
          icon: <CloudOffIcon />,
          label: 'Disconnected',
          bgcolor: '#f44336'
        };
      default:
        return {
          color: 'default',
          icon: <WifiOffIcon />,
          label: 'Unknown',
          bgcolor: '#757575'
        };
    }
  };

  const statusProps = getStatusProps();

  // Compact status indicator (default)
  if (!showDetailedStatus) {
    return (
      <>
        <Tooltip title={`Server ${statusProps.label}`}>
          <Chip
            icon={statusProps.icon}
            label={statusProps.label}
            color={statusProps.color}
            size="small"
            variant={status.status === 'connected' ? 'filled' : 'outlined'}
            sx={{ 
              fontSize: '0.75rem',
              height: 24,
              '& .MuiChip-icon': {
                fontSize: 16
              }
            }}
          />
        </Tooltip>

        {/* Connection status alert */}
        <Snackbar
          open={showAlert && status.status !== 'connected'}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: 8 }}
        >
          <Alert 
            severity={status.status === 'connecting' ? 'info' : 'warning'}
            action={
              status.status === 'disconnected' && (
                <IconButton 
                  size="small" 
                  onClick={handleReconnect}
                  color="inherit"
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              )
            }
          >
            {lastMessage}
          </Alert>
        </Snackbar>
      </>
    );
  }

  // Detailed status view
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        p: 2, 
        borderRadius: 2, 
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: statusProps.bgcolor 
        }}>
          {statusProps.icon}
          <Typography variant="body2" fontWeight="bold">
            Server Status:
          </Typography>
        </Box>
        
        <Chip
          icon={statusProps.icon}
          label={statusProps.label}
          color={statusProps.color}
          variant="filled"
        />

        {status.status === 'disconnected' && (
          <Tooltip title="Test connection">
            <IconButton 
              size="small" 
              onClick={handleReconnect}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Loading progress for connecting state */}
      {status.status === 'connecting' && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress color="warning" />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {status.retryAttempts > 0 
              ? `Retry attempt ${status.retryAttempts} of ${status.maxRetries}...`
              : 'Establishing connection...'
            }
          </Typography>
        </Box>
      )}

      {/* Connection alerts */}
      <Snackbar
        open={showAlert}
        autoHideDuration={status.status === 'connected' ? 3000 : null}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={
            status.status === 'connected' ? 'success' :
            status.status === 'connecting' ? 'info' : 'error'
          }
          onClose={() => setShowAlert(false)}
          action={
            status.status === 'disconnected' && (
              <IconButton 
                size="small" 
                onClick={handleReconnect}
                color="inherit"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            )
          }
        >
          {lastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConnectionStatus;