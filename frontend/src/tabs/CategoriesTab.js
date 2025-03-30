"use client"

import { useState } from "react"
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi"

export default function CategoriesTab() {
  // Sample categories data
  const categories = [
    { id: 1, name: "Housing", budget: 1500, color: "#3b82f6", icon: "🏠" },
    { id: 2, name: "Food", budget: 500, color: "#10b981", icon: "🍔" },
    { id: 3, name: "Transportation", budget: 200, color: "#f59e0b", icon: "🚗" },
    { id: 4, name: "Utilities", budget: 300, color: "#6366f1", icon: "💡" },
    { id: 5, name: "Entertainment", budget: 150, color: "#8b5cf6", icon: "🎬" },
    { id: 6, name: "Shopping", budget: 200, color: "#ec4899", icon: "🛍️" },
    { id: 7, name: "Healthcare", budget: 100, color: "#ef4444", icon: "🏥" },
    { id: 8, name: "Personal", budget: 100, color: "#14b8a6", icon: "👤" },
    { id: 9, name: "Education", budget: 50, color: "#f97316", icon: "📚" },
    { id: 10, name: "Savings", budget: 400, color: "#64748b", icon: "💰" },
  ]

  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    budget: "",
    color: "#3b82f6",
    icon: "📊",
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Categories</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <FiPlus />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">Add New Category</h2>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Groceries"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Budget</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g., 500"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="color"
                  className="form-input"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  style={{ height: "40px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <select
                  className="form-select"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                >
                  <option value="📊">📊 Chart</option>
                  <option value="🍔">🍔 Food</option>
                  <option value="🏠">🏠 Home</option>
                  <option value="🚗">🚗 Car</option>
                  <option value="💡">💡 Utilities</option>
                  <option value="🎬">🎬 Entertainment</option>
                  <option value="🛍️">🛍️ Shopping</option>
                  <option value="🏥">🏥 Healthcare</option>
                  <option value="👤">👤 Personal</option>
                  <option value="📚">📚 Education</option>
                  <option value="💰">💰 Savings</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary">Save Category</button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div className="card" key={category.id}>
            <div className="card-content">
              <div className="flex items-center gap-4 mb-4">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: category.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted">Monthly Budget: ${category.budget}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button className="btn btn-outline btn-sm">
                  <FiEdit2 size={14} />
                  Edit
                </button>
                <button className="btn btn-outline btn-sm">
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

