import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

export function Avatar({ children }) {
  return <AvatarPrimitive.Root className="w-10 h-10 rounded-full">{children}</AvatarPrimitive.Root>;
}

export function AvatarImage({ src }) {
  return <AvatarPrimitive.Image className="w-full h-full rounded-full" src={src} />;
}

export function AvatarFallback({ children }) {
  return <AvatarPrimitive.Fallback className="w-full h-full bg-gray-300 rounded-full">{children}</AvatarPrimitive.Fallback>;
}
