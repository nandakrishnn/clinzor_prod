import { BarChart3, Heart, MessageCircle } from "lucide-react";

export default function ComparisonSection() {
    return (
        <section id="about" className="py-12 bg-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
                    Clinzor vs Others
                </h2>

                {/* Clinzor Card (Blue) */}
                <div className="bg-blue-600 rounded-3xl p-6 md:p-8 text-white mb-8 shadow-xl">
                    <div className="flex justify-center mb-6">
                        <span className="font-bold text-xl flex items-center gap-2">
                            <span className="bg-white text-blue-600 rounded-full h-6 w-6 flex items-center justify-center text-sm">+</span>
                            Clinzor
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-500/50 rounded-xl p-5 text-center">
                            <BarChart3 className="h-8 w-8 mx-auto mb-3 text-white" />
                            <h3 className="font-bold mb-1">Result and progress tracking</h3>
                            <p className="text-sm text-blue-100">We carefully assess your condition and track your recovery progress</p>
                        </div>
                        <div className="bg-blue-500/50 rounded-xl p-5 text-center">
                            <Heart className="h-8 w-8 mx-auto mb-3 text-white" />
                            <h3 className="font-bold mb-1">Quality of care</h3>
                            <p className="text-sm text-blue-100">Advanced equipment, high-quality disposables</p>
                        </div>
                    </div>

                    <div className="bg-blue-500/50 rounded-xl p-5 text-center">
                        <MessageCircle className="h-8 w-8 mx-auto mb-3 text-white" />
                        <h3 className="font-bold mb-1">Customer support</h3>
                        <p className="text-sm text-blue-100">24/7 support, easy online scheduling, quick replacements</p>
                    </div>
                </div>

                {/* Other Providers */}
                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-600">Other providers</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-500 opacity-75">
                    <div className="bg-white p-6 rounded-2xl text-center border border-gray-100">
                        <BarChart3 className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                        <h4 className="font-semibold text-gray-700 text-sm">Basic feedback</h4>
                        <p className="text-xs">Minimal assessments</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl text-center border border-gray-100">
                        <Heart className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                        <h4 className="font-semibold text-gray-700 text-sm">Standard equipment</h4>
                        <p className="text-xs">Low-quality disposables</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
