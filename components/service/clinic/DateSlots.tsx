"use client"

import type React from "react"
import { Sun, Plus, Moon, Star } from "lucide-react"

type Slot = {
  uuid: string // Added to store the slot identifier
  dateKey: string
  label: string
  period: "morning" | "afternoon" | "evening" | "night"
}

type Tabs = Record<string, { dateTitle: string; availableCount: number; slots: Slot[] }>

const PERIODS: {
  key: Slot["period"]
  label: string
  icon: React.ReactNode
}[] = [
  {
    key: "morning",
    label: "Morning",
    icon: <Sun className="size-4" />,
  },
  {
    key: "afternoon",
    label: "Afternoon",
    icon: <Plus className="size-4" />,
  },
  {
    key: "evening",
    label: "Evening",
    icon: <Moon className="size-4" />,
  },
  {
    key: "night",
    label: "Night",
    icon: <Star className="size-4" />,
  },
]

// Helper function to convert API response to component format
export function transformApiDataToTabs(apiData: any): Tabs {
  const tabs: Tabs = {}
  
  apiData.data.forEach((dateSlot: any) => {
    const dateKey = dateSlot.slot_date
    const dateObj = new Date(dateSlot.slot_date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    let dateTitle = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    
    // Check if it's today or tomorrow for more user-friendly labels
    if (dateObj.toDateString() === today.toDateString()) {
      dateTitle = "Today"
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
      dateTitle = "Tomorrow"
    }
    
    const slots: Slot[] = []
    let availableCount = 0
    
    dateSlot.slot_details.forEach((slotDetail: any) => {
      const startTime = new Date(slotDetail.start_time)
      const endTime = new Date(slotDetail.end_time)
      
      // Format time as "HH:MM AM/PM"
      const startFormatted = startTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
      
      const endFormatted = endTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
      
      const label = `${startFormatted} - ${endFormatted}`
      
      // Determine period of day
      const hour = startTime.getHours()
      let period: Slot["period"] = "morning"
      
      if (hour >= 5 && hour < 12) period = "morning"
      else if (hour >= 12 && hour < 17) period = "afternoon"
      else if (hour >= 17 && hour < 21) period = "evening"
      else period = "night"
      
      slots.push({
        uuid: slotDetail.uuid,
        dateKey,
        label,
        period
      })
      
      availableCount += slotDetail.available_slots
    })
    
    tabs[dateKey] = {
      dateTitle,
      availableCount,
      slots
    }
  })
  
  return tabs
}

export function DateSlots({
  tabs,
  selectedTab,
  onTabChange,
  selectedSlot,
  onSelectSlot,
}: {
  tabs: Tabs
  selectedTab: string
  onTabChange: (k: string) => void
  selectedSlot: Slot | null
  onSelectSlot: (s: Slot) => void
}) {
  function parseTimeToMinutes(label: string) {
    // Extract start time from label (format: "HH:MM AM/PM - HH:MM AM/PM")
    const startTimeStr = label.split(' - ')[0]
    const [time, meridian] = startTimeStr.split(" ")
    let [h, m] = time.split(":").map((n) => Number.parseInt(n, 10))
    if (meridian === "PM" && h !== 12) h += 12
    if (meridian === "AM" && h === 12) h = 0
    return h * 60 + (m || 0)
  }

  const periods = PERIODS.map((p) => p.key)
  const current = tabs[selectedTab]

  const isToday = current?.dateTitle.toLowerCase() === "today"
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const visibleSlots = isToday && current ? current.slots.filter((s) => parseTimeToMinutes(s.label) > nowMinutes) : (current?.slots || [])

  const byPeriod: Record<string, Slot[]> = Object.fromEntries(
    periods.map((p) => [p, visibleSlots.filter((s) => s.period === p)]),
  )

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Tabs */}
      <div className="flex gap-2 border-b p-3">
        {Object.entries(tabs).map(([key, meta]) => {
          const isActive = key === selectedTab
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={[
                "rounded-md px-3 py-2 text-sm",
                isActive ? "bg-primaryColor text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              ].join(" ")}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{meta.dateTitle}</span>
                <span className="text-xs opacity-80">{meta.availableCount} Slots Available</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Helper note for today */}
      {isToday && (
        <p className="px-4 pt-3 text-xs text-gray-500">Showing only slots after the current time for today.</p>
      )}

      {/* Slots grouped by time of day */}
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
        {PERIODS.map((p) => (
          <div key={p.key} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <span className="text-gray-500">{p.icon}</span>
              {p.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {byPeriod[p.key].length === 0 && (
                <span className="text-xs text-gray-500">
                  {isToday ? "No upcoming slots" : "No slots in this period"}
                </span>
              )}
              {byPeriod[p.key].map((slot) => {
                const isSelected = selectedSlot?.uuid === slot.uuid
                return (
                  <button
                    key={slot.uuid}
                    onClick={() => onSelectSlot(slot)}
                    className={[
                      "rounded-md border px-3 py-2 text-sm",
                      isSelected
                        ? "border-primaryColor bg-blue-50 text-primaryColor"
                        : "border-blue-200 bg-white text-primaryColor hover:bg-blue-50",
                    ].join(" ")}
                  >
                    {slot.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}