import React, { useState, useRef, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      api.get('/notifications')
        .then(res => {
          setNotifications(res.data || []);
          setError(null);
        })
        .catch(() => setError('Failed to load notifications'))
        .finally(() => setLoading(false));
    }
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button className="notification-button" onClick={() => setOpen(o => !o)}>
        <FiBell />
        {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            style={{ minWidth: '260px' }}
          >
            <div className="p-4 border-b font-semibold">Notifications</div>
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No notifications</div>
              ) : (
                notifications.map((notif, idx) => (
                  <div key={idx} className="px-4 py-2 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="font-medium">{notif.title}</div>
                    <div className="text-sm text-gray-500">{notif.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{notif.time}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown; 