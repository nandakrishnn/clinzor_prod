'use client'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

interface ClinicCarousalProps {
    id: string,
    serviceDetailed: any,
    clinicService: any,
    setActiveServiceTab: any,
    activeServiceTab: any
}

const ClinicCarousal: React.FC<ClinicCarousalProps> = ({ id, clinicService, serviceDetailed, activeServiceTab, setActiveServiceTab }) => {
    const router = useRouter()
    const { data } = useSession()

    const serviceTabs = [
        { id: "HOME_VISIT", label: "Home Service", icon: "🏠", key: "treatment_charge_home_visit" },
        { id: "PHYSICAL_VISIT", label: "Clinic Visit", icon: "🏥", key: "treatment_charge_physical_visit" },
        { id: "VIDEO_CALL", label: "Online Service", icon: "💻", key: "treatment_charge_video_call" },
    ]



    // Only keep services that have charges
    const getService = clinicService?.find((service: any) => service?.service === serviceDetailed?.uuid)
    const availableTabs = serviceTabs.filter(
        (tab) => getService?.[tab.key] !== null && getService?.[tab.key] !== undefined
    );
    console.log(getService, availableTabs, 'filter data')
    // useEffect(() => {
    //     const getService = clinicService?.filter((service: any) => service?.service === serviceDetailed?.uuid)
    //     console.log(getService, 'filter data')
    // }, [clinicService])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border">
                <div className="p-6">
                    {/* Service Tabs */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {availableTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveServiceTab(tab.id)}
                                className={`px-6 py-3 rounded-full border-2 transition-all duration-200 ${activeServiceTab === tab.id
                                    ? "bg-[#033C8D] text-white border-[#033C8D]"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-[#033C8D]"
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Selected Service Display */}
                    {activeServiceTab && (
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-[#033C8D] rounded-lg flex items-center justify-center text-white text-2xl">
                                        {availableTabs.find((tab) => tab.id === activeServiceTab)?.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {serviceDetailed?.name} (
                                            <span className="text-gray-600">
                                                {availableTabs.find((tab) => tab.id === activeServiceTab)?.label}
                                            </span>
                                            )
                                        </h3>
                                        <p className="text-gray-600">Professional healthcare services</p>
                                    </div>
                                </div>
                                <button
                                    className="bg-[#033C8D] hover:bg-[#033C8D]/90 text-white px-8 py-2 rounded-lg"
                                    onClick={() => {
                                        data?.accessToken
                                            ? router.push(`/service/clinic/booking/${id}?selectedService=${activeServiceTab}&&serviceId=${serviceDetailed?.uuid}`)
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
