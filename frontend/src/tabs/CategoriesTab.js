"use client"

import { useState, useEffect } from "react"
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi"
import { categoriesAPI } from "../services/api"

export default function CategoriesTab() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    budget: "",
    color: "#3b82f6",
    icon: "📊",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Failed to load categories. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      await categoriesAPI.create(newCategory)
      setNewCategory({
        name: "",
        budget: "",
        color: "#3b82f6",
        icon: "📊",
      })
      setShowAddForm(false)
      fetchCategories() // Refresh the list
    } catch (err) {
      console.error("Error adding category:", err)
      alert("Failed to add category. Please try again.")
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory) return

    try {
      await categoriesAPI.update(editingCategory.id, editingCategory)
      setEditingCategory(null)
      fetchCategories() // Refresh the list
    } catch (err) {
      console.error("Error updating category:", err)
      alert("Failed to update category. Please try again.")
    }
  }

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoriesAPI.delete(id)
        fetchCategories() // Refresh the list
      } catch (err) {
        console.error("Error deleting category:", err)
        alert("Failed to delete category. Please try again.")
      }
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4">Loading categories...</p>
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
              <button className="btn btn-primary" onClick={handleAddCategory}>
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Form */}
      {editingCategory && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">Edit Category</h2>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Budget</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingCategory.budget}
                  onChange={(e) => setEditingCategory({ ...editingCategory, budget: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="color"
                  className="form-input"
                  value={editingCategory.color}
                  onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  style={{ height: "40px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <select
                  className="form-select"
                  value={editingCategory.icon}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
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
              <button className="btn btn-outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditCategory}>
                Save Changes
              </button>
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
                  <p className="text-sm text-muted">Monthly Budget: {formatCurrency(category.budget)}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button className="btn btn-outline btn-sm" onClick={() => setEditingCategory(category)}>
                  <FiEdit2 size={14} />
                  Edit
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => handleDeleteCategory(category.id)}>
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
