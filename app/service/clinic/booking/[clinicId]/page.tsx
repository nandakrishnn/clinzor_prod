"use client"

import React, { useEffect, useState } from "react"
import FooterSection from "@/components/landingpage/footer/footer"
import { NavbarDemo } from "@/components/landingpage/navbar/navbar"
import { Confirmation } from "@/components/service/clinic/Confirmation"
import { CouponApply } from "@/components/service/clinic/CouponApply"
import { DateSlots, transformApiDataToTabs } from "@/components/service/clinic/DateSlots"
import { DoctorPreference } from "@/components/service/clinic/DoctorPreference"
import { ModeSelector } from "@/components/service/clinic/ModeSelector"
import { OrderSummary } from "@/components/service/clinic/OrderSummary"
import { PatientForm } from "@/components/service/clinic/PatientForm"
import { PaymentOptions } from "@/components/service/clinic/PaymentOptions"
import { ServiceSummary } from "@/components/service/clinic/ServiceSummary"
import { Stepper } from "@/components/service/clinic/Stepper"
import { getAClinicDetailed, getAService, getCouponService, getServiceCharges, getServiceSlots } from "@/service/user/sevicePage"
import { useSearchParams } from "next/navigation"

import PreviewCard from "@/components/service/clinic/PreviewCard"
import CommonHeroSection from "@/components/common/CommonHeroSection"
import { useSession } from "next-auth/react"

type clinicBookingProps = {
  params: {
    clinicId: string
  }
}

type SessionType = "CONSULTATION" | "SESSION"

type Slot = {
  uuid: string
  dateKey: string
  label: string
  period: "morning" | "afternoon" | "evening" | "night"
}

type TabData = {
  dateTitle: string;
  availableCount: number;
  slots: Slot[];
};

type PatientProps = {
  email?: string
  name: string
  phone_number: string
}

type Tabs = Record<string, TabData>;

type Coupon = {
  uuid: string;
  title: string;
  description: string;
  discount_percentage: string | null;
  flat_discount_amt: number | null;
  valid_from: string;
  valid_to: string;
}

const STEPS = ["Service & Mode", "Date & Time", "Details", "Review & Pay", "Done"]

export default function ClinicBooking({ params }: clinicBookingProps) {
  const paramsData = useSearchParams()
  const serviceId = paramsData.get("serviceId");
  const serviceType = paramsData.get("selectedService");
  const clinicId = params.clinicId
  const { data: session } = useSession()

  // console.log(serviceId, serviceType, clinicId, session, 'service id get from the params');

  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = React.useState(0)
  const [service, setService] = React.useState<any>({})
  const [clinic, setClinic] = useState<any>({})
  const [priceData, setPriceData] = useState<any>({})
  const [slotsData, setSlotsData] = useState<any>({})

  const [sessionType, setSessionType] = React.useState<SessionType>("CONSULTATION")
  const [mode, setMode] = React.useState<any>(serviceType)
  const [tabs, setTabs] = React.useState<Tabs>({});
  const [selectedTab, setSelectedTab] = React.useState<string>("")
  const [selectedSlot, setSelectedSlot] = React.useState<Slot | null>(null)
  const [genderPref, setGenderPref] = React.useState<"female" | "male" | "none">("none")
  const [patient, setPatient] = React.useState<PatientProps>({
    name: "",
    phone_number: "",
    email: "",
  })
  const [coupon, setCoupon] = React.useState<Coupon | null>(null)
  const [allCoupon, setAllCoupon] = React.useState<Coupon[]>([])
  const [payMethod, setPayMethod] = React.useState<"online" | "clinic">("clinic")
  const [orderId, setOrderId] = React.useState<string | null>(null)

  const getPriceFromServiceCharges = (sessionType: SessionType, mode: string) => {
    if (!priceData) return 0;

    const baseKey = sessionType === "CONSULTATION" ? "consultation" : "treatment";
    const modeKey = mode === "HOME_VISIT" ? "home_visit" : mode === "VIDEO_CALL" ? "video_call" : "clinic";

    const minKey = `min_${baseKey}_charge_${modeKey}` as keyof typeof priceData;
    const maxKey = `max_${baseKey}_charge_${modeKey}` as keyof typeof priceData;

    const minPrice = priceData[minKey];
    const maxPrice = priceData[maxKey];

    if (minPrice && maxPrice && minPrice === maxPrice) {
      return parseFloat(minPrice);
    }

    if (minPrice && maxPrice) {
      return maxPrice;
    }

    return 0;
  };

  const calculateDiscount = (price: number, coupon: Coupon | null) => {
    if (!coupon) return 0;

    if (coupon.discount_percentage) {
      const percentage = parseFloat(coupon.discount_percentage);
      return Math.round((price * percentage) / 100);
    } else if (coupon.flat_discount_amt) {
      return coupon.flat_discount_amt;
    }

    return 0;
  };

  const price = getPriceFromServiceCharges(sessionType, mode);
  const discount = calculateDiscount(price, coupon);
  const total = Math.max(price - discount, 0);

  const dateLabel = tabs[selectedTab]?.dateTitle || ""
  const timeLabel = selectedSlot?.label || undefined
  const pref: "female" | "male" | "no-preference" = genderPref === "none" ? "no-preference" : (genderPref as "female" | "male")

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

  const getConsultationPrice = (mode: string) => {
    return getPriceFromServiceCharges("CONSULTATION", mode);
  };

  const getSessionPrice = (mode: string) => {
    return getPriceFromServiceCharges("SESSION", mode);
  };

  const getService = async (id: string) => {
    try {
      const res = await getAService(id)
      if (res?.status === 200) {
        setService(res?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getClinic = async () => {
    try {
      const res = await getAClinicDetailed(clinicId)
      console.log(res, 'from the data clinic')
      if (res?.status === 200) {
        setClinic(res?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getServiceChanges = async (id: string) => {
    try {
      const res = await getServiceCharges(id)
      console.log(res, 'service changes')
      if (res?.status === 200) {
        setPriceData(res?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSlotService = async (serviceId: string) => {
    try {
      const res = await getServiceSlots(clinicId, mode, serviceId)
      console.log(res.data, 'from the slot in the booking')
      if (res?.status === 200) {
        setSlotsData(res?.data)
        const transformedTabs = transformApiDataToTabs(res?.data)
        setTabs(transformedTabs)

        const firstTabKey = Object.keys(transformedTabs)[0]
        if (firstTabKey) {
          setSelectedTab(firstTabKey)
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCoupon = async (serviceId: string) => {
    try {
      const res = await getCouponService(serviceId)
      if (res?.status === 200) {
        setAllCoupon(res?.data?.data || [])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getClinic()
    if (serviceId) {
      getService(serviceId)
      getServiceChanges(serviceId)
      getSlotService(serviceId)
      getCoupon(serviceId)
    }
  }, [mode, serviceId])

  useEffect(() => {
    if (session?.user) {
      setPatient(
        {
          name: session.user.name || "",
          phone_number: session?.user?.phone_number || "",
          email: session?.user?.email || "",
        }
      )
    }
  }, [session])


  return (
    <section aria-label="Clinic Booking" className="">
      <nav>
        <NavbarDemo />
      </nav>
      {/* Hero section */}
      <section className="pb-10">
        <CommonHeroSection className="h-[15vh]" />
      </section>

      <section className="pb-10 md:mb-20 max-w-7xl mx-auto ">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left sticky live preview */}
          <div className="md:col-span-1">
            <PreviewCard
              service={{
                title: service?.name,
                description: service?.description,
                imageUrl: service?.image || '/clinic.png',
                basePrice: price,
              }}
              clinic={clinic?.clinic}
              mode={mode}
              dateLabel={dateLabel}
              time={timeLabel}
              doctorPreference={pref}
              coupon={coupon ? {
                code: coupon.title,
                discountPct: coupon.discount_percentage ? parseFloat(coupon.discount_percentage) : null,
                flatDiscount: coupon.flat_discount_amt
              } : null}
              totals={{ subtotal: price, discount, total }}
            />
          </div>

          {/* Right: stepper + step content */}
          <div className="space-y-6 md:col-span-2">
            <Stepper steps={STEPS} current={step} onStepClick={goto} />

            {step === 0 && (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2 rounded-lg border border-gray-200 bg-white p-4">
                  <ServiceSummary
                    consultationPrice={getConsultationPrice(mode)}
                    sessionPrice={getSessionPrice(mode)}
                    service={service}
                    sessionType={sessionType}
                    onSessionTypeChange={setSessionType}
                  />
                  <ModeSelector value={mode} onChange={setMode} />
                </div>
                <aside className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col justify-between">
                  <dl className="space-y-1 text-sm">
                    <h3 className="mb-2 text-sm font-medium text-gray-900">Price Summary</h3>
                    <div className="flex justify-between">
                      <dt>{sessionType === "CONSULTATION" ? "Consultation" : "Session"} fee</dt>
                      <dd>₹ {price}</dd>
                    </div>
                    <div className="flex justify-between text-gray-500 pb-2">
                      <dt>Coupon</dt>
                      <dd>-₹ {discount}</dd>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-b pt-2 pb-2 font-semibold text-gray-900">
                      <dt>To Pay</dt>
                      <dd>₹ {total}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex justify-center items-center">
                    <button onClick={next} className="rounded-md w-full bg-primaryColor px-5 py-2 text-white hover:bg-primaryColor">
                      Choose Date & Time
                    </button>
                  </div>
                </aside>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <DateSlots
                  tabs={tabs}
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
                    className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2">
                  <DoctorPreference value={genderPref} onChange={setGenderPref} />
                  <PatientForm value={patient} onChange={setPatient} />
                </div>
                <aside className="space-y-6">
                  <CouponApply
                    available={allCoupon}
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
                      disabled={!patient?.name || !patient?.phone_number}
                      onClick={next}
                      className="rounded-md bg-primaryColor px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Review & Pay
                    </button>
                  </div>
                </aside>
              </div>
            )}

            {step === 3 && (
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

            {step === 4 && (
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
    </section>
  )
}