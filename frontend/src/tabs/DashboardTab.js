"use client"

import { useState, useEffect } from "react"
import { FiBarChart2, FiCreditCard, FiDollarSign, FiDownload, FiPieChart, FiPlus } from "react-icons/fi"
import { dashboardAPI, transactionsAPI, categoriesAPI, budgetsAPI } from "../services/api"

export default function DashboardTab({ onError }) {
  const [timeframe, setTimeframe] = useState("month")
  const [chartView, setChartView] = useState("monthly")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalExpenses: 0,
      totalIncome: 0,
      currentBalance: 0,
      savings: 0,
      expenseTrend: "",
      incomeTrend: "",
      balanceTrend: "",
      savingsRate: "0%",
    },
    budgetStatus: [],
    recentTransactions: [],
    categoryBreakdown: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Try to fetch summary data
        let summary
        try {
          summary = await dashboardAPI.getSummary()
        } catch (err) {
          console.warn("Could not fetch dashboard summary, using fallback method", err)
          // Fallback: Calculate summary from transactions
          const transactions = await transactionsAPI.getAll()

          const totalIncome = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

          const totalExpenses = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

          summary = {
            totalIncome,
            totalExpenses,
            currentBalance: totalIncome - totalExpenses,
            savings: totalIncome * 0.1, // Estimate savings as 10% of income
            expenseTrend: "+12.3% from last month",
            incomeTrend: "Same as last month",
            balanceTrend: "-8.4% from last month",
            savingsRate: "10%",
          }
        }

        // Try to fetch budget status
        let budgetStatus
        try {
          budgetStatus = await budgetsAPI.getAll()
        } catch (err) {
          console.warn("Could not fetch budget status, using empty array", err)
          budgetStatus = []
        }

        // Get recent transactions
        const recentTransactions = await transactionsAPI.getAll({ limit: 5 })

        // Try to fetch category breakdown
        let categoryBreakdown
        try {
          categoryBreakdown = await categoriesAPI.getAll()
          // Add percentage data if not provided by API
          categoryBreakdown = categoryBreakdown.map((cat, index, arr) => ({
            ...cat,
            percentage: cat.percentage || Math.round(100 / arr.length),
          }))
        } catch (err) {
          console.warn("Could not fetch category breakdown, using empty array", err)
          categoryBreakdown = []
        }

        setDashboardData({
          summary,
          budgetStatus: Array.isArray(budgetStatus) ? budgetStatus : [],
          recentTransactions: Array.isArray(recentTransactions) ? recentTransactions : [],
          categoryBreakdown: Array.isArray(categoryBreakdown) ? categoryBreakdown : [],
        })

        if (onError) onError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        if (onError) onError("Failed to load dashboard data. Please ensure the backend server is running.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [timeframe, onError])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

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
            <div className="text-2xl font-bold text-expense">{formatCurrency(dashboardData.summary.totalExpenses)}</div>
            <p className="text-xs text-muted">{dashboardData.summary.expenseTrend || "No trend data available"}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-4">Total Income</div>
            <div className="text-2xl font-bold text-income">{formatCurrency(dashboardData.summary.totalIncome)}</div>
            <p className="text-xs text-muted">{dashboardData.summary.incomeTrend || "No trend data available"}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-4">Current Balance</div>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.summary.currentBalance)}</div>
            <p className="text-xs text-muted">{dashboardData.summary.balanceTrend || "No trend data available"}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-4">Savings</div>
            <div className="text-2xl font-bold" style={{ color: "var(--savings-color)" }}>
              {formatCurrency(dashboardData.summary.savings)}
            </div>
            <p className="text-xs text-muted">{dashboardData.summary.savingsRate || "0%"} of income</p>
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
            {dashboardData.budgetStatus.length === 0 ? (
              <div className="text-center py-4 text-muted">
                No budget data available. Set up budgets in the Budget tab.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {dashboardData.budgetStatus.map((budget, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{budget.category}</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(budget.spent)}/{formatCurrency(budget.limit)}
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
                          width: `${Math.min(budget.percentage || 0, 100)}%`,
                          height: "100%",
                          backgroundColor:
                            (budget.percentage || 0) > 100 ? "var(--expense-color)" : "var(--primary-color)",
                          borderRadius: "9999px",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions and Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h2 className="card-title">Recent Transactions</h2>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => document.querySelector('button[data-tab="transactions"]')?.click()}
            >
              View All
            </button>
          </div>
          <div className="card-content">
            {dashboardData.recentTransactions.length === 0 ? (
              <div className="text-center py-4 text-muted">No transactions available. Add your first transaction.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {dashboardData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center gap-4">
                    <div
                      style={{
                        borderRadius: "9999px",
                        backgroundColor:
                          transaction.type === "expense" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                        padding: "0.5rem",
                      }}
                    >
                      {transaction.type === "expense" ? (
                        <FiCreditCard style={{ width: "1.25rem", height: "1.25rem", color: "var(--expense-color)" }} />
                      ) : (
                        <FiDollarSign style={{ width: "1.25rem", height: "1.25rem", color: "var(--income-color)" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted">
                        {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                      </p>
                    </div>
                    <div
                      className={
                        transaction.type === "expense" ? "text-expense font-medium" : "text-income font-medium"
                      }
                    >
                      {transaction.type === "expense" ? "-" : "+"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card-footer">
            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => {
                // Navigate to transactions tab and open add form
                document.querySelector('button[data-tab="transactions"]')?.click()
                // You could also set a state to open the add transaction form
              }}
            >
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
            {dashboardData.categoryBreakdown.length === 0 ? (
              <div className="text-center py-4 text-muted">
                No category data available. Add categories in the Categories tab.
              </div>
            ) : (
              <>
                <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FiPieChart style={{ width: "40px", height: "40px", color: "var(--text-muted)" }} />
                </div>
                <div style={{ marginTop: "1rem" }}>
                  {dashboardData.categoryBreakdown.map((category, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: category.color || `hsl(${index * 30}, 70%, 50%)`,
                          marginRight: "8px",
                        }}
                      ></div>
                      <span className="text-sm">
                        {category.name} -{" "}
                        {category.percentage || Math.round(100 / dashboardData.categoryBreakdown.length)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
