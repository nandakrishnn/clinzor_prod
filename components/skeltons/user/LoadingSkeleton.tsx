export function UserProfileSkeleton() {
    return (
        <div className="flex items-center p-4 rounded-lg bg-gray-100 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            <div className="ml-3 flex-1 min-w-0">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    );
}

export function ProfileDetailsSkeleton() {
    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center justify-between mb-5">
                <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-1/3 mb-1 animate-pulse"></div>
                        <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BookingsSkeleton() {
    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-8">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-5 animate-pulse"></div>
            <div className="flex gap-1 mb-4 bg-background/50 p-1 rounded-lg border border-border">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-300 rounded w-24 animate-pulse"></div>
                ))}
            </div>
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-background/50 border border-border rounded-lg p-6 animate-pulse">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                                <div className="flex flex-wrap gap-4">
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-20 h-6 bg-gray-300 rounded"></div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <div className="w-20 h-6 bg-gray-300 rounded"></div>
                            <div className="w-20 h-6 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}