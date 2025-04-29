"use client"

import React, { useState, useEffect } from "react"
import { FiCreditCard, FiDollarSign, FiDownload, FiPieChart, FiPlus, FiTrendingUp, FiTrendingDown } from "react-icons/fi"
import { formatCurrency, formatDate } from '../utils/format'
import { LineChart, BarChart, PieChart, createExpenseBreakdownData, createTrendData, createBudgetVsActualData } from '../components/Charts'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion, AnimatePresence } from "framer-motion"
import dashboardService from '../services/dashboardService'

export default function DashboardTab({ onError }) {
  const [timeframe, setTimeframe] = useState("month")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalExpenses: 0,
      totalIncome: 0,
      currentBalance: 0,
      savings: 0,
      expenseTrend: "",
      incomeTrend: "",
      balanceTrend: "",
      savingsRate: "0%",
    },
    budgetStatus: [],
    recentTransactions: [],
    categoryBreakdown: [],
    expenseTrends: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const data = await dashboardService.getDashboardData()
        console.log('Dashboard summary:', data.summary) // Debug log for summary
        setDashboardData(data)
        if (onError) onError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        if (onError) onError("Failed to load dashboard data. Please ensure the backend server is running.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [timeframe, onError])

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <LoadingSpinner text="Loading dashboard..." />
      </motion.div>
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
        <h1 className="page-title">Expense Dashboard</h1>
        <div className="flex gap-2">
          <select
            className="form-select"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{ width: "180px" }}
          >
            <option value="today">Today</option>
            <option value="month">This Month</option>
          </select>
          <button className="btn btn-outline btn-sm">
            <FiDownload />
            <span className="sr-only">Download Report</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards - Horizontal Layout */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-4 gap-4 mb-6"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Balance</p>
                <h3 className="text-2xl font-bold">{formatCurrency(dashboardData.summary.currentBalance)}</h3>
                <p className="text-xs text-gray-500">{dashboardData.summary.balanceTrend}</p>
              </div>
              <FiDollarSign className="text-2xl text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Income</p>
                <h3 className="text-2xl font-bold text-green-500">{formatCurrency(dashboardData.summary.totalIncome)}</h3>
                <p className="text-xs text-gray-500">{dashboardData.summary.incomeTrend}</p>
              </div>
              <FiTrendingUp className="text-2xl text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Expenses</p>
                <h3 className="text-2xl font-bold text-red-500">{formatCurrency(dashboardData.summary.totalExpenses)}</h3>
                <p className="text-xs text-gray-500">{dashboardData.summary.expenseTrend}</p>
              </div>
              <FiTrendingDown className="text-2xl text-red-500" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Savings</p>
                <h3 className="text-2xl font-bold text-blue-500">{formatCurrency(dashboardData.summary.savings)}</h3>
                <p className="text-xs text-gray-500">Rate: {dashboardData.summary.savingsRate}</p>
              </div>
              <FiCreditCard className="text-2xl text-blue-500" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-2"
        >
          <div className="card mb-6">
            <div className="card-content">
              <h2 className="card-title">Expense Distribution</h2>
              <div className="h-64">
                {dashboardData.categoryBreakdown.length > 0 ? (
                  <PieChart
                    data={createExpenseBreakdownData(dashboardData.categoryBreakdown)}
                    title="Expense Distribution"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No expense data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h2 className="card-title">Income vs Expenses</h2>
              <div className="h-64">
                {dashboardData.budgetStatus.length > 0 ? (
                  <BarChart
                    data={createBudgetVsActualData(dashboardData.budgetStatus)}
                    title="Budget vs Actual"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No budget data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Recent Transactions and Expense Trends */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Recent Transactions */}
          <div className="card">
            <div className="card-content">
              <h2 className="card-title">Recent Transactions</h2>
              <div className="space-y-4">
                {dashboardData.recentTransactions.length === 0 ? (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500"
                  >
                    No recent transactions found.
                  </motion.p>
                ) : (
                  <AnimatePresence>
                    {dashboardData.recentTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {transaction.type === "income" ? (
                              <FiTrendingUp className="text-green-500" />
                            ) : (
                              <FiTrendingDown className="text-red-500" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${
                          transaction.type === "income" ? "text-green-500" : "text-red-500"
                        }`}>
                          {transaction.type === "income" ? "+" : "-"}₹{formatCurrency(Math.abs(transaction.amount))}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          {/* Expense Trends */}
          <div className="card">
            <div className="card-content">
              <h2 className="card-title">Expense Trends</h2>
              <div className="h-48">
                {dashboardData.expenseTrends?.length > 0 ? (
                  <LineChart
                    data={createTrendData(
                      dashboardData.expenseTrends.map(e => ({ date: e.month, amount: e.total })),
                      "Expense Trend"
                    )}
                    title="Monthly Expense Trend"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No trend data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
