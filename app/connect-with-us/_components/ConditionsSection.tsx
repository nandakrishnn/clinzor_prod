import { Trophy, Baby, Scissors, Brain, Users, Bone, ArrowDown } from "lucide-react";

export default function ConditionsSection() {
    const conditions = [
        {
            title: "Sports Rehabilitation",
            icon: Trophy,
            color: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Women's Physiotherapy",
            icon: Baby,
            color: "bg-pink-100",
            iconColor: "text-pink-600",
        },
        {
            title: "Post-Surgical Rehabilitation",
            icon: Scissors,
            color: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            title: "Neuro Rehabilitation",
            icon: Brain,
            color: "bg-indigo-100",
            iconColor: "text-indigo-600",
        },
        {
            title: "Geriatric Physiotherapy",
            icon: Users,
            color: "bg-orange-100",
            iconColor: "text-orange-600",
        },
        {
            title: "Orthopedic Physiotherapy",
            icon: Bone,
            color: "bg-green-100",
            iconColor: "text-green-600",
        },
    ];

    return (
        <section id="services" className="py-12 md:pb-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-lg font-bold text-blue-600 tracking-wide uppercase mb-0">
                        Get a <span className="font-extrabold">Free</span> Physio Consultation*
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 flex flex-col items-center gap-1">
                        <span>for first session + assessment</span>
                        <ArrowDown className="w-5 h-5 text-emerald-500 animate-bounce mt-2" />
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-6">
                    {conditions.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full min-h-[180px] mx-auto w-full max-w-[280px]"
                        >
                            <div className={`h-14 w-14 ${item.color} ${item.iconColor} rounded-xl flex items-center justify-center mb-4`}>
                                <item.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-center font-medium text-gray-900 text-sm md:text-base leading-tight">
                                {item.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
