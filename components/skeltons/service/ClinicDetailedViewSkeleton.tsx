export const ClinicDetailedViewSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 animate-pulse">
      {/* Clinic Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="h-8 w-60 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-200 rounded" />
              ))}
              <div className="h-4 w-10 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="h-20 w-full bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 w-full bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="lg:w-80">
            <div className="bg-gray-200 rounded-xl p-6 h-48"></div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="mb-8">
        <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offers */}
      <div className="mb-8">
        <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Doctors */}
      <div className="mb-12">
        <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="p-6 text-center">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4"></div>
                <div className="h-5 w-32 bg-gray-200 rounded mx-auto mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mx-auto mb-2"></div>
                <div className="h-4 w-16 bg-gray-200 rounded mx-auto mb-2"></div>
                <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};