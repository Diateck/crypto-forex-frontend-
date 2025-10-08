import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { safeParseResponse } from '../utils/safeResponse.js';
import { nextDelayMs, retryAfterToMs } from '../utils/backoff';

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

  const attemptRef = useRef(0);

  // Fetch notifications from backend with safe parsing and backoff
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/dashboard/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const parsed = await safeParseResponse(response);

      if (parsed.success && parsed.data) {
        attemptRef.current = 0; // reset on success
        const data = Array.isArray(parsed.data) ? parsed.data : parsed.data.notifications || [];

        const processedNotifications = data.map((notification, index) => ({
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
      } else if (parsed.status === 429) {
        // honor Retry-After header if present
        const raMs = parsed.retryAfter || retryAfterToMs(response);
        const delay = raMs ? Number(raMs) : nextDelayMs(attemptRef.current);
        attemptRef.current++;
        console.warn(`Notifications endpoint rate-limited. Backing off for ${delay}ms.`);
        // schedule next poll after delay by returning and letting interval handle it
        return delay;
      } else {
        attemptRef.current++;
        console.warn('Failed to fetch notifications:', parsed.error);
        return nextDelayMs(attemptRef.current);
      }
    } catch (error) {
      attemptRef.current++;
      console.error('Failed to fetch notifications:', error);
      return nextDelayMs(attemptRef.current);
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

  // Fetch notifications on mount and set up backoff-aware polling
  useEffect(() => {
    let mounted = true;
    let timeoutId = null;

    const scheduleNext = (ms) => {
      if (!mounted) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(runOnce, ms);
    };

    const runOnce = async () => {
      if (!mounted) return;
      const result = await fetchNotifications();
      // If fetchNotifications returned a numeric delay, use it; otherwise use normal 60s
      const delay = typeof result === 'number' ? result : 60000;
      scheduleNext(delay);
    };

    // Start immediately
    runOnce();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
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