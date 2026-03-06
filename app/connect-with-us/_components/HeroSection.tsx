"use client";

import { Home, Building2, Video, ArrowDown } from "lucide-react";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const data = {
            formType: "session",
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
            serviceType: (form.elements.namedItem("Service Type") as HTMLSelectElement).value,
        };
        try {
            await fetch("/api/submit-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
        } catch (_) {
            // silently continue — sheet logging best-effort
        }
        router.push("/connect-with-us/thank-you");
    }

    return (
        <section className="relative bg-gradient-to-b from-blue-50 to-white pt-10 pb-16 md:pt-16 md:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-12">
                    {/* Left Content */}
                    <div className="flex-1 text-center md:text-left pt-2 md:pt-4">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
                            Expert Physiotherapy
                        </h1>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-blue-600 tracking-tight leading-tight mb-8">
                            in Bangalore
                        </h1>

                        <div className="mb-10 w-full max-w-xl mx-auto md:mx-0 relative z-10">
                            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed px-4 md:px-0">
                                Access expert physiotherapy care in Bangalore through online consultations home visits or clinic sessions. Get matched with the right physio.
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-6">
                                <div className="bg-blue-50 p-3 rounded-full text-blue-600 shadow-sm hover:shadow-md transition-shadow">
                                    <Video className="h-6 w-6" />
                                </div>
                                <div className="bg-emerald-50 p-3 rounded-full text-emerald-600 shadow-sm hover:shadow-md transition-shadow">
                                    <Home className="h-6 w-6" />
                                </div>
                                <div className="bg-orange-50 p-3 rounded-full text-orange-600 shadow-sm hover:shadow-md transition-shadow">
                                    <Building2 className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Only Animated Call to Action */}
                        <div className="md:hidden flex justify-center mt-6 mb-12">
                            <button
                                onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
                                className="animate-bounce bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
                            >
                                Book Now <ArrowDown className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Booking Form */}
                    <div id="book" className="mt-8 md:mt-0 w-full md:w-[450px] bg-white rounded-2xl shadow-xl p-5 md:p-8 border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Schedule your session</h3>
                        <p className="text-sm text-gray-500 mb-6">We&apos;ll contact you as soon as possible</p>

                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit}
                        >

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">Service Type <span className="text-red-500">*</span></label>
                                <select
                                    id="serviceType"
                                    name="Service Type"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                >
                                    <option value="">Select a service type</option>
                                    <option value="Home Visit">Home Visit</option>
                                    <option value="Clinic Visit">Clinic Visit</option>
                                </select>
                            </div>

                            <Link
                                href="/expert-call"
                                className="flex items-center justify-center gap-2 w-full border border-blue-200 bg-blue-50 text-blue-600 font-semibold text-sm py-3 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Video className="w-4 h-4" />
                                Looking for a Video Call? Book Free Consultation
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Booking..." : "Book Session Now"}
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                By submitting, you agree to our Terms &amp; Privacy Policy
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
