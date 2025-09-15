"use client"

export function DoctorPreference({
  value,
  onChange,
}: {
  value: "FEMALE" | "MALE" | "NONE"
  onChange: (v: "FEMALE" | "MALE" | "NONE") => void
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-medium text-gray-900">Preferred Doctor Gender</h3>
      <p className="mt-1 text-xs text-gray-500">This is a preference; we will try to accommodate it.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {(
          [
            { key: "FEMALE", label: "Prefer Female" },
            { key: "MALE", label: "Prefer Male" },
            { key: "NONE", label: "No Preference" },
          ] as const
        ).map((opt) => (
          <label
            key={opt.key}
            className={[
              "flex cursor-pointer items-center justify-between rounded-md border p-3",
              value === opt.key
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            <span className="text-sm">{opt.label}</span>
            <input
              type="radio"
              name="gender-pref"
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
