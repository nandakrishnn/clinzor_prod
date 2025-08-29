"use client"

type Props = {
  value: "home" | "video" | "clinic"
  onChange: (m: "home" | "video" | "clinic") => void
}

export function ModeSelector({ value, onChange }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-medium text-gray-900">Booking Mode</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {(
          [
            { key: "home", label: "Home Visit" },
            { key: "video", label: "Video Call" },
            { key: "clinic", label: "In-Clinic" },
          ] as const
        ).map((opt) => (
          <label
            key={opt.key}
            className={[
              "flex cursor-pointer items-center justify-between rounded-md border p-3 transition",
              value === opt.key
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            <span className="text-sm">{opt.label}</span>
            <input
              type="radio"
              name="mode"
              className="size-4 accent-blue-600"
              checked={value === opt.key}
              onChange={() => onChange(opt.key)}
            />
          </label>
        ))}
      </div>
    </div>
  )
}
