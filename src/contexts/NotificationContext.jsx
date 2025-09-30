import React, { createContext, useContext, useReducer, useEffect } from 'react';

const NotificationContext = createContext();

// Notification actions
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  CLEAR_ALL: 'CLEAR_ALL',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS'
};

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    
    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    
    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };
    
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      const newNotifications = action.payload.map(n => ({
        ...n,
        read: state.readNotifications.includes(n.id)
      }));
      const unreadCount = newNotifications.filter(n => !n.read).length;
      
      return {
        ...state,
        notifications: newNotifications,
        unreadCount
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  readNotifications: JSON.parse(localStorage.getItem('readNotifications') || '[]'),
  isVisible: false
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Backend API configuration
  const BACKEND_URL = 'https://crypto-forex-backend-9mme.onrender.com/api';

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/dashboard/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Add unique IDs and timestamps if not present
          const processedNotifications = data.data.map((notification, index) => ({
            id: notification.id || `backend-${Date.now()}-${index}`,
            type: notification.type || 'info',
            title: notification.title || 'Notification',
            message: notification.message,
            timestamp: notification.timestamp || new Date().toISOString(),
            read: false,
            source: 'backend'
          }));

          dispatch({
            type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
            payload: processedNotifications
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: `local-${Date.now()}-${Math.random()}`,
      type: notification.type || 'info',
      title: notification.title || 'Notification',
      message: notification.message,
      timestamp: new Date().toISOString(),
      read: false,
      source: 'local',
      autoRemove: notification.autoRemove !== false, // default true
      ...notification
    };

    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: newNotification
    });

    // Auto-remove after 5 seconds if autoRemove is true
    if (newNotification.autoRemove) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  // Remove a notification
  const removeNotification = (id) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
      payload: id
    });
  };

  // Mark notification as read
  const markAsRead = (id) => {
    const readNotifications = [...state.readNotifications, id];
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
    
    dispatch({
      type: NOTIFICATION_ACTIONS.MARK_AS_READ,
      payload: id
    });
  };

  // Clear all notifications
  const clearAll = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
  };

  // Toggle notification panel visibility
  const toggleNotifications = () => {
    state.isVisible = !state.isVisible;
  };

  // Fetch notifications on mount and set up interval
  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const contextValue = {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isVisible: state.isVisible,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
    toggleNotifications,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;