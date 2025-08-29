'use client'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const ClinicCarousal = () => {
    const [activeServiceTab, setActiveServiceTab] = useState("clinic-visit")
    const [selectedService, setSelectedService] = useState(null)
    

    const serviceTabs = [
        { id: "home-service", label: "Home Service", icon: "🏠" },
        { id: "clinic-visit", label: "Clinic Visit", icon: "🏥" },
        { id: "online-service", label: "Online Service", icon: "💻" },
    ]

    const handleServiceSelect = (service: any) => {
        setSelectedService(service)
    }
    return (
        <div className=' className="max-w-7xl mx-auto px-4 sm:px-6 '>
            {/* Header Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border">
                <div className="p-6">
                    {/* Service Tabs */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {serviceTabs.map((tab) => (
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
                    <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-[#033C8D] rounded-lg flex items-center justify-center text-white text-2xl">
                                    {serviceTabs.find((tab) => tab.id === activeServiceTab)?.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {serviceTabs.find((tab) => tab.id === activeServiceTab)?.label}
                                    </h3>
                                    <p className="text-gray-600">Professional healthcare services</p>
                                </div>
                            </div>
                            <Link href={'#service'}
                                className="bg-[#033C8D] hover:bg-[#033C8D]/90 text-white px-8 py-2 rounded-lg"
                            // onClick={() => router.push(`/service/clinic/booking/${'clinic id'}`)}
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClinicCarousal
