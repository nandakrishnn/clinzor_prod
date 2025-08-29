"use client"

import CommonHeroSection from "@/components/common/CommonHeroSection"
import FooterSection from "@/components/landingpage/footer/footer"
import { NavbarDemo } from "@/components/landingpage/navbar/navbar"
import { Confirmation } from "@/components/service/clinic/Confirmation"
import { CouponApply } from "@/components/service/clinic/CouponApply"
import { DateSlots } from "@/components/service/clinic/DateSlots"
import { DoctorPreference } from "@/components/service/clinic/DoctorPreference"
import { ModeSelector } from "@/components/service/clinic/ModeSelector"
import { OrderSummary } from "@/components/service/clinic/OrderSummary"
import { PatientForm } from "@/components/service/clinic/PatientForm"
import { PaymentOptions } from "@/components/service/clinic/PaymentOptions"
import PreviewCard from "@/components/service/clinic/PreviewCard"
import { ServiceSummary } from "@/components/service/clinic/ServiceSummary"
import { Stepper } from "@/components/service/clinic/Stepper"
import Navbar from "@/components/shared/NavBar"
import React from "react"

type BookingMode = "home" | "video" | "clinic"
type SessionType = "consultation" | "session"

type Slot = {
  dateKey: string
  label: string
  period: "morning" | "afternoon" | "evening" | "night"
}

type Service = {
  id: string
  title: string
  description: string
  image: string
  basePrices: { consultation: number; session: number }
}

type Coupon = { code: string; label: string; percent: number }

const DUMMY_SERVICE: Service = {
  id: "svc-1",
  title: "Acupuncture Consultation",
  description: "A 20 min consultation to understand your symptoms and plan your care.",
  image: "/abstract-service.png",
  basePrices: { consultation: 300, session: 800 },
}

const DUMMY_COUPONS: Coupon[] = [
  { code: "ONAM20", label: "Onam Offer — 20% off", percent: 20 },
  { code: "XMAS30", label: "Christmas Offer — 30% off", percent: 30 },
]

const DUMMY_SLOTS: Record<string, { dateTitle: string; availableCount: number; slots: Slot[] }> = {
  today: {
    dateTitle: "Today",
    availableCount: 24,
    slots: [
      { dateKey: "today", label: "10:00 AM", period: "morning" },
      { dateKey: "today", label: "10:20 AM", period: "morning" },
      { dateKey: "today", label: "11:00 AM", period: "morning" },
      { dateKey: "today", label: "11:20 AM", period: "morning" },
      { dateKey: "today", label: "12:00 PM", period: "afternoon" },
      { dateKey: "today", label: "12:40 PM", period: "afternoon" },
      { dateKey: "today", label: "04:00 PM", period: "evening" },
      { dateKey: "today", label: "05:00 PM", period: "evening" },
      { dateKey: "today", label: "06:10 PM", period: "evening" },
      { dateKey: "today", label: "08:00 PM", period: "night" },
    ],
  },
  tomorrow: {
    dateTitle: "Tomorrow",
    availableCount: 24,
    slots: [
      { dateKey: "tomorrow", label: "10:40 AM", period: "morning" },
      { dateKey: "tomorrow", label: "11:00 AM", period: "morning" },
      { dateKey: "tomorrow", label: "02:40 PM", period: "afternoon" },
      { dateKey: "tomorrow", label: "04:40 PM", period: "evening" },
      { dateKey: "tomorrow", label: "07:20 PM", period: "evening" },
      { dateKey: "tomorrow", label: "08:40 PM", period: "night" },
    ],
  },
  next: {
    dateTitle: "Sun, 31 Aug",
    availableCount: 24,
    slots: [
      { dateKey: "next", label: "11:40 AM", period: "morning" },
      { dateKey: "next", label: "03:20 PM", period: "afternoon" },
      { dateKey: "next", label: "05:40 PM", period: "evening" },
      { dateKey: "next", label: "07:40 PM", period: "evening" },
      { dateKey: "next", label: "09:00 PM", period: "night" },
    ],
  },
}

const STEPS = ["Service", "Mode", "Date & Time", "Details", "Review & Pay", "Done"]

const DUMMY_CLINIC = {
  name: "Sunrise Dental Clinic",
  address: "104, 2nd Cross, 1st Main, Koramangala, Bangalore",
}

export default function ClinicBooking() {
  // Global booking state (replace with API-fed state later)
  const [step, setStep] = React.useState(0)
  const [service] = React.useState<Service>(DUMMY_SERVICE)
  const [sessionType, setSessionType] = React.useState<SessionType>("consultation")
  const [mode, setMode] = React.useState<BookingMode>("clinic")
  const [selectedTab, setSelectedTab] = React.useState<keyof typeof DUMMY_SLOTS>("today")
  const [selectedSlot, setSelectedSlot] = React.useState<Slot | null>(null)
  const [genderPref, setGenderPref] = React.useState<"female" | "male" | "none">("none")
  const [patient, setPatient] = React.useState({
    name: "",
    email: "",
    phone: "",
    isSelf: true,
  })
  const [coupon, setCoupon] = React.useState<Coupon | null>(null)
  const [payMethod, setPayMethod] = React.useState<"online" | "clinic">("clinic")
  const [orderId, setOrderId] = React.useState<string | null>(null)

  const price = sessionType === "consultation" ? service.basePrices.consultation : service.basePrices.session
  const discount = coupon ? Math.round((price * coupon.percent) / 100) : 0
  const total = Math.max(price - discount, 0)
  const dateLabel = DUMMY_SLOTS[selectedTab].dateTitle
  const timeLabel = selectedSlot?.label || undefined
  const pref: "female" | "male" | "no-preference" =
    genderPref === "none" ? "no-preference" : (genderPref as "female" | "male")

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))
  const goto = (idx: number) => setStep(idx)

  function handleConfirm() {
    if (payMethod === "online") {
      console.log("[v0] Simulating online payment...")
      setTimeout(() => {
        setOrderId(`ORD-${Math.floor(Math.random() * 9_999_999)}`)
        next()
      }, 600)
    } else {
      setOrderId(`ORD-${Math.floor(Math.random() * 9_999_999)}`)
      next()
    }
  }

  return (
    <main className="">
      {/* Navbar */}
      <NavbarDemo />

      {/* Hero section */}
      <section className="pb-10 md:pb-16">
        <CommonHeroSection className="h-[15vh]" />
      </section>

      <section aria-label="Clinic Booking" className="space-y-6 max-w-7xl mx-auto mb-10 md:mb-20 px-3">
        <header className="flex items-center justify-between">
          <h1 className="text-pretty text-2xl font-semibold text-gray-900">Book an Appointment</h1>
          <span className="text-sm text-gray-500">
            Step {step + 1} of {STEPS.length}
          </span>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left sticky live preview */}
          <div className="md:col-span-1">
            <PreviewCard
              service={{
                title: service.title,
                description: service.description,
                imageUrl: service.image,
                basePrice: price,
              }}
              clinic={DUMMY_CLINIC}
              mode={mode}
              dateLabel={dateLabel}
              time={timeLabel}
              doctorPreference={pref}
              coupon={coupon ? { code: coupon.code, discountPct: coupon.percent } : null}
              totals={{ subtotal: price, discount, total }}
            />
          </div>

          {/* Right: stepper + step content */}
          <div className="space-y-6 md:col-span-2">
            <Stepper steps={STEPS} current={step} onStepClick={goto} />

            {step === 0 && (
              <div className="grid gap-6 md:grid-cols-3 ">
                <div className="md:col-span-2">
                  <ServiceSummary service={service} sessionType={sessionType} onSessionTypeChange={setSessionType} />
                </div>
                <aside className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-900">Price Summary</h3>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt>{sessionType === "consultation" ? "Consultation" : "Session"} fee</dt>
                      <dd>₹{price}</dd>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <dt>Coupon</dt>
                      <dd>-₹{discount}</dd>
                    </div>
                    <div className="mt-2 flex justify-between border-t pt-2 font-semibold text-gray-900">
                      <dt>To Pay</dt>
                      <dd>₹{total}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex justify-end">
                    <button onClick={next} className="rounded-md bg-primaryColor px-4 py-2 text-white hover:bg-primaryColor">
                      Continue
                    </button>
                  </div>
                </aside>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <ModeSelector value={mode} onChange={setMode} />
                <div className="flex items-center justify-between">
                  <button
                    onClick={back}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button onClick={next} className="rounded-md bg-primaryColor px-4 py-2 text-white hover:bg-primaryColor">
                    Choose Date & Time
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <DateSlots
                  tabs={DUMMY_SLOTS}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={back}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    disabled={!selectedSlot}
                    onClick={next}
                    className="rounded-md bg-primaryColor px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2">
                  <DoctorPreference value={genderPref} onChange={setGenderPref} />
                  <PatientForm value={patient} onChange={setPatient} />
                </div>
                <aside className="space-y-6">
                  <CouponApply
                    available={DUMMY_COUPONS}
                    applied={coupon}
                    onApply={setCoupon}
                    onRemove={() => setCoupon(null)}
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={back}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      disabled={!patient.name || !patient.phone}
                      onClick={next}
                      className="rounded-md bg-primaryColor px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Review & Pay
                    </button>
                  </div>
                </aside>
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-6 md:grid-cols-3">
                <OrderSummary
                  service={service}
                  sessionType={sessionType}
                  mode={mode}
                  slot={selectedSlot}
                  genderPref={genderPref}
                  coupon={coupon}
                  price={price}
                  discount={discount}
                  total={total}
                />
                <PaymentOptions
                  className="md:col-span-2"
                  value={payMethod}
                  onChange={setPayMethod}
                  onConfirm={handleConfirm}
                />
                <div className="md:col-span-3">
                  <button
                    onClick={back}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <Confirmation
                orderId={orderId || "—"}
                service={service}
                slot={selectedSlot}
                patient={patient}
                mode={mode}
                total={total}
              />
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section>
        <FooterSection />
      </section>
    </main>
  )
}
