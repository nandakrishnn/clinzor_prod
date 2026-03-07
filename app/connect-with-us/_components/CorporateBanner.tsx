import Link from "next/link";
import { Building2, Users, ArrowRight } from "lucide-react";

export default function CorporateBanner() {
    return (
        <section className="hidden sm:block py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                <span className="text-white/90 font-semibold text-sm sm:text-base">For Businesses</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                                Corporate Wellness Program
                            </h2>
                            <p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-0 max-w-2xl">
                                Transform your workplace health with our comprehensive physiotherapy programs designed for teams
                            </p>

                            {/* Mobile Stats */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mt-4 lg:hidden">
                                <div className="text-center hidden">
                                    <div className="text-xl sm:text-2xl font-bold text-white">60%+</div>
                                    <div className="text-xs sm:text-sm text-white/80">Pain Reduction</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl sm:text-2xl font-bold text-white">10x</div>
                                    <div className="text-xs sm:text-sm text-white/80">ROI</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl sm:text-2xl font-bold text-white">Expert</div>
                                    <div className="text-xs sm:text-sm text-white/80">Led Programs</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="flex flex-col items-center lg:items-end gap-4 sm:gap-6">
                            {/* Desktop Stats */}
                            <div className="hidden lg:flex gap-6 mb-2">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">60%+</div>
                                    <div className="text-sm text-white/80">Pain Reduction</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">10x</div>
                                    <div className="text-sm text-white/80">ROI</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">Expert</div>
                                    <div className="text-sm text-white/80">Led Programs</div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Link
                                href="/connect-with-us/corporate"
                                className="group bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center"
                            >
                                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span>Explore Corporate Program</span>
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
