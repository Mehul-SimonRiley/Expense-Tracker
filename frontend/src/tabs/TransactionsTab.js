"use client"

import { useState, useEffect } from "react"
import { FiChevronDown, FiEdit2, FiFilter, FiPlus, FiTrash2, FiX } from "react-icons/fi"
import { transactionsAPI, categoriesAPI } from "../services/api"
import { formatCurrency } from "../utils/format"

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
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

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
      setError("Failed to load transactions data")
      if (onError) onError("Failed to load transactions data")
    }
  }

  useEffect(() => {
    if (!isLoading) {
      fetchTransactions()
    }
  }, [filters, sortBy, sortDirection, currentPage])

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const data = await transactionsAPI.getAll()
      setTransactions(Array.isArray(data) ? data : [])
      
      // Calculate summary
      const summary = data.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
          acc.totalIncome += Number(transaction.amount)
        } else {
          acc.totalExpenses += Number(transaction.amount)
        }
        return acc
      }, { totalIncome: 0, totalExpenses: 0, netFlow: 0 })
      
      summary.netFlow = summary.totalIncome - summary.totalExpenses
      setSummary(summary)
      setError(null)
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError("Failed to load transactions")
    } finally {
      setIsLoading(false)
    }
  }

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
      fetchTransactions()
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
      fetchTransactions()
    } catch (err) {
      console.error("Error updating transaction:", err)
      alert("Failed to update transaction. Please try again.")
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionsAPI.delete(id)
        fetchTransactions()
      } catch (err) {
        console.error("Error deleting transaction:", err)
        alert("Failed to delete transaction. Please try again.")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4">Loading transactions...</p>
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
    <div className="p-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Net Flow</h3>
          <p className={`text-2xl font-bold ${summary.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(summary.netFlow)}
          </p>
        </div>
      </div>

      {/* Filters and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <button
            className="btn btn-outline"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
          {filterOpen && (
            <div className="absolute bg-white p-4 rounded-lg shadow-lg z-10 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    className="form-select w-full"
                    value={filters.dateRange}
                    onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  >
                    <option value="all">All Time</option>
                    <option value="month">This Month</option>
                    <option value="week">This Week</option>
                    <option value="today">Today</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="form-select w-full"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    className="form-select w-full"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      className="form-input w-1/2"
                      placeholder="Min"
                      value={filters.minAmount}
                      onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    />
                    <input
                      type="number"
                      className="form-input w-1/2"
                      placeholder="Max"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <FiPlus className="mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                className="form-input w-full"
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, description: e.target.value })
                }
                placeholder="Transaction description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="form-input w-full"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, amount: e.target.value })
                }
                placeholder="Amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="form-input w-full"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="form-select w-full"
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                className="form-select w-full"
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, type: e.target.value })
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                className="form-input w-full"
                value={newTransaction.notes}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, notes: e.target.value })
                }
                placeholder="Additional notes"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              className="btn btn-outline"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAddTransaction}>
              Save Transaction
            </button>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Transactions</h2>
        </div>
        <div className="p-4">
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions found. Add your first transaction to get started.</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">
                          {categories.find(c => c.id === transaction.category)?.icon || "💰"}
                        </span>
                        <div>
                          <h3 className="font-bold">{transaction.description}</h3>
                          <p className="text-gray-500 text-sm">
                            {new Date(transaction.date).toLocaleDateString()} • 
                            {categories.find(c => c.id === transaction.category)?.name || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                      {transaction.notes && (
                        <p className="text-gray-500 mt-2 text-sm">{transaction.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setEditingTransaction(transaction)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn btn-outline btn-sm text-red-500"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

