// 🔹 Skeleton Loader Component
export const ClinicCarousalSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                {/* Tabs Skeleton */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="px-6 py-3 rounded-full border-2 bg-gray-200 animate-pulse w-40 h-12"
                        />
                    ))}
                </div>

                {/* Service Card Skeleton */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-300 rounded-lg animate-pulse" />
                            <div>
                                <div className="h-5 w-48 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse mb-4"></div>
                                <div className="flex flex-col md:flex-row gap-2 mt-2">
                                    <div className="h-4 w-28 bg-gray-200 rounded-md animate-pulse"></div>
                                    <div className="h-4 w-28 bg-gray-200 rounded-md animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div className="h-10 w-32 bg-gray-300 rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    )
}