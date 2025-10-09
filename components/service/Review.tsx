"use client";
import React, { useEffect, useState } from "react";
import Title from "../ui/title";
import { addReviewService, getAllReviewService } from "@/service/user/sevicePage";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  clinic: string;
  service: string;
  review?: string;
}

const ReviewSection = ({ id }: { id: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { data: session, status } = useSession();
  const params = useSearchParams();
  const service = params.get("serviceId");
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
    avatar: "",
    clinic: id,
    service: service || "",
  });

  // Fetch reviews function
  const listAllReview = async (service: string, pageNum: number = 1, append: boolean = false) => {
    setIsLoading(true);
    try {
      const res = await getAllReviewService(id, service, pageNum);
      console.log(res, 'from the admin');

      if (res?.data?.data) {
        const newReviews = res.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          rating: item.rating,
          comment: item.review || item.comment, // Handle both field names
          avatar: item.avatar,
          clinic: item.clinic,
          service: item.service,
        }));

        if (append) {
          setReviews(prev => [...prev, ...newReviews]);
        } else {
          setReviews(newReviews);
        }

        // Check if there are more pages
        setHasMore(pageNum < res.data.total_pages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more reviews
  const loadMoreReviews = () => {
    if (service && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      listAllReview(service, nextPage, true);
    }
  };

  // Initial load
  useEffect(() => {
    if (service) {
      setPage(1);
      listAllReview(service, 1, false);
    }
  }, [service]);

  // Auto-fill user data when session is available
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || "",
        avatar: session.user?.image || "",
      }));
    }
  }, [session]);

  // Update formData when service changes
  useEffect(() => {
    if (service) {
      setFormData(prev => ({
        ...prev,
        service: service,
        clinic: id,
      }));
    }
  }, [service, id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddReview = async () => {
    if (!formData.name || !formData.comment || !formData.service) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data for API
      const reviewData = {
        clinic: formData.clinic,
        service: formData.service,
        rating: formData.rating,
        review: formData.comment,
        name: formData.name,
        avatar: formData.avatar || "https://via.placeholder.com/150",
      };

      const response = await addReviewService(reviewData);

      console.log("Review to be submitted:", reviewData, response);

      // For now, we'll simulate success and add to local state
      const newReview: Review = {
        id: Date.now().toString(), // Temporary ID
        name: formData.name,
        rating: formData.rating,
        comment: formData.comment,
        avatar: formData.avatar || "https://via.placeholder.com/150",
        clinic: formData.clinic,
        service: formData.service,
      };

      // Add new review to the beginning of the list
      setReviews(prev => [newReview, ...prev]);

      // Reset form but keep the user's name
      setFormData({
        name: session?.user?.name || "",
        rating: 5,
        comment: "",
        avatar: session?.user?.image || "https://via.placeholder.com/150",
        clinic: id,
        service: service || "",
      });

      toast.success("Review submitted successfully!");

    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-center items-center pb-4 md:pb-10">
        <Title
          title="Customers Review"
          description="Customers Review"
          subtitle=""
        />
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Reviews List */}
        <div className="md:col-span-2">
          {reviews.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to leave a review!
            </div>
          ) : (
            <>
              {reviews.map((review, idx) => (
                <div
                  key={`${review.id}-${idx}`}
                  className="flex items-start border-b gap-4 py-8"
                >
                  <img
                    src={review.avatar || "/clinic.png"}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {review.name}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1 text-sm">{review.comment}</p>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMoreReviews}
                    disabled={isLoading}
                    className="bg-primaryColor text-white px-6 py-2 rounded-md disabled:opacity-50"
                  >
                    {isLoading ? "Loading..." : "Load More Reviews"}
                  </button>
                </div>
              )}
            </>
          )}

          {isLoading && reviews.length === 0 && (
            <div className="text-center py-8">Loading reviews...</div>
          )}
        </div>

        {/* Sticky Review Form */}
        <aside className="md:sticky md:top-28 bg-white p-6 rounded-lg shadow h-fit border">
          <h3 className="text-lg font-bold mb-4 text-[#424141]">Write a Review</h3>
            <>
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-3 text-sm font-medium focus:outline-none"
                required
              />
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-3 text-sm font-medium focus:outline-none"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
              <textarea
                name="comment"
                placeholder="Your Review *"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                className="w-full border p-2 rounded mb-3 text-sm font-medium focus:outline-none"
                required
              />
              <button
                onClick={handleAddReview}
                disabled={isSubmitting || !formData.name || !formData.comment}
                className="w-full bg-primaryColor text-white px-5 text-sm p-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </>
        </aside>
      </div>
    </div>
  );
};

export default ReviewSection;