"use client"

import React, { useState, useEffect } from 'react'
import { FiEdit2, FiPlus, FiX } from "react-icons/fi"
import { budgetsAPI, categoriesAPI } from "../services/api"
import { formatCurrency } from '../utils/format'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion, AnimatePresence } from "framer-motion"

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
    fetchBudgets()
    fetchCategories()
  }, [])

  const fetchBudgets = async () => {
    try {
      setIsLoading(true)
      const data = await budgetsAPI.getAll()
      setBudgets(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error('Error fetching budgets:', err)
      setError('Failed to load budgets')
      setBudgets([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  }

  const handleAddBudget = async () => {
    // Validate fields
    if (!newBudget.category_id || !newBudget.amount || !newBudget.month) {
      alert('Please fill all fields before adding a budget.');
      return;
    }
    // Convert month to start_date and end_date
    const [year, month] = newBudget.month.split('-');
    const start_date = `${year}-${month}-01`;
    // Get last day of month
    const end_date = new Date(year, month, 0).toISOString().slice(0, 10);
    // Prepare payload for backend
    const payload = {
      category_id: newBudget.category_id,
      amount: newBudget.amount,
      start_date,
      end_date
    };
    console.log('Creating budget with:', payload);
    try {
      await budgetsAPI.create(payload)
      setNewBudget({
        category_id: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7)
      })
      setShowAddForm(false)
      // Refresh budgets list
      fetchBudgets()
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
      fetchBudgets()
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
        fetchBudgets()
      } catch (err) {
        console.error("Error deleting budget:", err)
        alert("Failed to delete budget. Please try again.")
      }
    }
  }

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <LoadingSpinner text="Loading budgets..." />
      </motion.div>
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

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const remaining = totalBudget - totalSpent

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
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

      {/* Budget Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow mb-6"
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Budget Summary</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Total Budget</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Total Spent</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Remaining</h3>
              <p className="text-2xl font-bold">{formatCurrency(remaining)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Budget Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow mb-6"
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Budget Progress</h2>
        </div>
        <div className="p-4">
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
                  (totalSpent / totalBudget) * 100 || 0,
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
            <div>{formatCurrency(totalBudget)}</div>
          </div>
        </div>
      </motion.div>

      {/* Budget Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow mb-6"
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Budget Categories</h2>
        </div>
        <div className="p-4">
          <AnimatePresence>
            {budgets.map((budget, index) => (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="mb-4"
              >
                <div className="flex justify-between items-center">
                  <span>{budget.category_name}</span>
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
                </div>
                <div className="mt-2">
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
                          ((budget.spent) / budget.amount) * 100 || 0,
                          100
                        )}%`,
                        height: "100%",
                        backgroundColor:
                          budget.spent > budget.amount
                            ? "var(--expense-color)"
                            : "var(--primary-color)",
                        borderRadius: "9999px",
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Add Budget Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow mb-6"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Budget Form */}
      <AnimatePresence>
        {editingBudget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow mb-6"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
