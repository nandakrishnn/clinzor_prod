"use client"

type Service = {
  title: string
  image: string
}

type Coupon = { 
  uuid: string;
  title: string;
  description: string;
  discount_percentage: string | null;
  flat_discount_amt: number | null;
  valid_from: string;
  valid_to: string;
} | null

export function OrderSummary({
  service,
  sessionType,
  mode,
  slot,
  genderPref,
  coupon,
  price,
  discount,
  total,
}: {
  service: Service
  sessionType: "CONSULTATION" | "SESSION"
  mode: "HOME_VISIT" | "VIDEO_CALL" | "PHYSICAL_VISIT"
  slot: { label: string; dateKey: string } | null
  genderPref: "FEMALE" | "MALE" | "NONE"
  coupon: Coupon
  price: number
  discount: number
  total: number
}) {
  const getDiscountText = (coupon: Coupon) => {
    if (!coupon) return "";
    if (coupon.discount_percentage) return `${coupon.discount_percentage}%`;
    if (coupon.flat_discount_amt) return `₹${coupon.flat_discount_amt}`;
    return "";
  };

  return (
    <aside className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-medium text-gray-900">Order Summary</h3>
      <div className="flex items-start gap-3">
        <img
          src={service.image || "/placeholder.svg?height=48&width=48&query=service"}
          alt=""
          className="size-12 rounded-md bg-gray-100"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">{service.title}</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>Mode: {mode === "PHYSICAL_VISIT" ? "In-Clinic" : mode === "HOME_VISIT" ? "Home Visit" : "Video Call"}</li>
            <li>Type: {sessionType === "CONSULTATION" ? "Consultation" : "Session"}</li>
            <li>Time: {slot ? slot.label : "Not selected"}</li>
            <li>
              Preferred Doctor: {genderPref === "NONE" ? "No preference" : genderPref === "FEMALE" ? "FEMALE" : "MALE"}
            </li>
            {coupon && (
              <li>
                Coupon: {coupon.title} ({getDiscountText(coupon)})
              </li>
            )}
          </ul>
        </div>
      </div>

      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt>Price</dt>
          <dd>₹{price}</dd>
        </div>
        <div className="flex justify-between text-gray-500">
          <dt>Discount</dt>
          <dd>-₹{discount}</dd>
        </div>
        <div className="mt-2 flex justify-between border-t pt-2 font-semibold text-gray-900">
          <dt>Total</dt>
          <dd>₹{total}</dd>
        </div>
      </dl>
    </aside>
  )
}