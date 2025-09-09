"use client"

type Props = {
  service: {
    name: string
    description: string
    image: string
  }
  sessionType: "CONSULTATION" | "SESSION"
  onSessionTypeChange: (t: "CONSULTATION" | "SESSION") => void
  consultationPrice: number 
  sessionPrice: number
}

export function ServiceSummary({ service, sessionType, onSessionTypeChange, consultationPrice, sessionPrice }: Props) {
  return (
    <div className="">
      <div className="flex items-start gap-4">
        <img
          src={service.image || "/placeholder.svg?height=64&width=64&query=service%20image"}
          alt="Service"
          className="size-16 rounded-md bg-gray-100"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{service?.name}</h2>
          <p className="mt-1 text-sm text-gray-600">{service?.description}</p>
        </div>
      </div>
      <div className="mt-5">
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
              checked={sessionType === "SESSION"}
              onChange={() => onSessionTypeChange("SESSION")}
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
