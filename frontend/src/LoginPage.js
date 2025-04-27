"use client"

import { useState } from "react"
import { FiDollarSign, FiMail, FiLock, FiUser, FiAlertCircle } from "react-icons/fi"
import api from "./services/api"
import "./LoginPage.css"

export default function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      let response
      if (isLogin) {
        response = await api.post("/auth/login", { email, password })
      } else {
        response = await api.post("/auth/register", { email, password, name })
      }

      const { access_token } = response.data
      localStorage.setItem("token", access_token) // Save token to localStorage
      onLogin(access_token) // Pass token to App component
    } catch (error) {
      console.error("Auth error:", error)
      setError(error.response?.data?.msg || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <FiDollarSign className="login-logo-icon" />
            <h1 className="login-logo-text">Traxpense</h1>
          </div>
          <p className="login-subtitle">Your Personal Finance Tracker</p>
        </div>

        <div className="login-tabs">
          <button className={`login-tab ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={`login-tab ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>

        {error && (
          <div className="error-message">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">
                <FiUser className="input-icon" />
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <FiMail className="input-icon" />
              Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiLock className="input-icon" />
              Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isLogin && (
            <div className="forgot-password">
              <a href="#reset">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="text-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
