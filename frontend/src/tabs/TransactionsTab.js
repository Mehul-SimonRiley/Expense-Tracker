"use client"

import { useState } from "react"
import { FiChevronDown, FiEdit2, FiFilter, FiPlus, FiTrash2 } from "react-icons/fi"

export default function TransactionsTab() {
  const [filterOpen, setFilterOpen] = useState(false)

  // Sample transaction data
  const transactions = [
    { id: 1, date: "2025-03-18", description: "Grocery Store", category: "Food", amount: -86.42, type: "expense" },
    { id: 2, date: "2025-03-15", description: "Salary Deposit", category: "Income", amount: 2175.0, type: "income" },
    { id: 3, date: "2025-03-14", description: "Restaurant", category: "Dining", amount: -42.5, type: "expense" },
    {
      id: 4,
      date: "2025-03-12",
      description: "Gas Station",
      category: "Transportation",
      amount: -38.75,
      type: "expense",
    },
    {
      id: 5,
      date: "2025-03-10",
      description: "Electricity Bill",
      category: "Utilities",
      amount: -94.32,
      type: "expense",
    },
    { id: 6, date: "2025-03-05", description: "Freelance Payment", category: "Income", amount: 350.0, type: "income" },
    {
      id: 7,
      date: "2025-03-03",
      description: "Movie Tickets",
      category: "Entertainment",
      amount: -28.5,
      type: "expense",
    },
    { id: 8, date: "2025-03-01", description: "Rent Payment", category: "Housing", amount: -1200.0, type: "expense" },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Transactions</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => setFilterOpen(!filterOpen)}>
            <FiFilter />
            Filter
          </button>
          <button className="btn btn-primary">
            <FiPlus />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="card mb-6">
          <div className="card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="form-label">Date Range</label>
                <select className="form-select">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Last 3 Months</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select">
                  <option>All Categories</option>
                  <option>Food</option>
                  <option>Housing</option>
                  <option>Transportation</option>
                  <option>Utilities</option>
                  <option>Entertainment</option>
                  <option>Income</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select">
                  <option>All Types</option>
                  <option>Expense</option>
                  <option>Income</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="form-input" />
                  <input type="number" placeholder="Max" className="form-input" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-outline">Reset</button>
              <button className="btn btn-primary">Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Total Income</div>
            <div className="text-xl font-bold text-income">+₹2,525.00</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Total Expenses</div>
            <div className="text-xl font-bold text-expense">-₹1,490.49</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted mb-2">Net Flow</div>
            <div className="text-xl font-bold">+₹1,034.51</div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Transactions</h2>
          <div className="flex gap-2">
            <select className="form-select" style={{ width: "150px" }}>
              <option>Sort by Date</option>
              <option>Sort by Amount</option>
              <option>Sort by Category</option>
            </select>
            <button className="btn btn-outline btn-sm">
              <FiChevronDown />
            </button>
          </div>
        </div>
        <div className="card-content" style={{ padding: 0 }}>
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
                    {transaction.type === "expense" ? "-" : "+"}₹{Math.abs(transaction.amount).toFixed(2)}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm">
                        <FiEdit2 size={14} />
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted">Showing 8 of 24 transactions</div>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm" disabled>
                Previous
              </button>
              <button className="btn btn-primary btn-sm">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
