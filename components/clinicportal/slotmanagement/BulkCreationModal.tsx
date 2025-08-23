"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Copy, Check, Plus, Trash2, Save, Edit3, Clock, Eye } from "lucide-react"
import { createClinicBlukSlot } from "@/service/clinic/slotManagementService"
import type { ClinicService } from "@/types/common"
import { Settings, Calendar, CheckCircle } from "lucide-react";

interface BulkCreationModalProps {
  showBulkForm: boolean
  setShowBulkForm: (show: boolean) => void
  currentPage: number
  fetchSlots: (page?: number) => void
  clinicServices: ClinicService[]
}

interface TimeSlot {
  start_time: string
  end_time: string
  max_bookings: number
  female_doctors: number
  is_video_call: boolean
  is_physical_visit: boolean
}

interface DaySlots {
  date: string
  dayName: string
  slots: TimeSlot[]
}

const TimePicker: React.FC<{
  value: string
  onChange: (time: string) => void
  className?: string
}> = ({ value, onChange, className = "" }) => {
  const [hour, setHour] = useState("09")
  const [minute, setMinute] = useState("00")
  const [period, setPeriod] = useState("AM")

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":")
      const hourNum = Number.parseInt(h)
      const period = hourNum >= 12 ? "PM" : "AM"
      const hour12 = hourNum % 12 || 12

      setHour(hour12.toString().padStart(2, "0"))
      setMinute(m)
      setPeriod(period)
    }
  }, [value])

  const handleTimeChange = (newHour: string, newMinute: string, newPeriod: string) => {
    let hour24 = Number.parseInt(newHour)
    if (newPeriod === "PM" && hour24 !== 12) {
      hour24 += 12
    } else if (newPeriod === "AM" && hour24 === 12) {
      hour24 = 0
    }

    const time24 = `${hour24.toString().padStart(2, "0")}:${newMinute}`
    onChange(time24)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
        <select
          value={hour}
          onChange={(e) => {
            setHour(e.target.value)
            handleTimeChange(e.target.value, minute, period)
          }}
          className="px-3 py-2 border-none outline-none focus:ring-0 bg-transparent"
        >
          {Array.from({ length: 12 }, (_, i) => {
            const h = (i + 1).toString().padStart(2, "0")
            return (
              <option key={h} value={h}>
                {h}
              </option>
            )
          })}
        </select>
        <span className="text-gray-500">:</span>
        <select
          value={minute}
          onChange={(e) => {
            setMinute(e.target.value)
            handleTimeChange(hour, e.target.value, period)
          }}
          className="px-3 py-2 border-none outline-none focus:ring-0 bg-transparent"
        >
          {["00", "15", "30", "45"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value)
            handleTimeChange(hour, minute, e.target.value)
          }}
          className="px-3 py-2 border-none outline-none focus:ring-0 bg-transparent text-sm"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  )
}

interface TimePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  slot: TimeSlot
  dayName: string
  date: string
}

const TimePreviewModal: React.FC<TimePreviewModalProps> = ({ isOpen, onClose, slot, dayName, date }) => {
  if (!isOpen) return null

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr)
    return {
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }
  }

  const startTime = formatDateTime(slot.start_time)
  const endTime = formatDateTime(slot.end_time)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gray-900 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <h3 className="text-xl font-bold">Time Slot Preview</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-800">{dayName}</h4>
            <p className="text-sm text-gray-600">{startTime.date}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Time</span>
              <span className="text-lg font-bold text-gray-900">
                {startTime.time} - {endTime.time}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Max Bookings</span>
              <span className="text-sm font-semibold text-gray-900">{slot.max_bookings}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Female Doctors</span>
              <span className="text-sm font-semibold text-gray-900">{slot.female_doctors}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Service Types</span>
              <div className="flex gap-1">
                {slot.is_video_call && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Video</span>
                )}
                {slot.is_physical_visit && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Physical</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BulkCreationModal: React.FC<BulkCreationModalProps> = ({
  showBulkForm,
  setShowBulkForm,
  currentPage,
  fetchSlots,
  clinicServices,
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const [slotType, setSlotType] = useState<"PHYSICAL_OR_VIDEO" | "HOME_VISIT" | "">("")
  const [showBasicConfig, setShowBasicConfig] = useState(false)
  const [previewSlot, setPreviewSlot] = useState<{ slot: TimeSlot; dayName: string; date: string } | null>(null)
  const [reviewDayIndex, setReviewDayIndex] = useState(0)
  const [selectedSlots, setSelectedSlots] = useState<number[]>([])
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  // Step 1 data
  const [femaleDoctors, setFemaleDoctors] = useState(2)
  const [maxBookings, setMaxBookings] = useState(6)
  const [isVideo, setIsVideo] = useState(true)
  const [isPhysical, setIsPhysical] = useState(true)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")

  // Step 2 data - days and slots
  const [days, setDays] = useState<DaySlots[]>([])
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null)

  // Step 3 data - copy to other days
  const [copyDays, setCopyDays] = useState<{ date: string; dayName: string; selected: boolean }[]>([])
  const [copyForDays, setCopyForDays] = useState(0)

  // Convert time to 12-hour format
  const to12HourFormat = (time: string) => {
    const [hours, minutes] = time.split(":")
    const h = Number.parseInt(hours)
    const period = h >= 12 ? "PM" : "AM"
    const hour12 = h % 12 || 12
    return `${hour12}:${minutes} ${period}`
  }

  // Convert time to 24-hour format
  const to24HourFormat = (time12: string) => {
    const [time, period] = time12.split(" ")
    let [hours, minutes] = time.split(":")

    if (period === "PM" && hours !== "12") {
      hours = (Number.parseInt(hours) + 12).toString()
    } else if (period === "AM" && hours === "12") {
      hours = "00"
    }

    return `${hours.padStart(2, "0")}:${minutes}`
  }

  // Initialize days for the next 7 days
  useEffect(() => {
    if (activeStep === 1 && slotType) {
      const today = new Date()
      const nextDays = []

      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(today.getDate() + i)
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
        const dateStr = date.toISOString().split("T")[0]

        // Generate time slots based on start and end time
        const slots = generateTimeSlots(dateStr, startTime, endTime)

        nextDays.push({
          date: dateStr,
          dayName,
          slots,
        })
      }

      setDays(nextDays)
      setSelectedDayIndex(0)
    }
  }, [activeStep, slotType, startTime, endTime])

  // Initialize copy days
  useEffect(() => {
    if (activeStep === 2) {
      const copyDaysData = days.map((day) => ({
        date: day.date,
        dayName: day.dayName,
        selected: false,
      }))
      setCopyDays(copyDaysData)
    }
  }, [activeStep, days])

  // Generate time slots based on start and end time
  const generateTimeSlots = (date: string, start: string, end: string): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = Number.parseInt(start.split(":")[0])
    const endHour = Number.parseInt(end.split(":")[0])

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`

      slots.push({
        start_time: `${date}T${startTime}`,
        end_time: `${date}T${endTime}`,
        max_bookings: maxBookings,
        female_doctors: femaleDoctors,
        is_video_call: isVideo,
        is_physical_visit: isPhysical,
      })
    }

    return slots
  }

  // Handle day selection in step 2
  const handleDaySelect = (index: number) => {
    setSelectedDayIndex(index)
    setEditingSlotIndex(null)
  }

  // Handle slot editing
  const handleEditSlot = (index: number) => {
    setEditingSlotIndex(index)
  }

  // Handle slot changes
  const handleSlotChange = (field: string, value: any) => {
    if (editingSlotIndex === null) return

    const updatedDays = [...days]
    const day = updatedDays[selectedDayIndex]

    day.slots[editingSlotIndex] = {
      ...day.slots[editingSlotIndex],
      [field]: value,
    }

    setDays(updatedDays)
  }

  // Handle time change (converting from 12-hour format)
  const handleTimeChange = (field: "start_time" | "end_time", time24: string) => {
    if (editingSlotIndex === null) return

    const updatedDays = [...days]
    const day = updatedDays[selectedDayIndex]
    const slot = day.slots[editingSlotIndex]

    const datePart = slot[field].split("T")[0]

    day.slots[editingSlotIndex] = {
      ...slot,
      [field]: `${datePart}T${time24}`,
    }

    setDays(updatedDays)
  }

  // Remove a slot
  const removeSlot = (index: number) => {
    const updatedDays = [...days]
    const day = updatedDays[selectedDayIndex]

    day.slots.splice(index, 1)
    setDays(updatedDays)
    setEditingSlotIndex(null)
  }

  // Add a new slot
  const addNewSlot = () => {
    const updatedDays = [...days]
    const day = updatedDays[selectedDayIndex]

    // Get the last slot's end time as the new start time
    const lastSlot = day.slots[day.slots.length - 1]
    const lastEndTime = new Date(lastSlot.end_time)

    const newStartTime = new Date(lastEndTime)
    const newEndTime = new Date(lastEndTime)
    newEndTime.setHours(newEndTime.getHours() + 1)

    const newSlot: TimeSlot = {
      start_time: newStartTime.toISOString().split(".")[0],
      end_time: newEndTime.toISOString().split(".")[0],
      max_bookings: maxBookings,
      female_doctors: femaleDoctors,
      is_video_call: isVideo,
      is_physical_visit: isPhysical,
    }

    day.slots.push(newSlot)
    setDays(updatedDays)
    setEditingSlotIndex(day.slots.length - 1)
  }

  // Handle copy days selection
  const handleCopyDaySelect = (index: number) => {
    const updatedCopyDays = [...copyDays]
    updatedCopyDays[index].selected = !updatedCopyDays[index].selected
    setCopyDays(updatedCopyDays)
  }

  // Apply the template to selected days
  const applyToSelectedDays = () => {
    const template = days[selectedDayIndex].slots
    const updatedDays = [...days]

    copyDays.forEach((day, index) => {
      if (day.selected) {
        updatedDays[index].slots = template.map((slot) => ({
          ...slot,
          start_time: slot.start_time.replace(/.*T/, `${day.date}T`),
          end_time: slot.end_time.replace(/.*T/, `${day.date}T`),
        }))
      }
    })

    setDays(updatedDays)
    setActiveStep(1) // Back to day selection
  }

  // Apply template for N days
  const applyForNDays = () => {
    if (copyForDays <= 0) return

    const template = days[selectedDayIndex].slots
    const updatedDays = [...days]
    const today = new Date()

    for (let i = 0; i < copyForDays && i < 30; i++) {
      // Limit to 30 days max
      const date = new Date()
      date.setDate(today.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" })

      // Find or create day entry
      let dayIndex = updatedDays.findIndex((d) => d.date === dateStr)
      if (dayIndex === -1) {
        updatedDays.push({
          date: dateStr,
          dayName,
          slots: [],
        })
        dayIndex = updatedDays.length - 1
      }

      // Apply template
      updatedDays[dayIndex].slots = template.map((slot) => ({
        ...slot,
        start_time: slot.start_time.replace(/.*T/, `${dateStr}T`),
        end_time: slot.end_time.replace(/.*T/, `${dateStr}T`),
      }))
    }

    setDays(updatedDays)
    setActiveStep(1) // Back to day selection
  }

  // Submit all data to backend
  const submitBulkSlots = async () => {
    try {
      // Collect all slots from all days
      const allSlots: any[] = []
      days.forEach((day) => {
        day.slots.forEach((slot) => {
          allSlots.push({
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_bookings: slot.max_bookings,
            female_doctors: slot.female_doctors,
            is_video_call: slot.is_video_call,
            is_physical_visit: slot.is_physical_visit,
            is_home_visit: slotType === "HOME_VISIT",
          })
        })
      })

      const payload = {
        clinic: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
        slot_type: slotType,
        slot_list: allSlots,
      }

      await createClinicBlukSlot(payload)
      setShowBulkForm(false)
      setActiveStep(0)
      setSlotType("")
      fetchSlots(currentPage)
    } catch (error) {
      console.error("Error creating bulk slots:", error)
    }
  }

  const handleSlotSelection = (slotIndex: number) => {
    setSelectedSlots((prev) => (prev.includes(slotIndex) ? prev.filter((i) => i !== slotIndex) : [...prev, slotIndex]))
  }

  const navigateReviewDay = (direction: "prev" | "next") => {
    if (direction === "prev" && reviewDayIndex > 0) {
      setReviewDayIndex((prev) => prev - 1)
    } else if (direction === "next" && reviewDayIndex < days.length - 1) {
      setReviewDayIndex((prev) => prev + 1)
    }
  }

  if (!showBulkForm) return null

const steps = [
  {
    id: 0,
    title: "Setup",
    subtitle: "Choose slot type & basic settings",
    icon: <Settings className="w-6 h-6" />,
  },
  {
    id: 1,
    title: "Configure",
    subtitle: "Set up days & time slots",
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    id: 2,
    title: "Copy",
    subtitle: "Apply to multiple days",
    icon: <Copy className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "Review",
    subtitle: "Confirm & create slots",
    icon: <CheckCircle className="w-6 h-6" />,
  },
];

  const handleSlotTypeSelect = (type: "PHYSICAL_OR_VIDEO" | "HOME_VISIT") => {
    setSlotType(type)
    setShowBasicConfig(true)
  }

  const handleTimePreview = (slot: TimeSlot, dayName: string, date: string) => {
    setPreviewSlot({ slot, dayName, date })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto flex flex-col">
        <div className="bg-gray-900 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Bulk Create Slots</h2>
              <p className="text-gray-300 mt-1">Create multiple appointment slots efficiently</p>
            </div>
            <button
              onClick={() => setShowBulkForm(false)}
              className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center relative">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
              <div
                className="h-full bg-gray-800 transition-all duration-500 ease-out"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    activeStep === index
                      ? "bg-gray-800 text-white shadow-lg scale-110"
                      : index < activeStep
                        ? "bg-gray-600 text-white shadow-md"
                        : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {index < activeStep ? <Check size={20} /> : step.icon}
                </div>
                <div className="mt-3 text-center">
                  <div
                    className={`font-semibold text-sm ${
                      activeStep === index ? "text-gray-800" : index < activeStep ? "text-gray-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 max-w-[100px]">{step.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Step 1: Select Slot Type and Basic Info */}
          {activeStep === 0 && (
            <div className="space-y-8">
              {!showBasicConfig ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Slot Type</h3>
                    <p className="text-gray-600">Select the type of appointment slots you want to create</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => handleSlotTypeSelect("PHYSICAL_OR_VIDEO")}
                      className="p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-all duration-300 hover:shadow-lg group"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                          <span className="text-2xl">🏥</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">Physical or Video</h4>
                        <p className="text-gray-600 text-sm">Appointments at clinic location or via video call</p>
                      </div>
                    </div>

                    <div
                      onClick={() => handleSlotTypeSelect("HOME_VISIT")}
                      className="p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-all duration-300 hover:shadow-lg group"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                          <span className="text-2xl">🏠</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">Home Visit</h4>
                        <p className="text-gray-600 text-sm">Doctor visits patient at their home</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Basic Configuration</h3>
                    <p className="text-gray-600">Set up your slot preferences and operating hours</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Female Doctors Available</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={femaleDoctors}
                          onChange={(e) => setFemaleDoctors(Number.parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Max Bookings per Slot</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={maxBookings}
                          onChange={(e) => setMaxBookings(Number.parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {slotType === "PHYSICAL_OR_VIDEO" && (
                      <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Service Types Available
                        </label>
                        <div className="flex gap-6">
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isVideo}
                              onChange={(e) => setIsVideo(e.target.checked)}
                              className="w-5 h-5 rounded text-gray-600 focus:ring-gray-500 transition-all duration-200"
                            />
                            <span className="ml-3 text-gray-700 group-hover:text-gray-800 transition-colors">
                              Video Consultation
                            </span>
                          </label>
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isPhysical}
                              onChange={(e) => setIsPhysical(e.target.checked)}
                              className="w-5 h-5 rounded text-gray-600 focus:ring-gray-500 transition-all duration-200"
                            />
                            <span className="ml-3 text-gray-700 group-hover:text-gray-800 transition-colors">
                              Physical Visit
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <h5 className="text-sm font-semibold text-gray-700 mb-4">Operating Hours</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-600">Start Time</label>
                          <TimePicker value={startTime} onChange={setStartTime} className="w-full" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-600">End Time</label>
                          <TimePicker value={endTime} onChange={setEndTime} className="w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Days and Slots */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Configure Days & Slots</h3>
                <p className="text-gray-600">Set up your appointment slots for each day</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                {/* Days Cards */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-6 hide-scrollbar justify-content-center items-center">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      onClick={() => handleDaySelect(index)}
                      className={`min-w-[110px] p-4 rounded-xl border-2 flex flex-col items-center cursor-pointer transition-all duration-300 ${
                        selectedDayIndex === index
                          ? "border-gray-800 bg-gray-100 shadow-md"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <span className="font-bold text-gray-800">{day.dayName.substring(0, 3)}</span>
                      <span className="text-sm text-gray-600 mt-1">{day.date.split("-")[2]}</span>
                      <span className="text-xs text-gray-500 mt-1">{day.slots.length} slots</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-600">{selectedSlots.length} slots selected</div>
                  <button
                    onClick={addNewSlot}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm flex items-center gap-2 transition-all duration-200"
                  >
                    <Plus size={16} />
                    Add Slot
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {days[selectedDayIndex]?.slots.map((slot, index) => {
                    const start = new Date(slot.start_time)
                    const end = new Date(slot.end_time)
                    const startTime12 = to12HourFormat(start.toTimeString().substring(0, 5))
                    const endTime12 = to12HourFormat(end.toTimeString().substring(0, 5))
                    const isSelected = selectedSlots.includes(index)

                    return (
                      <div
                        key={index}
                        className={`p-4 border-2 rounded-xl relative cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-gray-800 bg-gray-100 shadow-md"
                            : "border-gray-200 hover:border-gray-400 bg-white"
                        }`}
                        onClick={() => handleSlotSelection(index)}
                      >
                        {editingSlotIndex === index ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-800">
                                {startTime12} - {endTime12}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingSlotIndex(null)
                                  }}
                                  className="text-green-600 hover:text-green-800 p-1 rounded-lg hover:bg-green-50 transition-all duration-200"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeSlot(index)
                                  }}
                                  className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            <div onClick={(e) => e.stopPropagation()}>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">Start Time</label>
                                  <TimePicker
                                    value={start.toTimeString().substring(0, 5)}
                                    onChange={(time) => handleTimeChange("start_time", time)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">End Time</label>
                                  <TimePicker
                                    value={end.toTimeString().substring(0, 5)}
                                    onChange={(time) => handleTimeChange("end_time", time)}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">Max Bookings</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={slot.max_bookings}
                                    onChange={(e) =>
                                      handleSlotChange("max_bookings", Number.parseInt(e.target.value) || 1)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">Female Doctors</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={slot.female_doctors}
                                    onChange={(e) =>
                                      handleSlotChange("female_doctors", Number.parseInt(e.target.value) || 0)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                  />
                                </div>
                              </div>

                              {slotType === "PHYSICAL_OR_VIDEO" && (
                                <div className="mt-3">
                                  <label className="block text-xs font-medium text-gray-600 mb-2">Service Types</label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={slot.is_video_call}
                                        onChange={(e) => handleSlotChange("is_video_call", e.target.checked)}
                                        className="rounded text-gray-600 focus:ring-gray-500"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">Video</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={slot.is_physical_visit}
                                        onChange={(e) => handleSlotChange("is_physical_visit", e.target.checked)}
                                        className="rounded text-gray-600 focus:ring-gray-500"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">Physical</span>
                                    </label>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center">
                                <Check size={14} />
                              </div>
                            )}

                            <div className="font-bold text-lg text-gray-800">
                              {startTime12} - {endTime12}
                            </div>
                            <div className="text-sm text-gray-600 mt-2 space-y-1">
                              <div>
                                Max Bookings: <span className="font-medium">{slot.max_bookings}</span>
                              </div>
                              <div>
                                Female Doctors: <span className="font-medium">{slot.female_doctors}</span>
                              </div>
                              {slotType === "PHYSICAL_OR_VIDEO" && (
                                <div className="flex gap-2 mt-2">
                                  {slot.is_video_call && (
                                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                                      Video
                                    </span>
                                  )}
                                  {slot.is_physical_visit && (
                                    <span className="px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded-full">
                                      Physical
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditSlot(index)
                              }}
                              className="absolute bottom-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200"
                            >
                              <Edit3 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Copy to Other Days */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Copy to Other Days</h3>
                <p className="text-gray-600">Apply your slot configuration to multiple days</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Copy className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Template Source</h4>
                </div>
                <p className="text-gray-700">
                  Copy the slot configuration from <strong>{days[selectedDayIndex]?.dayName}</strong> to other days
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Select Days to Copy To</h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {copyDays.map((day, index) => (
                      <div
                        key={index}
                        onClick={() => handleCopyDaySelect(index)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center cursor-pointer transition-all duration-300 ${
                          day.selected
                            ? "border-gray-800 bg-gray-100 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }`}
                      >
                        <span className="text-sm font-bold text-gray-800">{day.dayName}</span>
                        <span className="text-xs text-gray-500 mt-1">{day.date}</span>
                        {day.selected && (
                          <div className="mt-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* <button
                    onClick={applyToSelectedDays}
                    className="w-full mt-6 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 font-semibold"
                  >
                    <Copy size={20} />
                    Apply to Selected Days
                  </button> */}
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Or Apply for Multiple Days</h4>

                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={copyForDays}
                      onChange={(e) => setCopyForDays(Number.parseInt(e.target.value) || 0)}
                      placeholder="Number of days"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyForNDays}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review and Submit */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Review & Confirm</h3>
                <p className="text-gray-600">Review all slots before creating them</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h4 className="font-semibold text-gray-800 mb-4">Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Days:</span>
                      <span className="font-semibold text-gray-800 ml-2">{days.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Slots:</span>
                      <span className="font-semibold text-gray-800 ml-2">
                        {days.reduce((total, day) => total + day.slots.length, 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Slot Type:</span>
                      <span className="font-semibold text-gray-800 ml-2">
                        {slotType === "PHYSICAL_OR_VIDEO" ? "Physical/Video" : "Home Visit"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Bookings:</span>
                      <span className="font-semibold text-gray-800 ml-2">{maxBookings}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => navigateReviewDay("prev")}
                      disabled={reviewDayIndex === 0}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>

                    <div className="text-center">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2 justify-center">
                        <span>{days[reviewDayIndex]?.dayName}</span>
                        <span className="text-sm text-gray-500">({days[reviewDayIndex]?.date})</span>
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Day {reviewDayIndex + 1} of {days.length} • {days[reviewDayIndex]?.slots.length} slots
                      </p>
                    </div>

                    <button
                      onClick={() => navigateReviewDay("next")}
                      disabled={reviewDayIndex === days.length - 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {days[reviewDayIndex]?.slots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 group cursor-pointer"
                        onClick={() => handleTimePreview(slot, days[reviewDayIndex].dayName, days[reviewDayIndex].date)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-500" />
                              <span className="font-semibold text-gray-800">
                                {to12HourFormat(slot.start_time.split("T")[1])} -{" "}
                                {to12HourFormat(slot.end_time.split("T")[1])}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Max: {slot.max_bookings} | Female: {slot.female_doctors}
                            </div>
                            {slotType === "PHYSICAL_OR_VIDEO" && (
                              <div className="flex gap-1 mt-2">
                                {slot.is_video_call && (
                                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                                    Video
                                  </span>
                                )}
                                {slot.is_physical_visit && (
                                  <span className="px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded-full">
                                    Physical
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <Eye size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
          <button
            onClick={() => {
              if (activeStep === 0 && showBasicConfig) {
                setShowBasicConfig(false)
              } else {
                setActiveStep((prev) => prev - 1)
              }
            }}
            disabled={activeStep === 0 && !showBasicConfig}
            className="px-8 py-3 text-gray-700 bg-white hover:bg-gray-100 rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-gray-200 shadow-sm"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {activeStep < 3 ? (
            <button
              onClick={() => setActiveStep((prev) => prev + 1)}
              disabled={activeStep === 0 && !showBasicConfig}
              className="px-8 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={submitBulkSlots}
              className="px-8 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2"
            >
              <Save size={18} />
              Create All Slots
            </button>
          )}
        </div>
      </div>

      {previewSlot && (
        <TimePreviewModal
          isOpen={!!previewSlot}
          onClose={() => setPreviewSlot(null)}
          slot={previewSlot.slot}
          dayName={previewSlot.dayName}
          date={previewSlot.date}
        />
      )}
    </div>
  )
}

export default BulkCreationModal