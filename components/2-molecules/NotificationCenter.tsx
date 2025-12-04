'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth, useData, Notification } from '@/context';

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const notificationTypeStyles: Record<string, { icon: string; color: string }> = {
  application_received: { icon: '📩', color: 'var(--primary)' },
  application_accepted: { icon: '🎉', color: 'var(--success)' },
  application_rejected: { icon: '📋', color: 'var(--text-muted)' },
  job_completed: { icon: '✅', color: 'var(--success)' },
  review_received: { icon: '⭐', color: 'var(--warning)' },
  credentials: { icon: '🔑', color: 'var(--primary)' },
};

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

export default function NotificationCenter() {
  const { user } = useAuth();
  const { getNotificationsByUserId, getUnreadCount, markNotificationRead, markAllNotificationsRead, clearAllNotifications } = useData();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = user ? getNotificationsByUserId(user.id) : [];
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
  };

  const handleMarkAllRead = () => {
    if (user) {
      markAllNotificationsRead(user.id);
    }
  };

  const handleClearAll = async () => {
    if (user && notifications.length > 0) {
      setIsClearing(true);
      await clearAllNotifications(user.id);
      setIsClearing(false);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all duration-200 ${isOpen ? 'bg-[var(--primary-light)] text-[var(--primary)]' : ''}`}
        aria-label="Notifications"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 flex items-center justify-center bg-gradient-to-r from-[var(--danger)] to-red-400 text-white text-[10px] font-bold rounded-full shadow-lg shadow-[var(--danger)]/30 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fadeIn" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 max-h-[75vh] overflow-hidden bg-[var(--card-bg)] rounded-t-2xl shadow-xl z-50 animate-slideUp md:absolute md:inset-auto md:left-0 md:top-full md:mt-2 md:w-96 md:max-h-[28rem] md:rounded-xl md:border md:border-[var(--border-color)] md:shadow-2xl md:animate-scaleIn">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-gradient-to-r from-[var(--card-bg)] to-[var(--page-bg)]">
              <h3 className="font-bold text-[var(--text-color)] text-base md:text-lg tracking-tight">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--primary-light)]"
                  >
                    Mark read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    disabled={isClearing}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--danger)] hover:text-[var(--danger-hover)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--danger-light)] disabled:opacity-50"
                  >
                    <TrashIcon />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)] rounded-lg transition-all md:hidden"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(75vh-60px)] md:max-h-80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-2xl opacity-50">🔔</div>
                  <p className="text-[var(--text-muted)] text-sm font-medium">No notifications yet</p>
                  <p className="text-[var(--text-light)] text-xs mt-1">We'll let you know when something happens</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification, index) => {
                  const style = notificationTypeStyles[notification.type] || notificationTypeStyles.credentials;
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className={`p-4 border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--primary-light)] transition-all duration-200 animate-fadeIn ${
                        !notification.read ? 'bg-gradient-to-r from-[var(--primary-light)] to-transparent' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className="text-xl flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--page-bg)] rounded-xl">{style.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text-color)] truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-[11px] text-[var(--text-light)] mt-1.5 font-medium">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full flex-shrink-0 mt-1 shadow-lg shadow-[var(--primary)]/30" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {notifications.length > 10 && (
              <div className="p-3 border-t border-[var(--border-color)] text-center bg-gradient-to-t from-[var(--page-bg)] to-transparent">
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  +{notifications.length - 10} more notifications
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
