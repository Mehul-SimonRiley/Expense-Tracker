// Currency formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

// Date formatting
export const formatDate = (date, format = 'short') => {
  const dateObj = new Date(date)
  if (format === 'short') {
    return dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
  return dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Percentage formatting
export const formatPercentage = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

// Category name formatting
export const formatCategoryName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Transaction description formatting
export const formatDescription = (description) => {
  if (!description) return 'No description'
  return description.charAt(0).toUpperCase() + description.slice(1)
}

// Number formatting for large numbers
export const formatLargeNumber = (number) => {
  if (number >= 10000000) {
    return (number / 10000000).toFixed(1) + ' Cr'
  }
  if (number >= 100000) {
    return (number / 100000).toFixed(1) + ' L'
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + ' K'
  }
  return number.toString()
} 