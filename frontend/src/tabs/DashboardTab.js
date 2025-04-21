"use client"

import { useState } from "react"
import { FiBarChart2, FiCreditCard, FiDollarSign, FiDownload, FiPieChart, FiPlus } from "react-icons/fi"

export default function DashboardTab() {
  const [timeframe, setTimeframe] = useState("month")
  const [chartView, setChartView] = useState("monthly")

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
            <div className="text-2xl font-bold text-expense">₹2,845.65</div>
            <p className="text-xs text-muted">+12.3% from last month</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-4">Total Income</div>
            <div className="text-2xl font-bold text-income">₹4,350.00</div>
            <p className="text-xs text-muted">Same as last month</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-4">Current Balance</div>
            <div className="text-2xl font-bold">₹1,504.35</div>
            <p className="text-xs text-muted">-8.4% from last month</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-4">Savings</div>
            <div className="text-2xl font-bold" style={{ color: "var(--savings-color)" }}>
              ₹573.00
            </div>
            <p className="text-xs text-muted">13.2% of income</p>
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
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Groceries</span>
                  <span className="text-sm font-medium">₹350/₹500</span>
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
                      width: "70%",
                      height: "100%",
                      backgroundColor: "var(--primary-color)",
                      borderRadius: "9999px",
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Dining Out</span>
                  <span className="text-sm font-medium">₹280/₹300</span>
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
                      width: "93%",
                      height: "100%",
                      backgroundColor: "var(--primary-color)",
                      borderRadius: "9999px",
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Transportation</span>
                  <span className="text-sm font-medium">₹120/₹200</span>
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
                      width: "60%",
                      height: "100%",
                      backgroundColor: "var(--primary-color)",
                      borderRadius: "9999px",
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Entertainment</span>
                  <span className="text-sm font-medium">₹175/₹150</span>
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
                      width: "100%",
                      height: "100%",
                      backgroundColor: "var(--expense-color)",
                      borderRadius: "9999px",
                    }}
                  ></div>
                </div>
              </div>
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
              <div className="flex items-center gap-4">
                <div style={{ borderRadius: "9999px", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.5rem" }}>
                  <FiCreditCard style={{ width: "1.25rem", height: "1.25rem", color: "var(--expense-color)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="text-sm font-medium">Grocery Store</p>
                  <p className="text-xs text-muted">Mar 18, 2025 • Food</p>
                </div>
                <div className="text-expense font-medium">-₹86.42</div>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ borderRadius: "9999px", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "0.5rem" }}>
                  <FiDollarSign style={{ width: "1.25rem", height: "1.25rem", color: "var(--income-color)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="text-sm font-medium">Salary Deposit</p>
                  <p className="text-xs text-muted">Mar 15, 2025 • Income</p>
                </div>
                <div className="text-income font-medium">+₹2,175.00</div>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ borderRadius: "9999px", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.5rem" }}>
                  <FiCreditCard style={{ width: "1.25rem", height: "1.25rem", color: "var(--expense-color)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="text-sm font-medium">Restaurant</p>
                  <p className="text-xs text-muted">Mar 14, 2025 • Dining</p>
                </div>
                <div className="text-expense font-medium">-₹42.50</div>
              </div>
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
              <div className="flex items-center mb-2">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "var(--housing-color)",
                    marginRight: "8px",
                  }}
                ></div>
                <span className="text-sm">Housing - 35%</span>
              </div>
              <div className="flex items-center mb-2">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "var(--food-color)",
                    marginRight: "8px",
                  }}
                ></div>
                <span className="text-sm">Food - 25%</span>
              </div>
              <div className="flex items-center mb-2">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "var(--transportation-color)",
                    marginRight: "8px",
                  }}
                ></div>
                <span className="text-sm">Transportation - 15%</span>
              </div>
              <div className="flex items-center mb-2">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "var(--entertainment-color)",
                    marginRight: "8px",
                  }}
                ></div>
                <span className="text-sm">Entertainment - 10%</span>
              </div>
              <div className="flex items-center">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "var(--others-color)",
                    marginRight: "8px",
                  }}
                ></div>
                <span className="text-sm">Others - 15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
