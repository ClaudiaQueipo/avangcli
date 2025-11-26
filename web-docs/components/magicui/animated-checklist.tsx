"use client"

import { Check } from "lucide-react"
import React, { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface ChecklistItem {
  name: string
}

interface AnimatedChecklistProps {
  items: ChecklistItem[]
  className?: string
  itemDelay?: number
}

export const AnimatedChecklist = ({ items, className, itemDelay = 300 }: AnimatedChecklistProps) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([])

  useEffect(() => {
    items.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, index])
      }, index * itemDelay)
    })
  }, [items, itemDelay])

  return (
    <div className={cn("w-full space-y-2", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-2 transition-all duration-500",
            visibleItems.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          )}
        >
          <div
            className={cn(
              "shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg",
              visibleItems.includes(index) ? "border-black bg-green-yellow/30" : "border-surf-crest/30"
            )}
          >
            {visibleItems.includes(index) && (
              <Check className="w-2.5 h-2.5 text-black animate-in zoom-in duration-200" />
            )}
          </div>

          <span className="text-sm font-semibold text-black drop-shadow-md">{item.name}</span>
        </div>
      ))}
    </div>
  )
}
