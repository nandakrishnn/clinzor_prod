export const PopularPostSkeleton = () => (
  <div className="flex items-start space-x-3 p-2">
    <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
    <div className="flex-1">
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-1"></div>
      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);