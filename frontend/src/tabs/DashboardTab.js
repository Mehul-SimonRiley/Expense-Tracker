"use client"

import { useState } from "react"
import { FiBarChart2, FiCreditCard, FiDownload, FiPieChart, FiPlus } from "react-icons/fi"

export default function DashboardTab() {
  const [timeframe, setTimeframe] = useState("month")
  const [chartView, setChartView] = useState("monthly")

  // Sample data - in a real app, this would come from your API
  const summaryData = {
    totalExpenses: "₹2,845.65",
    totalIncome: "₹4,350.00",
    currentBalance: "₹1,504.35",
    savings: "₹573.00",
    expenseChange: "+12.3%",
    incomeChange: "0%",
    balanceChange: "-8.4%",
    savingsPercent: "13.2%",
  }

  const budgetData = [
    { category: "Groceries", current: 350, total: 500, percentage: 70 },
    { category: "Dining Out", current: 280, total: 300, percentage: 93 },
    { category: "Transportation", current: 120, total: 200, percentage: 60 },
    { category: "Entertainment", current: 175, total: 150, percentage: 117 },
  ]

  const recentTransactions = [
    { id: 1, description: "Grocery Store", date: "Mar 18, 2025", category: "Food", amount: -86.42, type: "expense" },
    { id: 2, description: "Salary Deposit", date: "Mar 15, 2025", category: "Income", amount: 2175.0, type: "income" },
    { id: 3, description: "Restaurant", date: "Mar 14, 2025", category: "Dining", amount: -42.5, type: "expense" },
  ]

  const categoryBreakdown = [
    { category: "Housing", percentage: 35, color: "var(--housing-color)" },
    { category: "Food", percentage: 25, color: "var(--food-color)" },
    { category: "Transportation", percentage: 15, color: "var(--transportation-color)" },
    { category: "Entertainment", percentage: 10, color: "var(--entertainment-color)" },
    { category: "Others", percentage: 15, color: "var(--others-color)" },
  ]

  return (
    <div className="dashboard-grid">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Expense Dashboard</h1>
        <div className="flex gap-2">
          <select
            className="form-select"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{ width: "180px" }}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-outline btn-sm">
            <FiDownload />
            <span className="sr-only">Download Report</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-4">Total Expenses</div>
            <div className="text-2xl font-bold text-expense">{summaryData.totalExpenses}</div>
            <p className="text-xs text-muted">{summaryData.expenseChange} from last month</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-4">Total Income</div>
            <div className="text-2xl font-bold text-income">{summaryData.totalIncome}</div>
            <p className="text-xs text-muted">Same as last month</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-4">Current Balance</div>
            <div className="text-2xl font-bold">{summaryData.currentBalance}</div>
            <p className="text-xs text-muted">{summaryData.balanceChange} from last month</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-4">Savings</div>
            <div className="text-2xl font-bold" style={{ color: "var(--savings-color)" }}>
              {summaryData.savings}
            </div>
            <p className="text-xs text-muted">{summaryData.savingsPercent} of income</p>
          </div>
        </div>
      </div>

      {/* Expense Breakdown and Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h2 className="card-title">Expense Breakdown</h2>
            <div className="flex border rounded-md overflow-hidden">
              <button
                className={`btn ${chartView === "weekly" ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setChartView("weekly")}
              >
                Weekly
              </button>
              <button
                className={`btn ${chartView === "monthly" ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setChartView("monthly")}
              >
                Monthly
              </button>
              <button
                className={`btn ${chartView === "yearly" ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setChartView("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="card-content">
            <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiBarChart2 style={{ width: "40px", height: "40px", color: "var(--text-muted)" }} />
              <p style={{ marginLeft: "10px" }}>Expense chart will appear here</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Budget Status</h2>
          </div>
          <div className="card-content">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {budgetData.map((budget, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{budget.category}</span>
                    <span className="text-sm font-medium">
                      ₹{budget.current}/₹{budget.total}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      backgroundColor: "var(--border-color)",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${budget.percentage}%`,
                        height: "100%",
                        backgroundColor: budget.percentage > 100 ? "var(--expense-color)" : "var(--primary-color)",
                        borderRadius: "9999px",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions and Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h2 className="card-title">Recent Transactions</h2>
            <button className="btn btn-outline btn-sm">View All</button>
          </div>
          <div className="card-content">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-4">
                  <div
                    style={{
                      borderRadius: "9999px",
                      backgroundColor:
                        transaction.type === "expense" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                      padding: "0.5rem",
                    }}
                  >
                    <FiCreditCard
                      style={{
                        width: "1.25rem",
                        height: "1.25rem",
                        color: transaction.type === "expense" ? "var(--expense-color)" : "var(--income-color)",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted">
                      {transaction.date} • {transaction.category}
                    </p>
                  </div>
                  <div
                    className={transaction.type === "expense" ? "text-expense font-medium" : "text-income font-medium"}
                  >
                    {transaction.type === "expense" ? "-" : "+"}₹{Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" style={{ width: "100%" }}>
              <FiPlus style={{ width: "1rem", height: "1rem" }} />
              Add New Transaction
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Expense by Category</h2>
          </div>
          <div className="card-content">
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiPieChart style={{ width: "40px", height: "40px", color: "var(--text-muted)" }} />
            </div>
            <div style={{ marginTop: "1rem" }}>
              {categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: category.color,
                      marginRight: "8px",
                    }}
                  ></div>
                  <span className="text-sm">
                    {category.category} - {category.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
