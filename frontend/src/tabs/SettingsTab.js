"use client"

import { useState } from "react"
import { FiSave } from "react-icons/fi"
import { settingsService } from "../services/api";

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState("profile")

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [preferencesData, setPreferencesData] = useState({
    theme: "light",
    language: "en",
    date_format: "YYYY-MM-DD",
    start_of_week: "Monday",
  });

  const [notificationsData, setNotificationsData] = useState({
    email_notifications: true,
    push_notifications: true,
  });

  const handleSaveProfile = async () => {
    try {
      await settingsService.updateProfile(profileData);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again later.");
    }
  };

  const handleSavePreferences = async () => {
    try {
      await settingsService.updatePreferences(preferencesData);
      alert("Preferences updated successfully");
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to update preferences. Please try again later.");
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await settingsService.updateNotifications(notificationsData);
      alert("Notification settings updated successfully");
    } catch (error) {
      console.error("Error updating notifications:", error);
      alert("Failed to update notifications. Please try again later.");
    }
  };

  return (
    <div>
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
                  className={`w-full text-left px-4 py-3 rounded-none ${activeSection === "account" ? "bg-black text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveSection("account")}
                >
                  Account
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
              <li>
                <button
                  className={`w-full text-left px-4 py-3 rounded-none ${activeSection === "data" ? "bg-black text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveSection("data")}
                >
                  Data Management
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Settings Content */}
        <div className="card flex-1">
          {activeSection === "profile" && (
            <>
              <div className="card-header">
                <h2 className="card-title">Profile Settings</h2>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
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
                  <div className="form-group">
                    <label className="form-label">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold">
                        SP
                      </div>
                      <button className="btn btn-outline">Change Picture</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary" onClick={handleSaveProfile}>
                  <FiSave />
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeSection === "account" && (
            <>
              <div className="card-header">
                <h2 className="card-title">Account Settings</h2>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-group">
                    <label className="form-label">Change Password</label>
                    <input type="password" className="form-input mb-2" placeholder="Current Password" />
                    <input type="password" className="form-input mb-2" placeholder="New Password" />
                    <input type="password" className="form-input" placeholder="Confirm New Password" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Two-Factor Authentication</label>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="twoFactor" />
                      <label htmlFor="twoFactor">Enable two-factor authentication</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Connected Accounts</label>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Google</span>
                        <button className="btn btn-outline btn-sm">Connect</button>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Facebook</span>
                        <button className="btn btn-outline btn-sm">Connect</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary">
                  <FiSave />
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeSection === "preferences" && (
            <>
              <div className="card-header">
                <h2 className="card-title">Preferences</h2>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-group">
                    <label className="form-label">Theme</label>
                    <select
                      className="form-select"
                      value={preferencesData.theme}
                      onChange={(e) => setPreferencesData({ ...preferencesData, theme: e.target.value })}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="System Default">System Default</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select
                      className="form-select"
                      value={preferencesData.language}
                      onChange={(e) => setPreferencesData({ ...preferencesData, language: e.target.value })}
                    >
                      <option value="en">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Bengali">Bengali</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Format</label>
                    <select
                      className="form-select"
                      value={preferencesData.date_format}
                      onChange={(e) => setPreferencesData({ ...preferencesData, date_format: e.target.value })}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start of Week</label>
                    <select
                      className="form-select"
                      value={preferencesData.start_of_week}
                      onChange={(e) => setPreferencesData({ ...preferencesData, start_of_week: e.target.value })}
                    >
                      <option value="Monday">Monday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary" onClick={handleSavePreferences}>
                  <FiSave />
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeSection === "notifications" && (
            <>
              <div className="card-header">
                <h2 className="card-title">Notification Settings</h2>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Email Notifications</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="emailBudget"
                          checked={notificationsData.email_notifications}
                          onChange={(e) =>
                            setNotificationsData({ ...notificationsData, email_notifications: e.target.checked })
                          }
                        />
                        <label htmlFor="emailBudget">Budget alerts</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="emailReport"
                          checked={notificationsData.email_notifications}
                          onChange={(e) =>
                            setNotificationsData({ ...notificationsData, email_notifications: e.target.checked })
                          }
                        />
                        <label htmlFor="emailReport">Monthly reports</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="emailTips"
                          checked={notificationsData.email_notifications}
                          onChange={(e) =>
                            setNotificationsData({ ...notificationsData, email_notifications: e.target.checked })
                          }
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
                          onChange={(e) =>
                            setNotificationsData({ ...notificationsData, push_notifications: e.target.checked })
                          }
                        />
                        <label htmlFor="pushTransaction">New transactions</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="pushBudget"
                          checked={notificationsData.push_notifications}
                          onChange={(e) =>
                            setNotificationsData({ ...notificationsData, push_notifications: e.target.checked })
                          }
                        />
                        <label htmlFor="pushBudget">Budget alerts</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="pushBill"
                          checked={notificationsData.push_notifications}
                          onChange={(e) =>
                            setNotificationsData({ ...notificationsData, push_notifications: e.target.checked })
                          }
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
              <div className="card-footer">
                <button className="btn btn-primary" onClick={handleSaveNotifications}>
                  <FiSave />
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeSection === "data" && (
            <>
              <div className="card-header">
                <h2 className="card-title">Data Management</h2>
              </div>
              <div className="card-content">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Data Backup</h3>
                    <p className="text-sm text-muted mb-3">Create and manage backups of your data</p>
                    <div className="flex gap-2">
                      <button className="btn btn-primary">Create Backup</button>
                      <button className="btn btn-outline">Restore Backup</button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-expense">Danger Zone</h3>
                    <p className="text-sm text-muted mb-3">Permanently delete your account and all associated data</p>
                    <button
                      className="btn btn-outline"
                      style={{ borderColor: "var(--expense-color)", color: "var(--expense-color)" }}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}