"use client";

import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";

import { Check, Download, FileText, Users, Activity, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CorporatePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleCorporateSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const data = {
            formType: "corporate",
            companyName: (form.elements.namedItem("Company Name") as HTMLInputElement).value,
            contactPerson: (form.elements.namedItem("Contact Person") as HTMLInputElement).value,
            email: (form.elements.namedItem("Email") as HTMLInputElement).value,
            phone: (form.elements.namedItem("Phone") as HTMLInputElement).value,
            teamSize: (form.elements.namedItem("Team Size") as HTMLSelectElement).value,
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
        <main className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Premium Hero Section */}
            <section className="relative bg-gradient-to-br from-white to-blue-50 py-16 md:py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Left Content */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                                </span>
                                #1 Corporate Wellness Partner
                            </div>

                            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                                Strengthen Your Team, <span className="text-blue-600">Boost Productivity</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Transform workplace wellness with clinically-designed physiotherapy programs that reduce pain, improve posture, and energize your employees.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                                <a href="#contact" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center gap-2 transform hover:-translate-y-1">
                                    Book
                                    <ChevronRight className="w-5 h-5" />
                                </a>
                                <a href="/downloads/Corporate_wellness_clinzor.pdf" download className="px-8 py-4 bg-white text-gray-700 font-bold rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Download Guide
                                </a>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-nowrap overflow-x-auto pb-2 sm:pb-0 justify-center sm:justify-start gap-12 sm:gap-6 md:gap-10 border-t border-gray-200 pt-8 mt-auto">
                                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 flex-shrink-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm">
                                        60%
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Pain<br className="sm:hidden" /> Reduction</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">In 3 months</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 flex-shrink-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs sm:text-sm">
                                        10x
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">ROI</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">On wellness</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 flex-shrink-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs sm:text-sm">
                                        Dr.
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Expert<br className="sm:hidden" /> Led</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">By Dr. Jabir</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="hidden lg:block w-full lg:w-1/2 relative">
                            <div className="relative z-10 bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="aspect-[4/3] bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                                    <div className="flex flex-col items-center">
                                        <Activity className="w-24 h-24 text-blue-500 mb-4 drop-shadow-sm" />
                                        <span className="text-blue-800 font-semibold tracking-wide">Corporate Wellness</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-50 flex items-center gap-3">
                                    <div className="bg-green-500 rounded-full p-2">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Employee Satisfaction</p>
                                        <p className="text-sm font-bold text-gray-900">98% Rated 5/5</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full filter blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern Workplace Challenge */}
            <section className="py-10 md:py-16 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">The Modern Workplace Challenge</h2>
                        <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
                        {[
                            { icon: Users, title: "8-10 Hours", desc: "Daily sitting time", color: "text-orange-600 bg-orange-50" },
                            { icon: Activity, title: "Chronic Pain", desc: "Back & neck discomfort", color: "text-red-600 bg-red-50" },
                            { icon: FileText, title: "Poor Posture", desc: "Ergonomics ignored", color: "text-yellow-600 bg-yellow-50" },
                            { icon: Check, title: "Reactive Care", desc: "Treating only symptoms", color: "text-gray-600 bg-gray-50" },
                        ].map((item, i) => (
                            <div key={i} className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 bg-white text-center">
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300 ${item.color}`}>
                                    <item.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                                </div>
                                <h3 className="font-bold text-sm sm:text-lg text-gray-900 mb-1 sm:mb-2 leading-tight">{item.title}</h3>
                                <p className="text-gray-500 text-xs sm:text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comprehensive Solutions */}
            <section className="py-10 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Solutions</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Our holistic approach ensures every aspect of employee wellness is covered.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
                        {[
                            { title: "Assessment", desc: "Risk evaluation for workplace safety", icon: FileText },
                            { title: "Personalization", desc: "Care plans tailored to individual needs", icon: Users },
                            { title: "Continuity", desc: "Ongoing support for lasting results", icon: Activity },
                            { title: "Awareness", desc: "Educational workshops on ergonomics", icon: Play },
                            { title: "Intervention", desc: "On-site physiotherapy sessions", icon: Activity },
                            { title: "Prevention", desc: "Proactive injury prevention strategies", icon: Check },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-6 shadow-lg shadow-blue-200">
                                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <h3 className="font-bold text-sm sm:text-lg text-gray-900 mb-1 sm:mb-3 leading-tight">{item.title}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dr. Jabir Profile */}
            <section className="py-10 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-900 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 lg:p-16 text-white shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-800 rounded-full opacity-50 blur-3xl"></div>

                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                            <div className="w-full md:w-2/3">
                                <div className="inline-block bg-blue-800 px-3 py-1 md:px-4 md:py-1 rounded-full text-blue-200 text-xs md:text-sm font-semibold mb-4 md:mb-6">
                                    Clinical Leadership
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                                    Program Designed & Overseen by <br />
                                    <span className="text-blue-400">Dr. Jabir T T, PT</span>
                                </h2>

                                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                                    {[
                                        "Senior Indian Men's Football Team Physiotherapist",
                                        "Expertise in sports & orthopedic rehabilitation",
                                        "Proven corporate wellness track record",
                                        "Clinically monitored quality assurance"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-3 md:gap-4 group">
                                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-800/50 flex items-center justify-center group-hover:bg-blue-600 transition-colors flex-shrink-0 mt-0.5">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-200 group-hover:text-white" />
                                            </div>
                                            <span className="text-blue-100 text-sm md:text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="w-3/4 sm:w-1/2 md:w-1/3">
                                <div className="aspect-[3/4] relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg border-2 md:border-4 border-white/10">
                                    <Image
                                        src="/images/dr_jabir.png"
                                        alt="Dr. Jabir T T"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Process */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: "01", title: "Analyze", desc: "Validate needs via pilot" },
                            { step: "02", title: "Design", desc: "Create tailored plan" },
                            { step: "03", title: "Deploy", desc: "Seamless execution" },
                            { step: "04", title: "Refine", desc: "Monitor & optimize" }
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="text-3xl font-bold text-blue-600 absolute right-4 top-4 transform group-hover:scale-110 transition-transform duration-500">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">{item.title}</h3>
                                <p className="text-gray-600 relative z-10">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Download Brochure CTA */}
            <section id="brochure" className="bg-white py-16 border-t border-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Ready to transform your workplace?
                            </h2>
                            <p className="text-gray-600">
                                Download our detailed WorkCare program guide.
                            </p>
                        </div>
                        <a href="/downloads/Corporate_wellness_clinzor.pdf" download className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                            <Download className="h-5 w-5" />
                            Download Brochure
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section id="contact" className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Request a Consultation</h2>
                        <p className="text-gray-600">Let&apos;s build a healthier workforce together.</p>
                    </div>

                    <form
                        onSubmit={handleCorporateSubmit}
                        className="space-y-6 bg-gray-50 p-6 sm:p-8 md:p-10 rounded-2xl border border-gray-100"
                    >

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                                <input
                                    type="text"
                                    name="Company Name"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-shadow"
                                    placeholder="Company Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                                <input
                                    type="text"
                                    name="Contact Person"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-shadow"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="Email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-shadow"
                                    placeholder="email@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                <input
                                    type="tel"
                                    name="Phone"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-shadow"
                                    placeholder="Phone Number"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Team Size *</label>
                            <select
                                name="Team Size"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option>1-50 Employees</option>
                                <option>51-200 Employees</option>
                                <option>201-500 Employees</option>
                                <option>500+ Employees</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </form>
                </div>
            </section>

            <Footer />
        </main>
    );
}
