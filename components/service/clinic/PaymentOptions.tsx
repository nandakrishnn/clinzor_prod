"use client"

import { useState } from "react"

export function PaymentOptions({
  className,
  value,
  onChange,
  onConfirm,
  isLoading = false
}: {
  className?: string
  value: "ONLINE" | "OFFLINE"
  onChange: (v: "ONLINE" | "OFFLINE") => void
  onConfirm: () => void
  isLoading?: boolean
}) {
  return (
    <section className={["rounded-lg border border-gray-200 bg-white p-4", className].join(" ")}>
      <h3 className="text-sm font-medium text-gray-900">Choose a payment option to Book Appointment</h3>
      <div className="mt-3 grid gap-3">
        <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50">
          <div>
            <p className="text-sm text-gray-900">Pay Online</p>
            <p className="text-xs text-gray-500">Proceed to secure payment</p>
          </div>
          <input
            type="radio"
            name="pay"
            className="size-4 accent-primaryColor"
            checked={value === "ONLINE"}
            onChange={() => onChange("ONLINE")}
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50">
          <div>
            <p className="text-sm text-gray-900">Pay at the clinic</p>
            <p className="text-xs text-gray-500">No online payment now</p>
          </div>
          <input
            type="radio"
            name="pay"
            className="size-4 accent-blue-600"
            checked={value === "OFFLINE"}
            onChange={() => onChange("OFFLINE")}
          />
        </label>
      </div>

      <button 
        onClick={onConfirm} 
        disabled={isLoading}
        className="mt-4 w-full rounded-md bg-primaryColor px-4 py-2 text-white hover:bg-primaryColor disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : value === "ONLINE" ? "Pay & Confirm" : "Confirm Clinic Visit"}
      </button>

      <ol className="mt-4 list-decimal space-y-1 pl-5 text-xs text-gray-500">
        <li>Free cancellation/rescheduling up to 2 hours before appointment.</li>
        <li>After that, a fee may apply for changes.</li>
        <li>Updates will be sent to your phone.</li>
      </ol>
    </section>
  )
}