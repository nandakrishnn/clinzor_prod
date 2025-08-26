// components/LoadingSkeleton.tsx
import React from 'react';

interface LoadingSkeletonProps {
  type?: 'text' | 'card' | 'image';
  lines?: number;
  className?: string;
  circle?: boolean;
  height?: string;
  width?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = "text", 
  lines = 3, 
  className = "",
  circle = false,
  height,
  width
}) => {
  if (type === "card") {
    return (
      <div 
        className={`bg-white rounded-lg shadow-md p-4 animate-pulse ${className}`}
        style={{ height, width }}
      >
        <div 
          className={`bg-gray-200 rounded-full ${circle ? 'w-12 h-12' : 'w-16 h-4'} mb-3`}
        ></div>
        <div className="space-y-2">
          {[...Array(lines)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "image") {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${circle ? 'rounded-full' : 'rounded'} ${className}`}
        style={{ height, width }}
      ></div>
    );
  }

  // Default text skeleton
  return (
    <div className={`space-y-2 ${className}`} style={{ width }}>
      {[...Array(lines)].map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{ width: i === lines - 1 ? '80%' : '100%' }}
        ></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;