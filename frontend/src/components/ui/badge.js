import React from "react";

export function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
      {children}
    </span>
  );
}
