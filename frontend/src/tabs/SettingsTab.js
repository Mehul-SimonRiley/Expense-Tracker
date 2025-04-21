"use client"

import { useState } from "react"
import { FiSave } from "react-icons/fi"

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState("profile")

  return (
    <div>
      <h1 className="page-title">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="card">
          <div className="card-content p-0">
            <ul className="divide-y">
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${activeSection === "profile" ? "bg-primary text-white" : ""}`}
                  onClick={() => setActiveSection("profile")}
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${activeSection === "account" ? "bg-primary text-white" : ""}`}
                  onClick={() => setActiveSection("account")}
                >
                  Account
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${activeSection === "preferences" ? "bg-primary text-white" : ""}`}
                  onClick={() => setActiveSection("preferences")}
                >
                  Preferences
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${activeSection === "notifications" ? "bg-primary text-white" : ""}`}
                  onClick={() => setActiveSection("notifications")}
                >
                  Notifications
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${activeSection === "data" ? "bg-primary text-white" : ""}`}
                  onClick={() => setActiveSection("data")}
                >
                  Data Management
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Settings Content */}
        <div className="card md:col-span-3">
          {activeSection === "profile" && (
            <>
              <div className="card-header">
                <h2 className="card-title">Profile Settings</h2>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" defaultValue="Shashank Prasad" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" defaultValue="sp@123" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-input" defaultValue="123456789" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                        SP
                      </div>
                      <button className="btn btn-outline">Change Picture</button>
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

          {/* Other sections remain unchanged */}
        </div>
      </div>
    </div>
  )
}