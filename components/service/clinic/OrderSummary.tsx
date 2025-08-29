type Service = {
  title: string
  image: string
}

type Coupon = { code: string; label: string; percent: number } | null

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
  sessionType: "consultation" | "session"
  mode: "home" | "video" | "clinic"
  slot: { label: string; dateKey: string } | null
  genderPref: "female" | "male" | "none"
  coupon: Coupon
  price: number
  discount: number
  total: number
}) {
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
            <li>Mode: {mode === "clinic" ? "In-Clinic" : mode === "home" ? "Home Visit" : "Video Call"}</li>
            <li>Type: {sessionType === "consultation" ? "Consultation" : "Session"}</li>
            <li>Time: {slot ? slot.label : "Not selected"}</li>
            <li>
              Preferred Doctor: {genderPref === "none" ? "No preference" : genderPref === "female" ? "Female" : "Male"}
            </li>
            {coupon && (
              <li>
                Coupon: {coupon.code} ({coupon.percent}%)
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
