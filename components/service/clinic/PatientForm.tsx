"use client"

type Patient = {
  name?: string
  email?: string
  phone_number?: string
}

export function PatientForm({
  value,
  onChange,
}: {
  value: Patient
  onChange: (p: any) => void
}) {
  function set<K extends keyof Patient>(k: K, v: Patient[K]) {
    onChange({ ...value, [k]: v })
  }
  return (
    <form className="rounded-lg border border-gray-200 bg-white p-4" onSubmit={(e) => e.preventDefault()}>
      <h3 className="text-sm font-medium text-gray-900">Patient Details</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-gray-700">Full Name</span>
          <input
            type="text"
            value={value?.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            placeholder="Enter full name"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-gray-700">Mobile</span>
          <input
            type="tel"
            value={value?.phone_number}
            onChange={(e) => set("phone_number", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            placeholder="+91XXXXXXXXXX"
            required
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-gray-700">Email (optional)</span>
          <input
            type="email"
            value={value?.email}
            onChange={(e) => set("email", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            placeholder="name@example.com"
          />
        </label>
      </div>

      {/* <fieldset className="mt-3">
        <legend className="mb-2 text-sm text-gray-700">This appointment is for:</legend>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2 pr-3 text-sm">
            <input
              type="radio"
              className="size-4 accent-blue-600"
              checked={value?.isSelf}
              onChange={() => set("isSelf", true)}
            />
            <span>Myself</span>
          </label>
          <label className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2 pr-3 text-sm">
            <input
              type="radio"
              className="size-4 accent-blue-600"
              checked={!value?.isSelf}
              onChange={() => set("isSelf", false)}
            />
            <span>Someone else</span>
          </label>
        </div>
      </fieldset> */}
    </form>
  )
}
