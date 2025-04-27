"use client"

import { useState, useEffect } from "react"
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi"
import { getTransactions } from '../services/calendarService'

export default function CalendarTab() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1; // JavaScript months are 0-indexed
        const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
        const endDate = `${year}-${month.toString().padStart(2, "0")}-${getDaysInMonth(year, currentMonth.getMonth()).toString().padStart(2, "0")}`;
        const data = await getTransactions(startDate, endDate);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching calendar transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentMonth]);

  // Helper function to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Helper function to get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  // Get transactions for a specific day
  const getTransactionsForDay = (day) => {
    if (!day) return []

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth() + 1 // JavaScript months are 0-indexed
    const dateString = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`

    return transactions.filter((transaction) => transaction.date === dateString)
  }

  // Format month name
  const formatMonth = () => {
    return currentMonth.toLocaleString("default", { month: "long", year: "numeric" })
  }

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Calendar days
  const calendarDays = generateCalendarDays()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Financial Calendar</h1>
        <button className="btn btn-primary">
          <FiPlus />
          Add Transaction
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="card mb-6">
        <div className="card-content">
          <div className="flex justify-between items-center">
            <button className="btn btn-outline" onClick={previousMonth}>
              <FiChevronLeft />
              Previous
            </button>
            <h2 className="text-xl font-bold">{formatMonth()}</h2>
            <button className="btn btn-outline" onClick={nextMonth}>
              Next
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card">
        <div className="card-content">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div key={index} className={`border rounded-md p-2 min-h-[100px] ${day ? "bg-white" : "bg-gray-100"}`}>
                {day && (
                  <>
                    <div className="text-right font-medium mb-2">{day}</div>
                    <div className="space-y-1">
                      {getTransactionsForDay(day).map((transaction) => (
                        <div
                          key={transaction.id}
                          className={`text-xs p-1 rounded ${
                            transaction.type === "expense" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          <div className="truncate">{transaction.description}</div>
                          <div className="font-medium">
                            {transaction.type === "expense" ? "-" : "+"}₹{Math.abs(transaction.amount).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
