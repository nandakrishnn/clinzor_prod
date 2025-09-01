import React from 'react'

const ServiceDetailedVIewSkelton = () => {
  return (
    <div>
      <div className="p-4 md:p-6 w-full animate-pulse">
        <section className="flex flex-col md:flex-row gap-5 md:gap-10 items-start justify-start">
          {/* Image skeleton */}
          <div className="w-full md:w-[60%] md:min-h-[400px]">
            <div className="w-full min-h-[400px] md:h-full bg-gray-200 rounded-xl"></div>
          </div>

          {/* Content skeleton */}
          <div className="w-full md:w-[40%] space-y-4">
            <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
            </div>
            <div className="flex gap-2 flex-wrap mt-4">
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ServiceDetailedVIewSkelton 
