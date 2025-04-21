"use client"

import { useState } from "react"
import { FiBarChart2, FiDownload, FiPieChart, FiTrendingUp } from "react-icons/fi"

export default function ReportsTab() {
  const [reportType, setReportType] = useState("expense-income")
  const [timeRange, setTimeRange] = useState("month")

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Financial Reports</h1>
        <div className="flex gap-2">
          <select
            className="form-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ width: "180px" }}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="btn btn-outline">
            <FiDownload />
            Export
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="card mb-6">
        <div className="card-content">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              className={`btn ${reportType === "expense-income" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setReportType("expense-income")}
            >
              <FiBarChart2 />
              Expense vs Income
            </button>
            <button
              className={`btn ${reportType === "category-breakdown" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setReportType("category-breakdown")}
            >
              <FiPieChart />
              Category Breakdown
            </button>
            <button
              className={`btn ${reportType === "spending-trends" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setReportType("spending-trends")}
            >
              <FiTrendingUp />
              Spending Trends
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {reportType === "expense-income" && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Expense vs Income</h2>
          </div>
          <div className="card-content">
            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiBarChart2 style={{ width: "60px", height: "60px", color: "var(--text-muted)" }} />
              <p style={{ marginLeft: "10px" }}>Expense vs Income chart will appear here</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted">Total Income</div>
                    <div className="text-xl font-bold text-income">₹4,350.00</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted">Total Expenses</div>
                    <div className="text-xl font-bold text-expense">₹2,845.65</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted">Net Savings</div>
                    <div className="text-xl font-bold">₹1,504.35</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted">Savings Rate</div>
                    <div className="text-xl font-bold">34.6%</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Monthly Comparison</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Expenses</th>
                      <th>Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>January</td>
                      <td className="text-income">₹4,200.00</td>
                      <td className="text-expense">₹3,100.25</td>
                      <td>₹1,099.75</td>
                    </tr>
                    <tr>
                      <td>February</td>
                      <td className="text-income">₹4,200.00</td>
                      <td className="text-expense">₹2,950.40</td>
                      <td>₹1,249.60</td>
                    </tr>
                    <tr>
                      <td>March</td>
                      <td className="text-income">₹4,350.00</td>
                      <td className="text-expense">₹2,845.65</td>
                      <td>₹1,504.35</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === "category-breakdown" && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Category Breakdown</h2>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FiPieChart style={{ width: "60px", height: "60px", color: "var(--text-muted)" }} />
                  <p style={{ marginLeft: "10px" }}>Category breakdown chart will appear here</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Top Spending Categories</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Housing</td>
                      <td className="text-expense">₹1,200.00</td>
                      <td>42.2%</td>
                    </tr>
                    <tr>
                      <td>Food</td>
                      <td className="text-expense">₹450.75</td>
                      <td>15.8%</td>
                    </tr>
                    <tr>
                      <td>Utilities</td>
                      <td className="text-expense">₹325.40</td>
                      <td>11.4%</td>
                    </tr>
                    <tr>
                      <td>Transportation</td>
                      <td className="text-expense">₹280.50</td>
                      <td>9.9%</td>
                    </tr>
                    <tr>
                      <td>Entertainment</td>
                      <td className="text-expense">₹210.00</td>
                      <td>7.4%</td>
                    </tr>
                    <tr>
                      <td>Others</td>
                      <td className="text-expense">₹379.00</td>
                      <td>13.3%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === "spending-trends" && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Spending Trends</h2>
          </div>
          <div className="card-content">
            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiTrendingUp style={{ width: "60px", height: "60px", color: "var(--text-muted)" }} />
              <p style={{ marginLeft: "10px" }}>Spending trends chart will appear here</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Monthly Spending</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Amount</th>
                      <th>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>January</td>
                      <td className="text-expense">₹3,100.25</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>February</td>
                      <td className="text-expense">₹2,950.40</td>
                      <td className="text-income">-4.8%</td>
                    </tr>
                    <tr>
                      <td>March</td>
                      <td className="text-expense">₹2,845.65</td>
                      <td className="text-income">-3.6%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Category Trends</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>This Month</th>
                      <th>Last Month</th>
                      <th>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Housing</td>
                      <td>₹1,200.00</td>
                      <td>₹1,200.00</td>
                      <td>0%</td>
                    </tr>
                    <tr>
                      <td>Food</td>
                      <td>₹450.75</td>
                      <td>₹485.40</td>
                      <td className="text-income">-7.1%</td>
                    </tr>
                    <tr>
                      <td>Utilities</td>
                      <td>₹325.40</td>
                      <td>₹310.00</td>
                      <td className="text-expense">+5.0%</td>
                    </tr>
                    <tr>
                      <td>Transportation</td>
                      <td>₹280.50</td>
                      <td>₹305.00</td>
                      <td className="text-income">-8.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
