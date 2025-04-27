"use client"

import { useState, useEffect } from "react"
import ExpenseTracker from "./ExpenseTracker"
import LoginPage from "./LoginPage"
import api from "./services/api"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsLoggedIn(false)
        setIsLoading(false)
        return
      }

      try {
        await api.get("/auth/profile")
        setIsLoggedIn(true)
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          setIsLoggedIn(false)
        }
      } finally {
        setIsLoading(false)
      }
    }

    validateToken()
  }, [])

  const handleLogin = (token) => {
    localStorage.setItem("token", token)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  }

  return (
    <div className="App">
      {isLoggedIn ? (
        <ExpenseTracker onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
