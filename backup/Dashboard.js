"use client"

import { useState } from "react"
import "./ExpenseTrackerDashboard.css"

// Import icons from react-icons instead of lucide-react
// You'll need to run: npm install react-icons
import { 
  FiBarChart, FiBell, FiCalendar, FiCreditCard, 
  FiDollarSign, FiDownload, FiHome, FiTrendingUp, // Changed FiLineChart to FiTrendingUp
  FiMenu, FiPieChart, FiPlus, FiSearch, FiSettings 
} from 'react-icons/fi'; // Removed FiWallet

export default function ExpenseTrackerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [timeframe, setTimeframe] = useState("month")
  const [chartView, setChartView] = useState("monthly")

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <button className="menu-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FiMenu />
          <span className="sr-only">Toggle Menu</span>
        </button>
        <div className="logo">
          <FiDollarSign className="logo-icon" /> {/* Changed from FiWallet */}
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
            <span>SP</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <nav className="sidebar-nav">
            <button className="nav-item active">
              <FiHome className="nav-icon" />
              <span>Dashboard</span>
            </button>
            <button className="nav-item">
              <FiCreditCard className="nav-icon" />
              <span>Transactions</span>
            </button>
            <button className="nav-item">
              <FiPieChart className="nav-icon" />
              <span>Categories</span>
            </button>
            <button className="nav-item">
              <FiBarChart className="nav-icon" />
              <span>Budgets</span>
            </button>
            <button className="nav-item">
              <FiTrendingUp className="nav-icon" />{/* Changed from FiLineChart */}
              <span>Reports</span>
            </button>
            <button className="nav-item">
              <FiCalendar className="nav-icon" />
              <span>Calendar</span>
            </button>
            <button className="nav-item">
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
        <main className="main-content">
          <div className="dashboard-grid">
            <div className="dashboard-header-row">
              <h1 className="page-title">Expense Dashboard</h1>
              <div className="dashboard-actions">
                <select className="timeframe-select" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
                <button className="icon-button">
                  <FiDownload />
                  <span className="sr-only">Download Report</span>
                </button>
              </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="summary-cards">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Total Expenses</h3>
                </div>
                <div className="card-content">
                  <div className="amount expense">$2,845.65</div>
                  <p className="trend">+12.3% from last month</p>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Total Income</h3>
                </div>
                <div className="card-content">
                  <div className="amount income">$4,350.00</div>
                  <p className="trend">Same as last month</p>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Current Balance</h3>
                </div>
                <div className="card-content">
                  <div className="amount">$1,504.35</div>
                  <p className="trend">-8.4% from last month</p>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Savings</h3>
                </div>
                <div className="card-content">
                  <div className="amount savings">$573.00</div>
                  <p className="trend">13.2% of income</p>
                </div>
              </div>
            </div>

            {/* Expense Breakdown and Budget */}
            <div className="charts-row">
              <div className="card expense-breakdown">
                <div className="card-header with-tabs">
                  <h3 className="card-title">Expense Breakdown</h3>
                  <div className="tabs">
                    <button
                      className={`tab ${chartView === "weekly" ? "active" : ""}`}
                      onClick={() => setChartView("weekly")}
                    >
                      Weekly
                    </button>
                    <button
                      className={`tab ${chartView === "monthly" ? "active" : ""}`}
                      onClick={() => setChartView("monthly")}
                    >
                      Monthly
                    </button>
                    <button
                      className={`tab ${chartView === "yearly" ? "active" : ""}`}
                      onClick={() => setChartView("yearly")}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="chart-placeholder">
                    <FiBarChart className="placeholder-icon" />
                    <p>Expense chart will appear here</p>
                  </div>
                </div>
              </div>
              <div className="card budget-status">
                <div className="card-header">
                  <h3 className="card-title">Budget Status</h3>
                  <p className="card-description">Monthly budget progress</p>
                </div>
                <div className="card-content">
                  <div className="budget-items">
                    <div className="budget-item">
                      <div className="budget-item-header">
                        <span className="budget-category">Groceries</span>
                        <span className="budget-amount">$350/$500</span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div className="budget-item">
                      <div className="budget-item-header">
                        <span className="budget-category">Dining Out</span>
                        <span className="budget-amount">$280/$300</span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: "93%" }}></div>
                      </div>
                    </div>
                    <div className="budget-item">
                      <div className="budget-item-header">
                        <span className="budget-category">Transportation</span>
                        <span className="budget-amount">$120/$200</span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                    <div className="budget-item">
                      <div className="budget-item-header">
                        <span className="budget-category">Entertainment</span>
                        <span className="budget-amount">$175/$150</span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar over-budget" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    <div className="budget-item">
                      <div className="budget-item-header">
                        <span className="budget-category">Utilities</span>
                        <span className="budget-amount">$210/$250</span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: "84%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions and Category Breakdown */}
            <div className="bottom-row">
              <div className="card transactions">
                <div className="card-header with-action">
                  <h3 className="card-title">Recent Transactions</h3>
                  <button className="text-button">View All</button>
                </div>
                <div className="card-content">
                  <div className="transactions-list">
                    <div className="transaction-item">
                      <div className="transaction-icon expense-icon">
                        <FiCreditCard />
                      </div>
                      <div className="transaction-details">
                        <p className="transaction-title">Grocery Store</p>
                        <p className="transaction-meta">Mar 18, 2025 • Food</p>
                      </div>
                      <div className="transaction-amount expense">-$86.42</div>
                    </div>
                    <div className="transaction-item">
                      <div className="transaction-icon income-icon">
                        <FiDollarSign />
                      </div>
                      <div className="transaction-details">
                        <p className="transaction-title">Salary Deposit</p>
                        <p className="transaction-meta">Mar 15, 2025 • Income</p>
                      </div>
                      <div className="transaction-amount income">+$2,175.00</div>
                    </div>
                    <div className="transaction-item">
                      <div className="transaction-icon expense-icon">
                        <FiCreditCard />
                      </div>
                      <div className="transaction-details">
                        <p className="transaction-title">Restaurant</p>
                        <p className="transaction-meta">Mar 14, 2025 • Dining</p>
                      </div>
                      <div className="transaction-amount expense">-$42.50</div>
                    </div>
                    <div className="transaction-item">
                      <div className="transaction-icon expense-icon">
                        <FiCreditCard />
                      </div>
                      <div className="transaction-details">
                        <p className="transaction-title">Gas Station</p>
                        <p className="transaction-meta">Mar 12, 2025 • Transportation</p>
                      </div>
                      <div className="transaction-amount expense">-$38.75</div>
                    </div>
                    <div className="transaction-item">
                      <div className="transaction-icon expense-icon">
                        <FiCreditCard />
                      </div>
                      <div className="transaction-details">
                        <p className="transaction-title">Electricity Bill</p>
                        <p className="transaction-meta">Mar 10, 2025 • Utilities</p>
                      </div>
                      <div className="transaction-amount expense">-$94.32</div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="add-transaction-button">
                    <FiPlus className="button-icon" />
                    Add New Transaction
                  </button>
                </div>
              </div>
              <div className="card category-breakdown">
                <div className="card-header">
                  <h3 className="card-title">Expense by Category</h3>
                  <p className="card-description">This month's breakdown</p>
                </div>
                <div className="card-content">
                  <div className="chart-placeholder">
                    <FiPieChart className="placeholder-icon" />
                    <p>Category chart will appear here</p>
                  </div>
                  <div className="category-legend">
                    <div className="legend-item">
                      <div className="legend-color housing"></div>
                      <span className="legend-text">Housing - 35%</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color food"></div>
                      <span className="legend-text">Food - 25%</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color transportation"></div>
                      <span className="legend-text">Transportation - 15%</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color entertainment"></div>
                      <span className="legend-text">Entertainment - 10%</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color others"></div>
                      <span className="legend-text">Others - 15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

