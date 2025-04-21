"use client"  // You can keep or remove this line — it's not needed in CRA

import React, { lazy, Suspense } from "react";

// Lazy load the component
const ExpenseTracker = lazy(() => import("../ExpenseTracker"));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExpenseTracker onLogout={undefined} />
    </Suspense>
  );
}
