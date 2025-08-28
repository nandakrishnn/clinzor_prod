'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Slider from 'react-slick'

const Carousal = () => {
    const [activeServiceTab, setActiveServiceTab] = useState("clinic-visit")

    const serviceTabs = [
        { id: "home-service", label: "Home Service", icon: "🏠" },
        { id: "clinic-visit", label: "Clinic Visit", icon: "🏥" },
        { id: "online-service", label: "Online Service", icon: "💻" },
    ]

    // Slider settings
    const settings = {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000, // 3s
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false, // optional
        dots: true,
    }

    return (
        <div className="w-full">
            <Slider {...settings}>
                {serviceTabs.map((tab) => (
                    <div key={tab.id} className="px-4">
                        <div className="bg-white rounded-2xl shadow-sm border max-w-7xl mx-auto p-6">
                            {/* Content */}
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-[#033C8D] rounded-lg flex items-center justify-center text-white text-2xl">
                                        {tab.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{tab.label}</h3>
                                        <p className="text-gray-600">Professional healthcare services</p>
                                    </div>
                                </div>
                                <Button
                                    className="bg-[#033C8D] hover:bg-[#033C8D]/90 text-white px-8 py-2"
                                    onClick={() => setActiveServiceTab(tab.id)}
                                >
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Carousal
