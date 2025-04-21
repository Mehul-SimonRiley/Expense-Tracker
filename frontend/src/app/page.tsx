"use client"

import dynamic from "next/dynamic"
import React from "react"

// Use dynamic import with no SSR to avoid TypeScript errors
const ExpenseTracker = dynamic(() => import("../ExpenseTracker"), { ssr: false })

export default function Page() {
  return <ExpenseTracker />
}
