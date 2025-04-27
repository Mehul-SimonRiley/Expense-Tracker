"use client"

import { useState, useEffect } from "react"
import { FiEdit2, FiPlus, FiX } from "react-icons/fi"
import { budgetsAPI, categoriesAPI } from "../services/api"

export default function BudgetsTab() {
  const [timeframe, setTimeframe] = useState("month")
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [newBudget, setNewBudget] = useState({
    category_id: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7) // YYYY-MM format
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch categories for dropdown
        const categoriesData = await categoriesAPI.getAll()
        setCategories(categoriesData || [])

        // Fetch budgets
        const budgetsData = await budgetsAPI.getAll()
        setBudgets(budgetsData || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message || "Failed to load data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddBudget = async () => {
    try {
      await budgetsAPI.create(newBudget)
      setNewBudget({
        category_id: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7)
      })
      setShowAddForm(false)
      // Refresh budgets list
      const budgetsData = await budgetsAPI.getAll()
      setBudgets(budgetsData || [])
    } catch (err) {
      console.error("Error adding budget:", err)
      alert("Failed to add budget. Please try again.")
    }
  }

  const handleEditBudget = async () => {
    if (!editingBudget) return

    try {
      await budgetsAPI.update(editingBudget.id, editingBudget)
      setEditingBudget(null)
      // Refresh budgets list
      const budgetsData = await budgetsAPI.getAll()
      setBudgets(budgetsData || [])
    } catch (err) {
      console.error("Error updating budget:", err)
      alert("Failed to update budget. Please try again.")
    }
  }

  const handleDeleteBudget = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await budgetsAPI.delete(id)
        // Refresh budgets list
        const budgetsData = await budgetsAPI.getAll()
        setBudgets(budgetsData || [])
      } catch (err) {
        console.error("Error deleting budget:", err)
        alert("Failed to delete budget. Please try again.")
      }
    }
  }

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
          <p className="mt-4">Loading budgets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

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
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <FiPlus />
            Set Budget
          </button>
        </div>
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">Add New Budget</h2>
            <button className="btn btn-outline btn-sm" onClick={() => setShowAddForm(false)}>
              <FiX />
            </button>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newBudget.category_id}
                  onChange={(e) => setNewBudget({ ...newBudget, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Month</label>
                <input
                  type="month"
                  className="form-input"
                  value={newBudget.month}
                  onChange={(e) => setNewBudget({ ...newBudget, month: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddBudget}>
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Budget Form */}
      {editingBudget && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">Edit Budget</h2>
            <button className="btn btn-outline btn-sm" onClick={() => setEditingBudget(null)}>
              <FiX />
            </button>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={editingBudget.category_id}
                  onChange={(e) => setEditingBudget({ ...editingBudget, category_id: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingBudget.amount}
                  onChange={(e) => setEditingBudget({ ...editingBudget, amount: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Month</label>
                <input
                  type="month"
                  className="form-input"
                  value={editingBudget.month}
                  onChange={(e) => setEditingBudget({ ...editingBudget, month: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline" onClick={() => setEditingBudget(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditBudget}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Total Budget</div>
            <div className="text-xl font-bold">
              {formatCurrency(budgets.reduce((sum, budget) => sum + Number(budget.amount), 0))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Total Spent</div>
            <div className="text-xl font-bold text-expense">
              {formatCurrency(budgets.reduce((sum, budget) => sum + Number(budget.current_spending || 0), 0))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Remaining</div>
            <div className="text-xl font-bold text-income">
              {formatCurrency(
                budgets.reduce((sum, budget) => sum + Number(budget.amount), 0) -
                budgets.reduce((sum, budget) => sum + Number(budget.current_spending || 0), 0)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Overall Budget Progress</h2>
          <div className="text-sm font-medium">
            {Math.round(
              (budgets.reduce((sum, budget) => sum + Number(budget.current_spending || 0), 0) /
                budgets.reduce((sum, budget) => sum + Number(budget.amount), 0)) *
                100 || 0
            )}
            % Used
          </div>
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
              style={{
                width: `${Math.min(
                  (budgets.reduce((sum, budget) => sum + Number(budget.current_spending || 0), 0) /
                    budgets.reduce((sum, budget) => sum + Number(budget.amount), 0)) *
                    100 || 0,
                  100
                )}%`,
                height: "100%",
                backgroundColor: "var(--primary-color)",
                borderRadius: "9999px",
              }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-muted">
            <div>₹0</div>
            <div>{formatCurrency(budgets.reduce((sum, budget) => sum + Number(budget.amount), 0))}</div>
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
              {budgets.map((budget) => (
                <tr key={budget.id}>
                  <td>{budget.category_name}</td>
                  <td>{formatCurrency(budget.amount)}</td>
                  <td>{formatCurrency(budget.current_spending || 0)}</td>
                  <td className={budget.amount - (budget.current_spending || 0) < 0 ? "text-expense" : "text-income"}>
                    {formatCurrency(budget.amount - (budget.current_spending || 0))}
                  </td>
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
                          width: `${Math.min(
                            ((budget.current_spending || 0) / budget.amount) * 100 || 0,
                            100
                          )}%`,
                          height: "100%",
                          backgroundColor:
                            (budget.current_spending || 0) > budget.amount
                              ? "var(--expense-color)"
                              : "var(--primary-color)",
                          borderRadius: "9999px",
                        }}
                      ></div>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setEditingBudget(budget)}
                      >
                        <FiEdit2 size={14} />
                        Edit
                      </button>
                      <button
                        className="btn btn-outline btn-sm text-red-500"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        <FiX size={14} />
                        Delete
                      </button>
                    </div>
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
