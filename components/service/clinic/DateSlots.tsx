"use client"

import type React from "react"

type Slot = {
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
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M5 12a7 7 0 1 1 14 0H5Z" />
      </svg>
    ),
  },
  {
    key: "afternoon",
    label: "Afternoon",
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2v20M2 12h20" />
      </svg>
    ),
  },
  {
    key: "evening",
    label: "Evening",
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 12a9 9 0 0 0 18 0 9 9 0 1 1-18 0Z" />
      </svg>
    ),
  },
  {
    key: "night",
    label: "Night",
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3c.47 3.53 3.26 6.32 6.79 6.79A7.5 7.5 0 0 0 21 12.79Z" />
      </svg>
    ),
  },
]

export function DateSlots({
  tabs,
  selectedTab,
  onTabChange,
  selectedSlot,
  onSelectSlot,
}: {
  tabs: Tabs
  selectedTab: keyof Tabs
  onTabChange: (k: keyof Tabs) => void
  selectedSlot: Slot | null
  onSelectSlot: (s: Slot) => void
}) {
  const periods = PERIODS.map((p) => p.key)
  const current = tabs[selectedTab as string]
  const byPeriod: Record<string, Slot[]> = Object.fromEntries(
    periods.map((p) => [p, current.slots.filter((s) => s.period === p)]),
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
              onClick={() => onTabChange(key as keyof Tabs)}
              className={[
                "rounded-md px-3 py-2 text-sm",
                isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
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

      {/* Slots grouped by time of day */}
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
        {PERIODS.map((p) => (
          <div key={p.key} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <span className="text-gray-500">{p.icon}</span>
              {p.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {byPeriod[p.key].length === 0 && <span className="text-xs text-gray-500">No slots in this period</span>}
              {byPeriod[p.key].map((slot) => {
                const isSelected = selectedSlot?.label === slot.label && selectedSlot?.dateKey === slot.dateKey
                return (
                  <button
                    key={`${slot.dateKey}-${slot.label}`}
                    onClick={() => onSelectSlot(slot)}
                    className={[
                      "rounded-md border px-3 py-2 text-sm",
                      isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50",
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
