'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Home, Building, Laptop } from "lucide-react"
import { ClinicCarousalSkeleton } from '@/components/skeltons/service/ClinicCarousalSkeleton'

interface ClinicCarousalProps {
    id: string,
    serviceDetailed: any,
    clinicService: any,
    setActiveServiceTab: any,
    activeServiceTab: any,
    loading?: boolean
}

const ClinicCarousal: React.FC<ClinicCarousalProps> = ({
    id,
    clinicService,
    serviceDetailed,
    activeServiceTab,
    setActiveServiceTab,
    loading = false
}) => {
    const router = useRouter()
    const { data } = useSession()

    if (loading) return <ClinicCarousalSkeleton /> 

    const serviceTabs = [
        {
            id: "HOME_VISIT",
            label: "Home Service",
            icon: Home,
            consultationKey: "consultation_charge_home_visit",
            sessionKey: "treatment_charge_home_visit",
        },
        {
            id: "PHYSICAL_VISIT",
            label: "Clinic Visit",
            icon: Building,
            consultationKey: "consultation_charge_physical_visit",
            sessionKey: "treatment_charge_physical_visit",
        },
        {
            id: "VIDEO_CALL",
            label: "Online Service",
            icon: Laptop,
            consultationKey: "consultation_charge_video_call",
            sessionKey: "treatment_charge_video_call",
        },
    ]

    const getService = clinicService?.find(
        (service: any) => service?.service === serviceDetailed?.uuid
    )

    const availableTabs = serviceTabs.filter(
        (tab) =>
            getService?.[tab.consultationKey] !== null &&
            getService?.[tab.consultationKey] !== undefined &&
            getService?.[tab.sessionKey] !== null &&
            getService?.[tab.sessionKey] !== undefined
    )

    const activeTabObj = availableTabs.find((tab) => tab.id === activeServiceTab)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border">
                <div className="p-6">
                    {/* Service Tabs */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {availableTabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveServiceTab(tab.id)}
                                    className={`px-6 py-3 rounded-full border-2 flex items-center gap-2 transition-all duration-200 ${activeServiceTab === tab.id
                                            ? "bg-[#033C8D] text-white border-[#033C8D]"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-[#033C8D]"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Selected Service Display */}
                    {activeTabObj && (
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 bg-[#033C8D] rounded-lg flex items-center justify-center text-white">
                                        <activeTabObj.icon className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {serviceDetailed?.name} (
                                            <span className="text-gray-600">{activeTabObj.label}</span>
                                            )
                                        </h3>
                                        <p className="text-gray-600">Professional healthcare services</p>

                                        {/* Charges */}
                                        <div className="flex flex-col md:flex-row gap-1 md:gap-2 md:mt-2 mt-1">
                                            <p className="text-gray-600">
                                                <strong>Consultation :</strong>{" "}
                                                ₹{getService?.[activeTabObj.consultationKey] || "N/A"}
                                            </p>
                                            <p className="text-gray-600">
                                                <strong>Session :</strong>{" "}
                                                ₹{getService?.[activeTabObj.sessionKey] || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="bg-[#033C8D] hover:bg-[#033C8D]/90 text-white px-8 py-2 rounded-lg mt-2 md:mt-0"
                                    onClick={() => {
                                        data?.accessToken
                                            ? router.push(
                                                `/service/clinic/booking/${id}?selectedService=${activeServiceTab}&&serviceId=${serviceDetailed?.uuid}`
                                            )
                                            : router.push('/auth')
                                    }}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ClinicCarousal
