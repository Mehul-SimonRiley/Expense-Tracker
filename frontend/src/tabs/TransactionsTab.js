"use client"

import { useState, useEffect } from "react"
import { FiChevronDown, FiEdit2, FiFilter, FiPlus, FiTrash2, FiX } from "react-icons/fi"
import { transactionsAPI, categoriesAPI } from "../services/api"

export default function TransactionsTab({ onError }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netFlow: 0,
  })
  const [filters, setFilters] = useState({
    dateRange: "month",
    category: "all",
    type: "all",
    minAmount: "",
    maxAmount: "",
  })
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    type: "expense",
    notes: "",
  })
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch categories first for the dropdown
        const categoriesData = await categoriesAPI.getAll()
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])

        // Then fetch transactions
        await fetchTransactions()

        if (onError) onError(null)
      } catch (err) {
        console.error("Error fetching initial data:", err)
        if (onError) onError("Failed to load transactions data. Please ensure the backend server is running.")
      }
    }

    fetchData()
  }, [onError])

  useEffect(() => {
    // Refetch when filters or sorting changes
    if (!isLoading) {
      fetchTransactions()
    }
  }, [filters, sortBy, sortDirection, currentPage])

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await transactionsAPI.getAll();
      setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Failed to load transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    try {
      await transactionsAPI.create(newTransaction)
      setNewTransaction({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        type: "expense",
        notes: "",
      })
      setShowAddForm(false)
      fetchTransactions() // Refresh the list
    } catch (err) {
      console.error("Error adding transaction:", err)
      alert("Failed to add transaction. Please try again.")
    }
  }

  const handleEditTransaction = async () => {
    if (!editingTransaction) return

    try {
      await transactionsAPI.update(editingTransaction.id, editingTransaction)
      setEditingTransaction(null)
      fetchTransactions() // Refresh the list
    } catch (err) {
      console.error("Error updating transaction:", err)
      alert("Failed to update transaction. Please try again.")
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionsAPI.delete(id)
        fetchTransactions() // Refresh the list
      } catch (err) {
        console.error("Error deleting transaction:", err)
        alert("Failed to delete transaction. Please try again.")
      }
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleResetFilters = () => {
    setFilters({
      dateRange: "month",
      category: "all",
      type: "all",
      minAmount: "",
      maxAmount: "",
    })
    setCurrentPage(1)
  }

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // New field, default to descending
      setSortBy(field)
      setSortDirection("desc")
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0)
  }

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Transactions</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => setFilterOpen(!filterOpen)}>
            <FiFilter />
            Filter
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <FiPlus />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Add/Edit Transaction Form */}
      {(showAddForm || editingTransaction) && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</h2>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setShowAddForm(false)
                setEditingTransaction(null)
              }}
            >
              <FiX />
            </button>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Grocery Shopping"
                  value={editingTransaction ? editingTransaction.description : newTransaction.description}
                  onChange={(e) => {
                    if (editingTransaction) {
                      setEditingTransaction({ ...editingTransaction, description: e.target.value })
                    } else {
                      setNewTransaction({ ...newTransaction, description: e.target.value })
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="0.00"
                  value={editingTransaction ? editingTransaction.amount : newTransaction.amount}
                  onChange={(e) => {
                    if (editingTransaction) {
                      setEditingTransaction({ ...editingTransaction, amount: e.target.value })
                    } else {
                      setNewTransaction({ ...newTransaction, amount: e.target.value })
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={
                    editingTransaction
                      ? editingTransaction.date
                        ? new Date(editingTransaction.date).toISOString().split("T")[0]
                        : ""
                      : newTransaction.date
                  }
                  onChange={(e) => {
                    if (editingTransaction) {
                      setEditingTransaction({ ...editingTransaction, date: e.target.value })
                    } else {
                      setNewTransaction({ ...newTransaction, date: e.target.value })
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={editingTransaction ? editingTransaction.category : newTransaction.category}
                  onChange={(e) => {
                    if (editingTransaction) {
                      setEditingTransaction({ ...editingTransaction, category: e.target.value })
                    } else {
                      setNewTransaction({ ...newTransaction, category: e.target.value })
                    }
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={editingTransaction ? editingTransaction.type : newTransaction.type}
                  onChange={(e) => {
                    if (editingTransaction) {
                      setEditingTransaction({ ...editingTransaction, type: e.target.value })
                    } else {
                      setNewTransaction({ ...newTransaction, type: e.target.value })
                    }
                  }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group sm:col-span-2">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Add any additional notes here..."
                  value={editingTransaction ? editingTransaction.notes || "" : newTransaction.notes}
                  onChange={(e) => {
                    if (editingTransaction) {
                      setEditingTransaction({ ...editingTransaction, notes: e.target.value })
                    } else {
                      setNewTransaction({ ...newTransaction, notes: e.target.value })
                    }
                  }}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingTransaction(null)
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={editingTransaction ? handleEditTransaction : handleAddTransaction}
              >
                {editingTransaction ? "Save Changes" : "Add Transaction"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {filterOpen && (
        <div className="card mb-6">
          <div className="card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="form-label">Date Range</label>
                <select
                  className="form-select"
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                >
                  <option value="month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="quarter">Last 3 Months</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="form-input"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="form-input"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-outline" onClick={handleResetFilters}>
                Reset
              </button>
              <button className="btn btn-primary" onClick={() => setFilterOpen(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Total Income</div>
            <div className="text-xl font-bold text-income">{formatCurrency(summary.totalIncome)}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Total Expenses</div>
            <div className="text-xl font-bold text-expense">{formatCurrency(summary.totalExpenses)}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Net Flow</div>
            <div className="text-xl font-bold">{formatCurrency(summary.netFlow)}</div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Transactions</h2>
          <div className="flex gap-2">
            <select
              className="form-select"
              style={{ width: "150px" }}
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="category">Sort by Category</option>
            </select>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            >
              <FiChevronDown style={{ transform: sortDirection === "asc" ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>
          </div>
        </div>
        <div className="card-content" style={{ padding: 0 }}>
          {isLoading && transactions.length > 0 ? (
            <div className="p-4 text-center">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="p-4 text-center">
              No transactions found. Try adjusting your filters or add a new transaction.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.description}</td>
                    <td>
                      <span className={`badge ${transaction.type === "expense" ? "badge-expense" : "badge-income"}`}>
                        {transaction.category}
                      </span>
                    </td>
                    <td className={transaction.type === "expense" ? "text-expense" : "text-income"}>
                      {transaction.type === "expense" ? "-" : "+"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-outline btn-sm" onClick={() => setEditingTransaction(transaction)}>
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card-footer">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted">
              Showing {transactions.length} of {transactions.length} transactions
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <button
                className="btn btn-primary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
