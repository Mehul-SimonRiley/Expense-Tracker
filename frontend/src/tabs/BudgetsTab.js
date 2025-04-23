"use client"

import { useState, useEffect } from "react"
import { FiEdit2, FiPlus } from "react-icons/fi"
import budgetService from "../services/budgetService"

export default function BudgetsTab() {
  const [timeframe, setTimeframe] = useState("month")
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);
      try {
        const data = await budgetsAPI.getAll();
        setBudgets(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching budgets:", err);
        setError(err.message || "Failed to load budgets. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Budget Planner</h1>
        <div className="flex gap-2">
          <select
            className="form-select"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{ width: "180px" }}
          >
            <option value="month">This Month</option>
            <option value="next-month">Next Month</option>
            <option value="custom">Custom Period</option>
          </select>
          <button className="btn btn-primary">
            <FiPlus />
            Set Budget
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Total Budget</div>
            <div className="text-xl font-bold">₹3,500.00</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Total Spent</div>
            <div className="text-xl font-bold text-expense">₹2,650.00</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Remaining</div>
            <div className="text-xl font-bold text-income">₹850.00</div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Overall Budget Progress</h2>
          <div className="text-sm font-medium">76% Used</div>
        </div>
        <div className="card-content">
          <div
            style={{
              height: "24px",
              backgroundColor: "var(--border-color)",
              borderRadius: "9999px",
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{ width: "76%", height: "100%", backgroundColor: "var(--primary-color)", borderRadius: "9999px" }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-muted">
            <div>₹0</div>
            <div>₹3,500</div>
          </div>
        </div>
      </div>

      {/* Category Budgets */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Category Budgets</h2>
        </div>
        <div className="card-content" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget, index) => (
                <tr key={index}>
                  <td>{budget.category}</td>
                  <td>₹{budget.budget}</td>
                  <td>₹{budget.spent}</td>
                  <td className={budget.remaining < 0 ? "text-expense" : "text-income"}>₹{budget.remaining}</td>
                  <td>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        backgroundColor: "var(--border-color)",
                        borderRadius: "9999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(budget.percentage, 100)}%`,
                          height: "100%",
                          backgroundColor: budget.percentage > 100 ? "var(--expense-color)" : "var(--primary-color)",
                          borderRadius: "9999px",
                        }}
                      ></div>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm">
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
