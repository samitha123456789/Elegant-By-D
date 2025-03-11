import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
  }).format(amount);
}

export function generateTrackingNumber(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let result = ""
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `SM-${result}`
}

// lib/utils.ts
export function getBaseUrl() {
  // Client-side: Use the browser's current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Vercel-specific: Use VERCEL_URL during build/deploy
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Server-side: Use NEXT_PUBLIC_BASE_URL if set
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    console.log("Using NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Fallback for local dev
  console.log("Falling back to localhost:3000");
  return "http://localhost:3000";
}