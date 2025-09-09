"use client"

type Props = {
  value: "HOME_VISIT" | "VIDEO_CALL" | "PHYSICAL_VISIT"
  onChange: (m: "HOME_VISIT" | "VIDEO_CALL" | "PHYSICAL_VISIT") => void
}

export function ModeSelector({ value, onChange }: Props) {
  return (
    <div className="">
      <h3 className="text-sm font-medium text-gray-900">Booking Mode</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {(
          [
            { key: "HOME_VISIT", label: "Home Visit" },
            { key: "VIDEO_CALL", label: "Video Call" },
            { key: "PHYSICAL_VISIT", label: "In-Clinic" },
          ] as const
        ).map((opt) => (
          <label
            key={opt.key}
            className={[
              "flex cursor-pointer items-center justify-between rounded-md border p-3 transition",
              value === opt.key
                ? "border-primaryColor bg-blue-50 text-primaryColor"
                : "border-gray-200 bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            <span className="text-sm">{opt.label}</span>
            <input
              type="radio"
              name="mode"
              className="size-4 accent-primaryColor"
              checked={value === opt.key}
              onChange={() => onChange(opt.key)}
            />
          </label>
        ))}
      </div>
    </div>
  )
}
