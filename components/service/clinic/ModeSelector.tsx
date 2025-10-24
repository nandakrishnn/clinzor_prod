"use client"

type Props = {
  value: "HOME_VISIT" | "VIDEO_CALL" | "PHYSICAL_VISIT"
  onChange: (m: "HOME_VISIT" | "VIDEO_CALL" | "PHYSICAL_VISIT") => void
  clinicService: any
  serviceId: any
}

export function ModeSelector({ serviceId, clinicService, value, onChange }: Props) {
  const serviceTabs = [
    {
      id: "HOME_VISIT",
      label: "Home Service",
      consultationKey: "consultation_charge_home_visit",
      sessionKey: "treatment_charge_home_visit",
    },
    {
      id: "PHYSICAL_VISIT",
      label: "Clinic Visit",
      consultationKey: "consultation_charge_physical_visit",
      sessionKey: "treatment_charge_physical_visit",
    },
    {
      id: "VIDEO_CALL",
      label: "Online Service",
      consultationKey: "consultation_charge_video_call",
      sessionKey: "treatment_charge_video_call",
    },
  ]

  const getService = clinicService?.find(
    (service: any) => service?.service == serviceId
  )

  const availableTabs = serviceTabs.filter(
    (tab) =>
      getService?.[tab.consultationKey] !== null &&
      getService?.[tab.consultationKey] !== undefined &&
      getService?.[tab.sessionKey] !== null &&
      getService?.[tab.sessionKey] !== undefined
  )

  console.log(availableTabs, 'clinic service data')

  // If no available tabs, don't render anything or show a message
  if (availableTabs.length === 0) {
    return (
      <div className="">
        <h3 className="text-sm font-medium text-gray-900">Booking Mode</h3>
        <p className="mt-2 text-sm text-gray-500">No booking modes available for this service.</p>
      </div>
    )
  }

  return (
    <div className="">
      <h3 className="text-sm font-medium text-gray-900">Booking Mode</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {availableTabs.map((tab) => (
          <label
            key={tab.id}
            className={[
              "flex cursor-pointer items-center justify-between rounded-md border p-3 transition",
              value === tab.id
                ? "border-primaryColor bg-blue-50 text-primaryColor"
                : "border-gray-200 bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            <span className="text-sm">{tab.label}</span>
            <input
              type="radio"
              name="mode"
              className="size-4 accent-primaryColor"
              checked={value === tab.id}
              onChange={() => onChange(tab.id as "HOME_VISIT" | "VIDEO_CALL" | "PHYSICAL_VISIT")}
            />
          </label>
        ))}
      </div>
    </div>
  )
}