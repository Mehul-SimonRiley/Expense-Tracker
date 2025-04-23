"use client"

import { useState, useEffect } from "react"
import "./ExpenseTracker.css"
import {
  FiBarChart,
  FiBell,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiHome,
  FiTrendingUp,
  FiMenu,
  FiPieChart,
  FiPlus,
  FiSearch,
  FiSettings,
} from "react-icons/fi"

// Import all tab components
import DashboardTab from "./tabs/DashboardTab"
import TransactionsTab from "./tabs/TransactionsTab"
import CategoriesTab from "./tabs/CategoriesTab"
import BudgetsTab from "./tabs/BudgetsTab"
import ReportsTab from "./tabs/ReportsTab"
import CalendarTab from "./tabs/CalendarTab"
import SettingsTab from "./tabs/SettingsTab"

export default function ExpenseTracker() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [error, setError] = useState(null)

  // Global error handler for API requests
  useEffect(() => {
    const handleGlobalErrors = (event) => {
      if (event.error && event.error.message && event.error.message.includes("API request failed")) {
        setError("Connection to backend failed. Please ensure the backend server is running.")
        console.error("API Error:", event.error)
      }
    }

    window.addEventListener("error", handleGlobalErrors)
    return () => window.removeEventListener("error", handleGlobalErrors)
  }, [])

  // Function to render the active tab content
  const renderTabContent = () => {
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <p className="mt-2">
            Please make sure your backend server is running at http://localhost:5000 and CORS is properly configured.
          </p>
          <button
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )
    }

    switch (activeTab) {
      case "dashboard":
        return <DashboardTab onError={setError} />
      case "transactions":
        return <TransactionsTab onError={setError} />
      case "categories":
        return <CategoriesTab onError={setError} />
      case "budgets":
        return <BudgetsTab onError={setError} />
      case "reports":
        return <ReportsTab onError={setError} />
      case "calendar":
        return <CalendarTab onError={setError} />
      case "settings":
        return <SettingsTab onError={setError} />
      default:
        return <DashboardTab onError={setError} />
    }
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <button className="menu-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FiMenu />
          <span className="sr-only">Toggle Menu</span>
        </button>
        <div className="logo">
          <FiDollarSign className="logo-icon" />
          <span className="logo-text">Traxpense</span>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input type="search" placeholder="Search transactions..." className="search-input" />
          </div>
          <button className="notification-button">
            <FiBell />
            <span className="notification-badge">2</span>
            <span className="sr-only">Notifications</span>
          </button>
          <div className="avatar">
            <span>JD</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FiHome className="nav-icon" />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${activeTab === "transactions" ? "active" : ""}`}
              onClick={() => setActiveTab("transactions")}
            >
              <FiCreditCard className="nav-icon" />
              <span>Transactions</span>
            </button>
            <button
              className={`nav-item ${activeTab === "categories" ? "active" : ""}`}
              onClick={() => setActiveTab("categories")}
            >
              <FiPieChart className="nav-icon" />
              <span>Categories</span>
            </button>
            <button
              className={`nav-item ${activeTab === "budgets" ? "active" : ""}`}
              onClick={() => setActiveTab("budgets")}
            >
              <FiBarChart className="nav-icon" />
              <span>Budgets</span>
            </button>
            <button
              className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
              onClick={() => setActiveTab("reports")}
            >
              <FiTrendingUp className="nav-icon" />
              <span>Reports</span>
            </button>
            <button
              className={`nav-item ${activeTab === "calendar" ? "active" : ""}`}
              onClick={() => setActiveTab("calendar")}
            >
              <FiCalendar className="nav-icon" />
              <span>Calendar</span>
            </button>
            <button
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <FiSettings className="nav-icon" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="add-expense-container">
            <button
              className="add-expense-button"
              onClick={() => {
                setActiveTab("transactions")
                // You could also set a state to open the add transaction form
              }}
            >
              <FiPlus className="button-icon" />
              Add Expense
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">{renderTabContent()}</main>
      </div>
    </div>
  )
}
