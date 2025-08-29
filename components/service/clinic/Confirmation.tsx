export function Confirmation({
  orderId,
  service,
  slot,
  patient,
  mode,
  total,
}: {
  orderId: string
  service: { title: string }
  slot: { label: string } | null
  patient: { name: string; phone: string }
  mode: "home" | "video" | "clinic"
  total: number
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Appointment Confirmed</h2>
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          ID: {orderId}
        </span>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="rounded-md border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            On <strong>your selected date</strong> at <strong>{slot?.label ?? "—"}</strong>
          </p>
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-900">{service.title}</p>
            <p className="text-xs text-gray-500">
              Mode: {mode === "clinic" ? "In-Clinic" : mode === "home" ? "Home Visit" : "Video Call"}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-900">Patient Details</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt>Name</dt>
              <dd>{patient.name || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Mobile</dt>
              <dd>{patient.phone || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Amount</dt>
              <dd>₹{total}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-primaryColor">
        Benefits: shorter wait times, verified fees and location.
      </div>

      <div className="mt-6">
        <a href="/booking" className="text-sm text-primaryColor hover:underline">
          Go back to results
        </a>
      </div>
    </section>
  )
}
