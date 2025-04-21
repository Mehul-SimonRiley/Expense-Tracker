"use client"

import { useState } from "react"
import ExpenseTracker from "./ExpenseTracker"
import LoginPage from "./LoginPage"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  return <div className="App">{isLoggedIn ? <ExpenseTracker /> : <LoginPage onLogin={handleLogin} />}</div>
}

export default App
