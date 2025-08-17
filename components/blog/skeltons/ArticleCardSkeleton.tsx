export const ArticleCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="md:flex">
      <div className="md:flex-shrink-0 md:w-1/3">
        <div className="h-full w-full bg-gray-200 animate-pulse"></div>
      </div>
      <div className="p-6 md:w-2/3">
        <div className="flex justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);