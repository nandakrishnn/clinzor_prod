"use client"

export function Stepper({
  steps,
  current,
  onStepClick,
}: {
  steps: string[]
  current: number
  onStepClick?: (i: number) => void
}) {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
      {steps.map((label, i) => {
        const isActive = i === current
        const isDone = i < current
        return (
          <li key={label}>
            <button
              type="button"
              onClick={() => onStepClick?.(i)}
              className={[
                "w-full rounded-md border px-3 py-2 text-left text-sm transition",
                isActive
                  ? "border-primaryColor bg-blue-50 text-primaryColor"
                  : isDone
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
              ].join(" ")}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="font-medium">{label}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
