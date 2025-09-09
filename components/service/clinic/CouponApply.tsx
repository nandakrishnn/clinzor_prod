"use client"

import React from "react"

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
      return `${coupon.discount_percentage}% off`;
    } else if (coupon.flat_discount_amt) {
      return `₹${coupon.flat_discount_amt} off`;
    }
    return "Discount";
  };

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
            Applied: <strong>{applied.title}</strong> — {getDiscountText(applied)}
          </span>
          <button onClick={onRemove} className="text-emerald-900 underline">
            Remove
          </button>
        </div>
      )}

      {open && (
        <div className="mt-3 grid gap-2">
          {available.length === 0 ? (
            <p className="text-sm text-gray-500">No coupons available</p>
          ) : (
            available.map((c) => (
              <div
                key={c.uuid}
                className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.description}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    {getDiscountText(c)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Valid: {new Date(c.valid_from).toLocaleDateString()} - {new Date(c.valid_to).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => onApply(c)}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 ml-2"
                >
                  Apply
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}