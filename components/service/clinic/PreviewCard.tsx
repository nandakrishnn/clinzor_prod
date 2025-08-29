"use client"

type PreviewProps = {
  service: {
    title: string
    description: string
    imageUrl?: string
    basePrice: number
  }
  clinic: {
    name: string
    address: string
  }
  mode?: "home" | "video" | "clinic"
  dateLabel?: string
  time?: string
  doctorPreference?: "female" | "male" | "no-preference"
  coupon?: { code: string; discountPct: number } | null
  totals: {
    subtotal: number
    discount: number
    total: number
  }
}

export default function PreviewCard({
  service,
  clinic,
  mode,
  dateLabel,
  time,
  doctorPreference,
  coupon,
  totals,
}: PreviewProps) {
  return (
    <aside className="rounded-lg border bg-card p-4 shadow-sm md:sticky md:top-6">
      <h2 className="mb-3 text-lg font-semibold">Live Preview</h2>

      <div className="flex items-center gap-3">
        <img
          src={service.imageUrl || "/placeholder.svg?height=64&width=64&query=service%20image"}
          alt="Selected service"
          className="size-16 rounded-md object-cover"
        />
        <div>
          <p className="font-medium">{service.title}</p>
          <p className="text-sm text-muted-foreground">{service.description}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div className="rounded-md border p-3">
          <p className="font-medium">Clinic</p>
          <p className="text-muted-foreground">{clinic.name}</p>
          <p className="text-muted-foreground">{clinic.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Info label="Mode" value={mode ? labelForMode(mode) : "—"} />
          <Info label="Doctor preference" value={prettyPref(doctorPreference)} />
          <Info label="Date" value={dateLabel || "—"} />
          <Info label="Time" value={time || "—"} />
        </div>

        <div className="rounded-md border p-3">
          <p className="mb-2 font-medium">Amount Summary</p>
          <Row label="Base price" value={`₹ ${totals.subtotal}`} />
          <Row label={`Coupon ${coupon ? `(${coupon.code})` : ""}`} value={coupon ? `- ₹ ${totals.discount}` : "—"} />
          <div className="mt-2 flex items-center justify-between border-t pt-2 font-semibold">
            <span>Total</span>
            <span>₹ {totals.total}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function labelForMode(m?: "home" | "video" | "clinic") {
  if (!m) return "—"
  return m === "home" ? "Home visit" : m === "video" ? "Video call" : "In-clinic"
}

function prettyPref(p?: "female" | "male" | "no-preference") {
  if (!p) return "—"
  if (p === "no-preference") return "No preference"
  return p === "female" ? "Prefer Female" : "Prefer Male"
}
