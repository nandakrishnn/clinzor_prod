"use client";

import { Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "./MetaPixel";

export default function TopBanner() {
    return (
        <div className="hidden md:block bg-emerald-500 text-white py-2 px-4 shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-sm md:text-base">
                <div className="flex items-center gap-2 text-center">
                    <Gift className="h-5 w-5 flex-shrink-0" />
                    <span className="font-semibold">FREE Expert Physio Video Consultation</span>
                    <span className="hidden sm:inline">-</span>
                    <span className="hidden sm:inline">Get personalized advice at your convenience!</span>
                </div>
                <Link
                    href="https://clinzor.com/expert-call"
                    onClick={() => trackEvent("InitiateCheckout", { content_name: "free_video_consultation", source: "top_banner" })}
                    className="bg-white text-emerald-600 px-4 py-1.5 rounded-full font-bold text-sm hover:bg-emerald-50 transition-colors flex items-center gap-1 shadow-sm whitespace-nowrap"
                >
                    Book Free Consultation Now <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
