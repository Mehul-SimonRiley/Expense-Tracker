import React from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Common chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
}

// Line Chart Component
export const LineChart = ({ data, title }) => {
  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: title,
      },
    },
  }

  return <Line data={data} options={options} />
}

// Bar Chart Component
export const BarChart = ({ data, title }) => {
  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: title,
      },
    },
  }

  return <Bar data={data} options={options} />
}

// Pie Chart Component
export const PieChart = ({ data, title }) => {
  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: title,
      },
    },
  }

  return <Pie data={data} options={options} />
}

// Helper function to create expense breakdown data
export const createExpenseBreakdownData = (expenses) => {
  return {
    labels: expenses.map(exp => exp.category),
    datasets: [
      {
        label: 'Expenses',
        data: expenses.map(exp => exp.amount),
        backgroundColor: expenses.map((_, index) => 
          `hsl(${index * 30}, 70%, 50%)`
        ),
      },
    ],
  }
}

// Helper function to create trend data
export const createTrendData = (data, label) => {
  return {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: label,
        data: data.map(item => item.amount),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }
}

// Helper function to create budget vs actual data
export const createBudgetVsActualData = (budgets) => {
  return {
    labels: budgets.map(budget => budget.category),
    datasets: [
      {
        label: 'Budget',
        data: budgets.map(budget => budget.limit),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Actual',
        data: budgets.map(budget => budget.spent),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }
} 