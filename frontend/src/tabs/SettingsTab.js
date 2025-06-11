"use client"

import React, { useState, useEffect } from "react"
import { FiSave, FiUser, FiSettings, FiBell, FiDollarSign, FiShield, FiEye, FiEyeOff, FiCamera, FiMail, FiSmartphone, FiCheck, FiX } from "react-icons/fi"
import settingsService from "../services/settingsService"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "../components/LoadingSpinner"
import "./SettingsTab.css";


export default function SettingsTab({ onError }) {
  const { user, updateUser, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("profile")
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', or null
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const navigate = useNavigate();

  // Profile Settings State
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.profile_picture || "/placeholder.svg?height=80&width=80",
    bio: "",
    dateOfBirth: "",
    occupation: "",
    location: "",
  });

  // Security Settings State
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: "30", // minutes
  });

  // Preferences State
  const [preferencesData, setPreferencesData] = useState({
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12", // 12 or 24
    timezone: "America/New_York",
  });

  // Currency Settings State
  const [currencyData, setCurrencyData] = useState({
    primaryCurrency: "USD",
    currencyDisplay: "symbol", // symbol, code, name
    decimalSeparator: ".",
    thousandsSeparator: ",",
    decimalPlaces: 2,
    showCurrencySymbol: true,
  });

  // Notification Settings State
  const [notificationData, setNotificationData] = useState({
    emailNotifications: {
      budgetAlerts: true,
      monthlyReports: true,
      transactionReminders: false,
      securityAlerts: true,
      promotionalEmails: false,
    },
    pushNotifications: {
      newTransactions: true,
      budgetLimits: true,
      billReminders: true,
      weeklyDigest: false,
    },
    notificationFrequency: "immediate", // immediate, daily, weekly
    quietHours: {
      enabled: true,
      startTime: "22:00",
      endTime: "08:00",
    },
  });

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsService.getSettings();
      const settings = response.data;

      // Update profile data
      setProfileData({
        firstName: settings.name?.split(' ')[0] || '',
        lastName: settings.name?.split(' ')[1] || '',
        email: settings.email || '',
        phone: settings.phone || '',
        avatar: settings.profile_picture || '',
        bio: settings.bio || '',
        dateOfBirth: settings.date_of_birth || '',
        occupation: settings.occupation || '',
        location: settings.location || '',
      });

      // Update security data
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: settings.two_factor_enabled || false,
        loginNotifications: settings.login_notifications || true,
        sessionTimeout: settings.session_timeout?.toString() || '30',
      });

      // Update preferences data
      setPreferencesData({
        language: settings.language || 'en',
        dateFormat: settings.date_format || 'MM/DD/YYYY',
        timeFormat: settings.time_format || '12',
        timezone: settings.timezone || 'America/New_York',
      });

      // Update currency data
      setCurrencyData({
        primaryCurrency: settings.primary_currency || 'USD',
        currencyDisplay: settings.currency_display || 'symbol',
        decimalSeparator: settings.decimal_separator || '.',
        thousandsSeparator: settings.thousands_separator || ',',
        decimalPlaces: settings.decimal_places || 2,
        showCurrencySymbol: settings.show_currency_symbol || true,
      });

      // Update notification data
      setNotificationData({
        emailNotifications: settings.email_notifications || {
          budgetAlerts: true,
          monthlyReports: true,
          transactionReminders: false,
          securityAlerts: true,
          promotionalEmails: false,
        },
        pushNotifications: settings.push_notifications || {
          newTransactions: true,
          budgetLimits: true,
          billReminders: true,
          weeklyDigest: false,
        },
        notificationFrequency: settings.notification_frequency || 'immediate',
        quietHours: settings.quiet_hours || {
          enabled: true,
          startTime: '22:00',
          endTime: '08:00',
        },
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      if (onError) onError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings function
  const saveSettings = async (section, data) => {
    try {
      setIsLoading(true);
      setSaveStatus(null);

      let response;
      switch (section) {
        case 'profile':
          response = await settingsService.updateProfile({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone,
            bio: data.bio,
            date_of_birth: data.dateOfBirth,
            occupation: data.occupation,
            location: data.location,
          });
          break;
        case 'security':
          response = await settingsService.updateSecurity({
            two_factor_enabled: data.twoFactorEnabled,
            login_notifications: data.loginNotifications,
            session_timeout: parseInt(data.sessionTimeout),
          });
          break;
        case 'preferences':
          response = await settingsService.updatePreferences({
            language: data.language,
            date_format: data.dateFormat,
            time_format: data.timeFormat,
            timezone: data.timezone,
          });
          break;
        case 'currency':
          response = await settingsService.updateCurrency({
            primary_currency: data.primaryCurrency,
            currency_display: data.currencyDisplay,
            decimal_separator: data.decimalSeparator,
            thousands_separator: data.thousandsSeparator,
            decimal_places: data.decimalPlaces,
            show_currency_symbol: data.showCurrencySymbol,
          });
          break;
        case 'notifications':
          response = await settingsService.updateNotifications({
            email_notifications: data.emailNotifications,
            push_notifications: data.pushNotifications,
            notification_frequency: data.notificationFrequency,
            quiet_hours: data.quietHours,
          });
          break;
        default:
          throw new Error('Invalid section');
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      setSaveStatus('error');
      if (onError) onError(`Failed to save ${section} settings`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const response = await settingsService.uploadProfilePicture(file);
      setProfileData({ ...profileData, avatar: response.profile_picture });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setSaveStatus('error');
      if (onError) onError('Failed to upload profile picture');
    } finally {
      setIsLoading(false);
    }
  };

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
    setNotificationData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    setCurrencyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await saveSettings('profile', profileData);
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
      await saveSettings('preferences', preferencesData);
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
      await saveSettings('notifications', notificationData);
      alert('Notification settings updated successfully!');
    } catch (err) {
      console.error('Error updating notifications:', err);
      setError('Failed to update notification settings. Please try again.');
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await saveSettings('security', securityData);
      alert('Security settings updated successfully!');
    } catch (err) {
      console.error('Error updating security:', err);
      setError('Failed to update security settings. Please try again.');
    }
  };

  const handleCurrencySubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await saveSettings('currency', currencyData);
      alert('Currency settings updated successfully!');
    } catch (err) {
      console.error('Error updating currency:', err);
      setError('Failed to update currency settings. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      return;
    }

    try {
      await settingsService.deleteAccount();
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <LoadingSpinner />
      </div>
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
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-input"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
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
                      <label className="form-label">Language</label>
                      <select
                        className="form-select"
                        value={preferencesData.language}
                        onChange={(e) => setPreferencesData({ ...preferencesData, language: e.target.value })}
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
                        value={preferencesData.dateFormat}
                        onChange={(e) => setPreferencesData({ ...preferencesData, dateFormat: e.target.value })}
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time Format</label>
                      <select
                        className="form-select"
                        value={preferencesData.timeFormat}
                        onChange={(e) => setPreferencesData({ ...preferencesData, timeFormat: e.target.value })}
                      >
                        <option value="12">12-hour (AM/PM)</option>
                        <option value="24">24-hour</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Timezone</label>
                      <select
                        className="form-select"
                        value={preferencesData.timezone}
                        onChange={(e) => setPreferencesData({ ...preferencesData, timezone: e.target.value })}
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">GMT (BST)</option>
                        <option value="Europe/Paris">CET (CEST)</option>
                        <option value="Europe/Berlin">CET (CEST)</option>
                        <option value="Asia/Tokyo">JST (JST)</option>
                        <option value="Asia/Shanghai">CST (CST)</option>
                        <option value="Asia/Kolkata">IST (IST)</option>
                        <option value="Australia/Sydney">AEST (AEDT)</option>
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
                            checked={notificationData.emailNotifications.transactionReminders}
                            onChange={(e) => setNotificationData({
                              ...notificationData,
                              emailNotifications: {
                                ...notificationData.emailNotifications,
                                transactionReminders: e.target.checked
                              }
                            })}
                          />
                          <label htmlFor="emailTransaction">Transaction updates</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="emailBudget"
                            checked={notificationData.emailNotifications.budgetAlerts}
                            onChange={(e) => setNotificationData({
                              ...notificationData,
                              emailNotifications: {
                                ...notificationData.emailNotifications,
                                budgetAlerts: e.target.checked
                              }
                            })}
                          />
                          <label htmlFor="emailBudget">Budget alerts</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="emailTips"
                            checked={notificationData.emailNotifications.promotionalEmails}
                            onChange={(e) => setNotificationData({
                              ...notificationData,
                              emailNotifications: {
                                ...notificationData.emailNotifications,
                                promotionalEmails: e.target.checked
                              }
                            })}
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
                            checked={notificationData.pushNotifications.newTransactions}
                            onChange={(e) => setNotificationData({
                              ...notificationData,
                              pushNotifications: {
                                ...notificationData.pushNotifications,
                                newTransactions: e.target.checked
                              }
                            })}
                          />
                          <label htmlFor="pushTransaction">New transactions</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="pushBudget"
                            checked={notificationData.pushNotifications.budgetLimits}
                            onChange={(e) => setNotificationData({
                              ...notificationData,
                              pushNotifications: {
                                ...notificationData.pushNotifications,
                                budgetLimits: e.target.checked
                              }
                            })}
                          />
                          <label htmlFor="pushBudget">Budget alerts</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="pushBill"
                            checked={notificationData.pushNotifications.billReminders}
                            onChange={(e) => setNotificationData({
                              ...notificationData,
                              pushNotifications: {
                                ...notificationData.pushNotifications,
                                billReminders: e.target.checked
                              }
                            })}
                          />
                          <label htmlFor="pushBill">Bill reminders</label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Notification Frequency</label>
                      <select
                        className="form-select"
                        value={notificationData.notificationFrequency}
                        onChange={(e) => setNotificationData({ ...notificationData, notificationFrequency: e.target.value })}
                      >
                        <option value="immediate">Immediate</option>
                        <option value="daily">Daily Digest</option>
                        <option value="weekly">Weekly Digest</option>
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

      <div className="settings-section danger-zone">
        <h2>Danger Zone</h2>
        <button 
          className="btn-danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Account</h3>
            <p className="warning-text">
              Warning: This action cannot be undone. All your data will be permanently deleted.
            </p>
            <p>
              To confirm deletion, please type "DELETE" in the box below:
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="delete-confirmation-input"
            />
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}