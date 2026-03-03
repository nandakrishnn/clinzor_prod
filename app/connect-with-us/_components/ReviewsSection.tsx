import Image from "next/image";

export default function ReviewsSection() {
    const reviews = [
        {
            name: "Dr Jabir PT",
            role: "Indian Men's Football Team Physio",
            content: "I was glad to mentor at the free camps organized by Clinzor. It was a truly meaningful and much-needed experience.",
            image: "/jabir.png"
        },
        {
            name: "Soul Physio",
            role: "Leading Physiotherapy Chain, Bangalore",
            content: "We partnered in events organized by Team Clinzor, and it was a wonderful experience. The team was professional, supportive, and great to work with.",
            image: "/soul-physio.png"
        },
        {
            name: "Rihan",
            role: "Working Professional, Bangalore",
            content: "Excellent physiotherapy service! The home visit was very convenient and the therapist was highly professional.",
            image: "/Rihan.jpg"
        },
    ];

    return (
        <section id="reviews" className="py-12 sm:py-16 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        What People Say About Us
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Real experiences from our partners and patients
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full"
                        >
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                                {review.content}
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    <Image
                                        src={review.image}
                                        alt={review.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{review.name}</div>
                                    <div className="text-xs text-gray-500">{review.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
