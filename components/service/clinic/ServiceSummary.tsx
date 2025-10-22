"use client"

type Props = {
  service: {
    name: string
    description: string
    image: string
  }
  sessionType: "CONSULTATION" | "TREATMENT" 
  onSessionTypeChange: (t: "CONSULTATION" |  "TREATMENT") => void
  consultationPrice: number 
  sessionPrice: number
}

export function ServiceSummary({ service, sessionType, onSessionTypeChange, consultationPrice, sessionPrice }: Props) {
  console.log(consultationPrice, sessionPrice)
  return (
    <div className="">
      <div className="">
        <p className="mb-2 text-sm font-medium text-gray-900">Select Type</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50">
            <span className="text-sm text-gray-700">Consultation — ₹ {consultationPrice}</span>
            <input
              type="radio"
              name="sessionType"
              className="size-4 accent-primaryColor"
              checked={sessionType === "CONSULTATION"}
              onChange={() => onSessionTypeChange("CONSULTATION")}
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50">
            <span className="text-sm text-gray-700">Session — ₹ {sessionPrice}</span>
            <input
              type="radio"
              name="sessionType"
              className="size-4 accent-primaryColor"
              checked={sessionType === "TREATMENT"}
              onChange={() => onSessionTypeChange("TREATMENT")}
            />
          </label>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Rates might change according to booking mode. Final price shown at review step.
        </p>
      </div>
    </div>
  )
}
