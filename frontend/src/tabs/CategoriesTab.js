"use client"

import React, { useState, useEffect } from "react"
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi"
import { categoriesAPI } from "../services/api"
import { budgetsAPI } from "../services/api"
import { formatCurrency } from "../utils/format"
import LoadingSpinner from '../components/LoadingSpinner'
import { motion, AnimatePresence } from "framer-motion"

export default function CategoriesTab() {
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
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
    fetchBudgets()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const data = await categoriesAPI.getAll()
      setCategories(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("Failed to load categories")
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBudgets = async () => {
    try {
      const data = await budgetsAPI.getAll();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setBudgets([]);
    }
  }

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
      fetchCategories()
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
      fetchCategories()
    } catch (err) {
      console.error("Error updating category:", err)
      alert("Failed to update category. Please try again.")
    }
  }

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoriesAPI.delete(id)
        fetchCategories()
      } catch (err) {
        console.error("Error deleting category:", err)
        alert("Failed to delete category. Please try again.")
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
        <LoadingSpinner text="Loading categories..." />
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <FiPlus className="mr-2" />
          Add Category
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow mb-6"
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Category List</h2>
        </div>
        <div className="p-4">
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories found. Add your first category to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {categories.map((category, index) => {
                  const now = new Date();
                  const currentBudget = budgets.find(budget =>
                    String(budget.category_id) === String(category.id) &&
                    new Date(budget.start_date) <= now &&
                    new Date(budget.end_date) >= now
                  );
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border rounded-lg p-4"
                      style={{ borderLeftColor: category.color, borderLeftWidth: "4px" }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{category.icon}</span>
                            <h3 className="font-bold">{category.name}</h3>
                          </div>
                          <p className="text-gray-500 mt-1">
                            Budget: {formatCurrency(currentBudget ? currentBudget.amount : 0)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setEditingCategory(category)}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="btn btn-outline btn-sm text-red-500"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget
                </label>
                <input
                  type="number"
                  className="form-input w-full"
                  value={newCategory.budget}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, budget: e.target.value })
                  }
                  placeholder="Budget amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  className="w-full h-10"
                  value={newCategory.color}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, color: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={newCategory.icon}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, icon: e.target.value })
                  }
                  placeholder="Emoji icon"
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
              <button className="btn btn-primary" onClick={handleAddCategory}>
                Save Category
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget
                </label>
                <input
                  type="number"
                  className="form-input w-full"
                  value={editingCategory.budget}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      budget: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  className="w-full h-10"
                  value={editingCategory.color}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      color: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={editingCategory.icon}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      icon: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="btn btn-outline"
                onClick={() => setEditingCategory(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditCategory}>
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
