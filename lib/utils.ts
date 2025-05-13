
import { Category, Priority } from "@/types/todo"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
      case "high":
          return "bg-red-100 text-red-800 hover:bg-red-200"
      case "normal":
          return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "low":
          return "bg-green-100 text-green-800 hover:bg-green-200"
  }
}

export const getCategoryColor = (category: Category) => {
  switch (category) {
      case "work":
          return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "personal":
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "study":
          return "bg-cyan-100 text-cyan-800 hover:bg-cyan-200"
      case "home":
          return "bg-pink-100 text-pink-800 hover:bg-pink-200"
  }
}