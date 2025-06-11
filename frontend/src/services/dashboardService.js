// frontend/src/services/dashboardService.js

import { dashboardAPI, transactionsAPI, categoriesAPI, budgetsAPI } from './api'
import api from './api'

// Fetch dashboard summary
const getSummary = async () => {
  try {
    const response = await dashboardAPI.getSummary()
    const data = response || {}
    return {
      totalExpenses: parseFloat(data.total_expenses || 0),
      totalIncome: parseFloat(data.total_income || 0),
      currentBalance: parseFloat(data.current_balance || 0),
      savings: parseFloat(data.savings || 0),
      expenseTrend: data.expense_trend || "",
      incomeTrend: data.income_trend || "",
      balanceTrend: data.balance_trend || "",
      savingsRate: data.savings_rate || "0%"
    }
  } catch (error) {
    console.error('Error fetching dashboard summary:', error)
    return {
      totalExpenses: 0,
      totalIncome: 0,
      currentBalance: 0,
      savings: 0,
      expenseTrend: "",
      incomeTrend: "",
      balanceTrend: "",
      savingsRate: "0%"
    }
  }
}

// Fetch budget status
const getBudgetStatus = async () => {
  try {
    const response = await budgetsAPI.getAll()
    return (response || []).map(budget => ({
      category: budget.category_name || budget.name || budget.category || 'Uncategorized',
      limit: parseFloat(budget.amount || 0),
      spent: parseFloat(budget.spent || budget.current_spending || 0)
    }))
  } catch (error) {
    console.error('Error fetching budget status:', error)
    return []
  }
}

// Fetch recent transactions
const getRecentTransactions = async () => {
  try {
    const response = await transactionsAPI.getAll({ limit: 5 })
    return (response || []).map(transaction => ({
      id: transaction.id,
      description: transaction.description || '',
      amount: parseFloat(transaction.amount || 0),
      type: transaction.type || 'expense',
      date: transaction.date || new Date().toISOString(),
      category: transaction.category_name || transaction.name || transaction.category || 'Uncategorized'
    }))
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    return []
  }
}

// Fetch category breakdown
const getCategoryBreakdown = async () => {
  try {
    const response = await categoriesAPI.getExpenseBreakdown()
    return (response || []).map(category => ({
      category: category.name || category.category_name || category.category || 'Uncategorized',
      amount: parseFloat(category.amount || 0),
      percentage: parseFloat(category.percentage || 0),
      color: category.color || undefined
    }))
  } catch (error) {
    console.error('Error fetching category breakdown:', error)
    return []
  }
}

const getExpenseTrends = async () => {
  try {
    const response = await transactionsAPI.getAll()
    const transactions = response || []
    
    // Calculate monthly expense trends
    const trendsMap = {}
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        const date = new Date(t.date)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        trendsMap[month] = (trendsMap[month] || 0) + parseFloat(t.amount || 0)
      }
    })

    // Get last 12 months
    const now = new Date()
    const months = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months.push(m)
    }

    return months.map((m) => ({ month: m, total: trendsMap[m] || 0 }))
  } catch (error) {
    console.error('Error fetching expense trends:', error)
    return []
  }
}

const getDashboardData = async (timeframe = "all", customDateRange = null) => {
  try {
    let url = '/dashboard'
    const params = new URLSearchParams()

    if (timeframe === "today") {
      params.append('timeframe', 'today')
    } else if (timeframe === "month") {
      params.append('timeframe', 'month')
    } else if (timeframe === "custom" && customDateRange) {
      params.append('timeframe', 'custom')
      params.append('start_date', customDateRange.start_date)
      params.append('end_date', customDateRange.end_date)
    }

    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw error
  }
}

const dashboardService = {
  getSummary,
  getBudgetStatus,
  getRecentTransactions,
  getCategoryBreakdown,
  getExpenseTrends,
  getDashboardData
}

export default dashboardService