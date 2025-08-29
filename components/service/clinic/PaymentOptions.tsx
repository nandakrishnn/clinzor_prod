"use client"

export function PaymentOptions({
  className,
  value,
  onChange,
  onConfirm,
}: {
  className?: string
  value: "online" | "clinic"
  onChange: (v: "online" | "clinic") => void
  onConfirm: () => void
}) {
  return (
    <section className={["rounded-lg border border-gray-200 bg-white p-4", className].join(" ")}>
      <h3 className="text-sm font-medium text-gray-900">Choose a payment option to Book Appointment</h3>
      <div className="mt-3 grid gap-3">
        <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50">
          <div>
            <p className="text-sm text-gray-900">₹300 — Pay Online</p>
            <p className="text-xs text-gray-500">Proceed to secure payment</p>
          </div>
          <input
            type="radio"
            name="pay"
            className="size-4 accent-primaryColor"
            checked={value === "online"}
            onChange={() => onChange("online")}
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50">
          <div>
            <p className="text-sm text-gray-900">₹300 — Pay at the clinic</p>
            <p className="text-xs text-gray-500">No online payment now</p>
          </div>
          <input
            type="radio"
            name="pay"
            className="size-4 accent-blue-600"
            checked={value === "clinic"}
            onChange={() => onChange("clinic")}
          />
        </label>
      </div>

      <button onClick={onConfirm} className="mt-4 w-full rounded-md bg-primaryColor px-4 py-2 text-white hover:bg-primaryColor">
        {value === "online" ? "Pay & Confirm" : "Confirm Clinic Visit"}
      </button>

      <ol className="mt-4 list-decimal space-y-1 pl-5 text-xs text-gray-500">
        <li>Free cancellation/rescheduling up to 2 hours before appointment.</li>
        <li>After that, a fee may apply for changes.</li>
        <li>Updates will be sent to your phone.</li>
      </ol>
    </section>
  )
}
