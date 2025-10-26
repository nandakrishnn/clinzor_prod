"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, X, Check, Loader, ChevronRight } from "lucide-react"
import { Suspense, useCallback, useEffect, useState } from "react"
import { getAllService } from "@/service/user/sevicePage"
import { useSession } from "next-auth/react"
import { baseUrl } from "@/utils/Endpoint"
import { postExpertSuggestionsService } from "@/service/user/expert"
import { toast } from "sonner"

type Service = {
  uuid: string;
  name: string;
  description: string;
  tags: string;
  created_by: string;
  image: string;
  slug: string;
  status: string;
  reason_for_rejection?: string;
};

// Inner component that uses useSearchParams
const ExpertVideoCallContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const meetingUrl = searchParams.get("meetingUrl") || ""
  const bookingId = searchParams.get("bookingId") || ""

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Filter services based on search term
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.tags.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleSubmitSuggestions = async () => {
    if (selectedServices.length === 0) return

    setIsSubmitting(true)
    try {
      const response = await postExpertSuggestionsService(bookingId, selectedServices)

      if (response.status === 200) {
        // Success handling
        console.log("Suggestions submitted successfully")
        toast.success(response?.message)
        setIsModalOpen(false)
        setSelectedServices([])
        // You might want to show a success toast here
      } else {
        // Error handling
        console.error("Failed to submit suggestions")
      }
    } catch (error) {
      console.error("Error submitting suggestions:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchServices = useCallback(async (pageNum: number, query: string = "") => {
    setIsLoading(true);
    try {
      const res = await getAllService(pageNum, query);

      if (res?.status === 200) {
        const totalPages = res.data?.total_pages || 1;
        setTotalPage(totalPages);
        setHasMore(pageNum < totalPages);

        const pageData = res.data?.data || [];

        if (pageNum === 1) {
          setServices(pageData);
        } else {
          setServices((prev) => [...prev, ...pageData]);
        }
      } else {
        console.error("Failed to fetch services:", res?.message);
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  const handleLoadMore = () => {
    if (page < totalPage && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchServices(nextPage, searchQuery);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If you want to search from API instead of client-side filtering, uncomment below:
    setSearchQuery(value);
    setPage(1);
    fetchServices(1, value);
  };

  // Fetch services when modal opens
  useEffect(() => {
    if (isModalOpen && services.length === 0) {
      fetchServices(1, searchQuery);
    }
  }, [isModalOpen, services.length, fetchServices, searchQuery]);

  // Reset search and pagination when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setSearchTerm("");
      setPage(1);
      setSearchQuery("");
    }
  }, [isModalOpen]);

  return (
    <div className="w-full h-[100vh] relative flex flex-col bg-background ">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/expert/videocall/portal")}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h2 className="ml-2 font-semibold text-lg">Expert Video Call</h2>
        </div>

        {/* Suggestion Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 mr-2 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Make Suggestions
        </button>
      </div>

      {/* Video call */}
      <iframe
        src={meetingUrl}
        className="flex-1 w-full border-0 "
        allow="camera; microphone; fullscreen; speaker; display-capture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
      />

      {/* Suggestion Modal */}
      {isModalOpen && (
        <div className="absolute right-2 bottom-10 z-50 flex items-end justify-end ">
          <div className="relative m-4 bg-white rounded-lg shadow-xl w-80 max-h-[70vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">Select Services</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Services List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && page === 1 ? (
                <div className="flex items-center justify-center p-4">
                  <Loader size={20} className="animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading services...</span>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? "No services found matching your search" : "No services available"}
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {filteredServices.map((service) => (
                    <div
                      key={service.uuid}
                      onClick={() => toggleService(service.uuid)}
                      className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-colors ${selectedServices.includes(service.uuid)
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <div
                        className={`flex items-center justify-center w-5 h-5 border rounded mr-3 ${selectedServices.includes(service.uuid)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                          }`}
                      >
                        {selectedServices.includes(service.uuid) && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-gray-700 block truncate capitalize">
                          {service.name}
                        </span>
                        {service.tags && (
                          <span className="text-xs text-gray-500 block truncate capitalize">
                            {service.tags}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Load More button - Only show if there are more pages and not loading */}
                  {hasMore && !searchTerm && services.length > 0 && (
                    <div className="flex justify-center border-t">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="p-2 px-5 text-xs bg-blue-600  mt-3 flex items-center justify-center text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader size={10} className="animate-spin mr-2" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More
                            <ChevronRight size={10} className="ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Show message when no more services to load */}
                  {!hasMore && services.length > 0 && !searchTerm && (
                    <div className="text-center text-gray-500 p-4 border-t">
                      No more services to load
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  {selectedServices.length} service(s) selected
                </span>
              </div>
              <button
                onClick={handleSubmitSuggestions}
                disabled={selectedServices.length === 0 || isSubmitting}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Suggestions"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main component with Suspense
const ExpertVideoCall = () => {
  return (
    <Suspense fallback={
      <div className="w-full h-[100vh] flex items-center justify-center bg-background z-40">
        <div className="text-lg">Loading video call...</div>
      </div>
    }>
      <ExpertVideoCallContent />
    </Suspense>
  )
}

export default ExpertVideoCall