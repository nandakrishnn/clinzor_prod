"use client"

import React from "react"

type Coupon = { code: string; label: string; percent: number }

export function CouponApply({
  available,
  applied,
  onApply,
  onRemove,
}: {
  available: Coupon[]
  applied: Coupon | null
  onApply: (c: Coupon) => void
  onRemove: () => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Coupons</h3>
        <button onClick={() => setOpen((v) => !v)} className="text-sm text-blue-600 hover:underline">
          {open ? "Hide" : "Apply"} Coupon
        </button>
      </div>

      {applied && (
        <div className="mt-3 flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800">
          <span>
            Applied: <strong>{applied.code}</strong> — {applied.percent}% off
          </span>
          <button onClick={onRemove} className="text-emerald-900 underline">
            Remove
          </button>
        </div>
      )}

      {open && (
        <div className="mt-3 grid gap-2">
          {available.map((c) => (
            <div
              key={c.code}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{c.label}</p>
                <p className="text-xs text-gray-500">Code: {c.code}</p>
              </div>
              <button
                onClick={() => onApply(c)}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
