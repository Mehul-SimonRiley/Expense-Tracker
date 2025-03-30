import React from "react";

export function Select({ children }) {
  return <div className="relative inline-block w-full">{children}</div>;
}

export function SelectTrigger({ children }) {
  return (
    <button className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500">
      {children}
    </button>
  );
}

export function SelectValue({ value }) {
  return <span>{value}</span>;
}

export function SelectContent({ children }) {
  return <div className="absolute mt-1 w-full bg-white border rounded-md shadow-md">{children}</div>;
}

export function SelectItem({ value, children, onClick }) {
  return (
    <div
      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
      onClick={() => onClick(value)}
    >
      {children}
    </div>
  );
}
