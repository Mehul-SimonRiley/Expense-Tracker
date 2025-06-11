"use client"

import { useState, useEffect, useCallback } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
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
  FiLogOut,
} from "react-icons/fi"

// Import all tab components
import DashboardTab from "./tabs/DashboardTab"
import TransactionsTab from "./tabs/TransactionsTab"
import CategoriesTab from "./tabs/CategoriesTab"
import BudgetsTab from "./tabs/BudgetsTab"
import ReportsTab from "./tabs/ReportsTab"
import CalendarTab from "./tabs/CalendarTab"
import SettingsTab from "./tabs/SettingsTab"
import LoginPage from "./LoginPage"
import { authService } from "./services/auth"
import NotificationsDropdown from "./components/NotificationsDropdown"

export default function ExpenseTracker() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        if (!token || !storedUser) {
          setIsAuthenticated(false)
          setLoading(false)
          return
        }

        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
        setLoading(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
        setError("Authentication check failed. Please log in again.")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Update user data in localStorage when it changes
  useEffect(() => {
    if (user) {
      authService.updateUser(user)
    }
  }, [user])

  const handleLogin = useCallback((userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }, [])

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  const handleUserUpdate = useCallback((updatedUser) => {
    setUser(updatedUser)
  }, [])

  // Helper to get initials from name or email
  const getInitials = (user) => {
    if (!user) return ''
    if (user.name) {
      const names = user.name.trim().split(' ')
      if (names.length === 1) return names[0][0].toUpperCase()
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    if (user.email) return user.email[0].toUpperCase()
    return ''
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

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
        return <SettingsTab user={user} onError={setError} onUserUpdate={handleUserUpdate} />
      default:
        return <DashboardTab onError={setError} />
    }
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <div className="dashboard-container">
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
                  <NotificationsDropdown />
                  <button
                    className="avatar-button"
                    onClick={() => setActiveTab('settings')}
                    title="Profile Settings"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
                      {getInitials(user) || "U"}
                    </div>
                  </button>
                </div>
              </header>

              <div className="dashboard-content">
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
                    <button className="nav-item" onClick={handleLogout}>
                      <FiLogOut className="nav-icon" />
                      <span>Logout</span>
                    </button>
                  </nav>

                  <div className="add-expense-container">
                    <button
                      className="add-expense-button"
                      onClick={() => {
                        setActiveTab("transactions")
                      }}
                    >
                      <FiPlus className="button-icon" />
                      Add Expense
                    </button>
                  </div>
                </aside>

                <main className="main-content">
                  <div className="container mx-auto px-4 py-8">
                    {renderTabContent()}
                  </div>
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}
