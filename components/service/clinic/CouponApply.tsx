"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"

type Coupon = {
  uuid: string;
  title: string;
  description: string;
  discount_percentage: string | null;
  flat_discount_amt: number | null;
  valid_from: string;
  valid_to: string;
}

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

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discount_percentage) {
      const percent = parseFloat(coupon.discount_percentage);
      return `${percent % 1 === 0 ? percent.toFixed(0) : percent}% OFF`;
    } else if (coupon.flat_discount_amt) {
      return `₹${coupon.flat_discount_amt} OFF`
    }
    return "Discount"
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">🎟️ Coupons</h3>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
        >
          {open ? "Hide Coupons" : "Apply Coupon"}
        </button>
      </div>

      {applied && (
        <motion.div
          className="mt-3 flex flex-col items-start justify-between rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900 shadow-sm"
        >
          <span>
            ✅ Applied: <strong>{applied.title}</strong> —{" "}
            <span className="font-semibold">{getDiscountText(applied)}</span>
          </span>
          <button
            onClick={onRemove}
            className="text-red-600 font-medium hover:underline flex items-end justify-end w-full "
          >
             <span className="text-xs bg-red-50 border border-red-200 px-3 py-1 rounded-full">Remove</span>
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="mt-3 grid gap-3 overflow-hidden"
          >
            {available.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No coupons available at the moment
              </p>
            ) : (
              available.map((c) => (
                <motion.div
                  key={c.uuid}
                  className="flex items-start justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:shadow-md relative"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{c.description}</p>
                    <span className="inline-block mt-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 absolute right-2 top-0">
                      {getDiscountText(c)}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      Valid:{" "}
                      {new Date(c.valid_from).toLocaleDateString()} -{" "}
                      {new Date(c.valid_to).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => onApply(c)}
                      className="rounded-full w-full mt-2 bg-primaryColor px-4 py-1.5 text-xs font-medium text-white shadow hover:bg-primaryColor transition"
                    >
                      Apply
                    </button>
                  </div>

                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
