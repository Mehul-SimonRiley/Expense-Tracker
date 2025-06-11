"use client"

import React, { useState, useEffect } from "react"
import { FiSave } from "react-icons/fi"
import { settingsService } from "../services/api";
import { authService } from "../services/auth";
import LoadingSpinner from '../components/LoadingSpinner'
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from '../contexts/AuthContext';

const SettingsTab = () => {
  const { user, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState("profile")
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [preferencesData, setPreferencesData] = useState({
    theme: "light",
    language: "en",
    date_format: "MM/DD/YYYY"
  });

  const [notificationsData, setNotificationsData] = useState({
    email_notifications: true,
    push_notifications: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Load user profile data
        if (user) {
          setProfileData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
          });
        } else {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setProfileData({
              name: currentUser.name || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
            });
          }
        }

        // Load preferences data
        try {
          const response = await settingsService.getSettings();
          if (response.data) {
            setPreferencesData({
              theme: response.data.theme || "light",
              language: response.data.language || "en",
              date_format: response.data.date_format || "MM/DD/YYYY"
            });
            setNotificationsData({
              email_notifications: response.data.email_notifications ?? true,
              push_notifications: response.data.push_notifications ?? true
            });
          }
        } catch (error) {
          console.error("Error loading settings:", error);
          // Don't throw the error, just log it
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("Failed to load settings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Helper to get initials from name or email
  const getInitials = (user) => {
    if (!user) return '';
    if (user.name) {
      const names = user.name.trim().split(' ');
      if (names.length === 1) return names[0][0].toUpperCase();
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    if (user.email) return user.email[0].toUpperCase();
    return '';
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferencesChange = (e) => {
    const { name, value } = e.target;
    setPreferencesData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationsChange = (e) => {
    const { name, checked } = e.target;
    setNotificationsData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const updatedUser = await settingsService.updateProfile(profileData);
      if (updatedUser) {
        updateUser(updatedUser);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await settingsService.updatePreferences(preferencesData);
      alert('Preferences updated successfully!');
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences. Please try again.');
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await settingsService.updateNotifications(notificationsData);
      alert('Notification settings updated successfully!');
    } catch (err) {
      console.error('Error updating notifications:', err);
      setError('Failed to update notification settings. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <LoadingSpinner text="Loading settings..." />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <h1 className="page-title">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-1/4 md:min-h-[500px] border-r bg-white rounded-lg shadow-sm sticky top-4">
          <div className="p-0">
            <ul className="divide-y">
              <li>
                <button
                  className={`w-full text-left px-4 py-3 rounded-none ${activeSection === "profile" ? "bg-black text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveSection("profile")}
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 rounded-none ${activeSection === "preferences" ? "bg-black text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveSection("preferences")}
                >
                  Preferences
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 rounded-none ${activeSection === "notifications" ? "bg-black text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveSection("notifications")}
                >
                  Notifications
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Settings Content */}
        <div className="card flex-1">
          {activeSection === "profile" && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-lg shadow mb-6"
              >
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">Profile Settings</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="form-group">
                      <label className="form-label">Profile Avatar</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-700">
                          {getInitials(profileData) || "U"}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={profileData.name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-input"
                        value={profileData.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-end"
              >
                <button
                  className="btn btn-primary"
                  onClick={handleProfileSubmit}
                  disabled={isLoading}
                >
                  <FiSave className="mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </motion.div>
            </>
          )}

          {activeSection === "preferences" && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-lg shadow mb-6"
              >
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">Preferences</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="form-group">
                      <label className="form-label">Theme</label>
                      <select
                        className="form-select"
                        value={preferencesData.theme}
                        onChange={handlePreferencesChange}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Language</label>
                      <select
                        className="form-select"
                        value={preferencesData.language}
                        onChange={handlePreferencesChange}
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                        <option value="bn">Bengali</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date Format</label>
                      <select
                        className="form-select"
                        value={preferencesData.date_format}
                        onChange={handlePreferencesChange}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-end"
              >
                <button
                  className="btn btn-primary"
                  onClick={handlePreferencesSubmit}
                  disabled={isLoading}
                >
                  <FiSave className="mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </motion.div>
            </>
          )}

          {activeSection === "notifications" && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-lg shadow mb-6"
              >
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">Notification Settings</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="form-group">
                      <label className="form-label">Email Notifications</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="emailTransaction"
                            checked={notificationsData.email_notifications}
                            onChange={handleNotificationsChange}
                          />
                          <label htmlFor="emailTransaction">Transaction updates</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="emailBudget"
                            checked={notificationsData.email_notifications}
                            onChange={handleNotificationsChange}
                          />
                          <label htmlFor="emailBudget">Budget alerts</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="emailTips"
                            checked={notificationsData.email_notifications}
                            onChange={handleNotificationsChange}
                          />
                          <label htmlFor="emailTips">Saving tips and recommendations</label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Push Notifications</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="pushTransaction"
                            checked={notificationsData.push_notifications}
                            onChange={handleNotificationsChange}
                          />
                          <label htmlFor="pushTransaction">New transactions</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="pushBudget"
                            checked={notificationsData.push_notifications}
                            onChange={handleNotificationsChange}
                          />
                          <label htmlFor="pushBudget">Budget alerts</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="pushBill"
                            checked={notificationsData.push_notifications}
                            onChange={handleNotificationsChange}
                          />
                          <label htmlFor="pushBill">Bill reminders</label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Notification Frequency</label>
                      <select className="form-select">
                        <option>Immediately</option>
                        <option>Daily Digest</option>
                        <option>Weekly Digest</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-end"
              >
                <button
                  className="btn btn-primary"
                  onClick={handleNotificationsSubmit}
                  disabled={isLoading}
                >
                  <FiSave className="mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default SettingsTab;