import React from "react";

export function Card({ children }) {
  return <div className="p-4 bg-white shadow-md rounded-lg">{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="px-4 py-2 border-b">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function CardFooter({ children }) {
  return <div className="px-4 py-2 border-t">{children}</div>;
}
export function CardDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}
