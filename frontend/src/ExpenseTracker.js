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

  useEffect(() => {
    document.title = "Traxpense - Personal Finance Tracker"
  }, [])

  // Function to render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />
      case "transactions":
        return <TransactionsTab />
      case "categories":
        return <CategoriesTab />
      case "budgets":
        return <BudgetsTab />
      case "reports":
        return <ReportsTab />
      case "calendar":
        return <CalendarTab />
      case "settings":
        return <SettingsTab />
      default:
        return <DashboardTab />
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
            <button className="add-expense-button">
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
