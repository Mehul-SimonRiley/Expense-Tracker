"use client"

import { useState, useEffect } from "react"
import { FiBarChart2, FiDownload, FiPieChart, FiTrendingUp } from "react-icons/fi"
import { 
  getExpenseVsIncome, 
  getCategoryBreakdown, 
  getSpendingTrends 
} from '../services/reportsService';

export default function ReportsTab() {
  const [reportType, setReportType] = useState("expense-income")
  const [timeRange, setTimeRange] = useState("month")
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        let data;
        if (reportType === "expense-income") {
          data = await getExpenseVsIncome(timeRange);
        } else if (reportType === "category-breakdown") {
          data = await getCategoryBreakdown(timeRange);
        } else if (reportType === "spending-trends") {
          data = await getSpendingTrends(timeRange);
        }
        setReportData(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError(err.message || "Failed to load report data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, timeRange]);

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
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
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
                        <div className="text-xl font-bold text-income">₹{reportData.totalIncome}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted">Total Expenses</div>
                        <div className="text-xl font-bold text-expense">₹{reportData.totalExpenses}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted">Net Savings</div>
                        <div className="text-xl font-bold">₹{reportData.netSavings}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted">Savings Rate</div>
                        <div className="text-xl font-bold">{reportData.savingsRate}%</div>
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
                        {(reportData.monthlyComparison || []).map((month) => (
                          <tr key={month.name}>
                            <td>{month.name}</td>
                            <td className="text-income">₹{month.income}</td>
                            <td className="text-expense">₹{month.expenses}</td>
                            <td>₹{month.savings}</td>
                          </tr>
                        ))}
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
                        {(reportData.topCategories || []).map((category) => (
                          <tr key={category.name}>
                            <td>{category.name}</td>
                            <td className="text-expense">₹{category.amount}</td>
                            <td>{category.percentage}%</td>
                          </tr>
                        ))}
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
                        {(reportData.monthlySpending || []).map((month) => (
                          <tr key={month.name}>
                            <td>{month.name}</td>
                            <td className="text-expense">₹{month.amount}</td>
                            <td>{month.change}</td>
                          </tr>
                        ))}
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
                        {(reportData.categoryTrends || []).map((trend) => (
                          <tr key={trend.category}>
                            <td>{trend.category}</td>
                            <td>₹{trend.thisMonth}</td>
                            <td>₹{trend.lastMonth}</td>
                            <td>{trend.change}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
