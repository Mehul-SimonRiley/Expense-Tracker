"use client"

import { useState } from "react"
import { FiSave } from "react-icons/fi"

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState("profile")
  const [currency, setCurrency] = useState("INR")
  const [currencyDisplay, setCurrencyDisplay] = useState("₹1,234.56")
  const [decimalSeparator, setDecimalSeparator] = useState("period")
  const [thousandsSeparator, setThousandsSeparator] = useState("comma")

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
                  className={`w-full text-left px-4 py-3 ${activeSection === "currency" ? "bg-primary text-white" : ""}`}
                  onClick={() => setActiveSection("currency")}
                >
                  Currency
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
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${activeSection === "import" ? "bg-primary text-white" : ""}`}
                  onClick={() => setActiveSection("import")}
                >
                  Import/Export
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
                    <input type="text" className="form-input" defaultValue="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-input" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                        JD
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
                    <select className="form-select">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System Default</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select className="form-select">
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Tamil</option>
                      <option>Telugu</option>
                      <option>Bengali</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Format</label>
                    <select className="form-select">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start of Week</label>
                    <select className="form-select">
                      <option>Monday</option>
                      <option>Sunday</option>
                    </select>
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
                        <input type="checkbox" id="emailBudget" defaultChecked />
                        <label htmlFor="emailBudget">Budget alerts</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="emailReport" defaultChecked />
                        <label htmlFor="emailReport">Monthly reports</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="emailTips" />
                        <label htmlFor="emailTips">Saving tips and recommendations</label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Push Notifications</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="pushTransaction" defaultChecked />
                        <label htmlFor="pushTransaction">New transactions</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="pushBudget" defaultChecked />
                        <label htmlFor="pushBudget">Budget alerts</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="pushBill" defaultChecked />
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
                <button className="btn btn-primary">
                  <FiSave />
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeSection === "currency" && (
            <>
              <div className="card-header">
                <h2 className="card-title">Currency Settings</h2>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-group">
                    <label className="form-label">Primary Currency</label>
                    <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Currency Display</label>
                    <select
                      className="form-select"
                      value={currencyDisplay}
                      onChange={(e) => setCurrencyDisplay(e.target.value)}
                    >
                      <option value="₹1,234.56">₹1,234.56</option>
                      <option value="1,234.56 ₹">1,234.56 ₹</option>
                      <option value="₹ 1,234.56">₹ 1,234.56</option>
                      <option value="1,234.56 INR">1,234.56 INR</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Decimal Separator</label>
                    <select
                      className="form-select"
                      value={decimalSeparator}
                      onChange={(e) => setDecimalSeparator(e.target.value)}
                    >
                      <option value="period">Period (.)</option>
                      <option value="comma">Comma (,)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thousands Separator</label>
                    <select
                      className="form-select"
                      value={thousandsSeparator}
                      onChange={(e) => setThousandsSeparator(e.target.value)}
                    >
                      <option value="comma">Comma (,)</option>
                      <option value="period">Period (.)</option>
                      <option value="space">Space ( )</option>
                      <option value="none">None</option>
                    </select>
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

          {activeSection === "import" && (
            <>
              <div className="card-header">
                <h2 className="card-title">Import & Export</h2>
              </div>
              <div className="card-content">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Export Data</h3>
                    <p className="text-sm text-muted mb-3">Download your financial data in various formats</p>
                    <div className="flex gap-2">
                      <button className="btn btn-outline">Export as CSV</button>
                      <button className="btn btn-outline">Export as PDF</button>
                      <button className="btn btn-outline">Export as Excel</button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Import Data</h3>
                    <p className="text-sm text-muted mb-3">Import transactions from other sources</p>
                    <div className="space-y-4">
                      <div className="form-group">
                        <label className="form-label">Import from File</label>
                        <div className="flex gap-2">
                          <input type="file" className="form-input" />
                          <button className="btn btn-primary">Upload</button>
                        </div>
                        <p className="text-xs text-muted mt-1">Supported formats: CSV, Excel</p>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Import from Bank</label>
                        <select className="form-select mb-2">
                          <option>Select your bank</option>
                          <option>HDFC Bank</option>
                          <option>ICICI Bank</option>
                          <option>SBI</option>
                          <option>Axis Bank</option>
                          <option>Other</option>
                        </select>
                        <button className="btn btn-outline">Connect Bank Account</button>
                      </div>
                    </div>
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
