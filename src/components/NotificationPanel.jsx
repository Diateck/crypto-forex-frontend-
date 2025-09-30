import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import './NotificationPanel.css';

const NotificationPanel = () => {
  const { 
    notifications, 
    unreadCount, 
    isVisible, 
    removeNotification, 
    markAsRead, 
    clearAll,
    toggleNotifications 
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'trade':
        return '📊';
      case 'deposit':
        return '💰';
      case 'kyc':
        return '🆔';
      default:
        return 'ℹ️';
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <>
      {/* Notification Bell Icon */}
      <div className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        <div className="bell-icon">
          🔔
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {notifications.length > 0 && (
                <button 
                  className="clear-all-btn"
                  onClick={clearAll}
                  title="Clear all notifications"
                >
                  Clear All
                </button>
              )}
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
                title="Close notifications"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>

                  <button
                    className="notification-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    title="Remove notification"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="notification-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default NotificationPanel;