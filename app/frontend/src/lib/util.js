import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatConfidence(confidence) {
  return `${(confidence * 100).toFixed(1)}%`
}

export function getConfidenceColor(confidence) {
  if (confidence >= 0.8) return "text-green-600"
  if (confidence >= 0.6) return "text-yellow-600"
  return "text-red-600"
}

export function getPredictionColor(prediction) {
  return prediction === "Fake News" 
    ? "bg-red-50 text-red-700 border-red-200" 
    : "bg-green-50 text-green-700 border-green-200"
}

export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString()
}