"use client";
import React, { useState } from "react";
import Title from "../ui/title";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Tommy M. Laird",
      rating: 4,
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Margaret J. Casey",
      rating: 5,
      comment:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
    avatar: ""
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddReview = () => {
    if (!formData.name || !formData.comment) return;
    setReviews([
      {
        id: Date.now(),
        ...formData,
        avatar: formData.avatar || "https://via.placeholder.com/150"
      },
      ...reviews
    ]);
    setFormData({ name: "", rating: 5, comment: "", avatar: "" });
  };

  return (
    <div className="p-6 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-center items-center  pb-4 md:pb-10">
        <Title
          title="Customers Review"
          description="Customers Review"
          subtitle=""
        />
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        {/* Reviews List */}
        <div className="md:col-span-2 ">
          {Array(3) // number of times you want to repeat
            .fill(undefined)
            .flatMap(() => reviews) // duplicate array
            .map((review, idx) => (
              <div
                key={`${review.id}-${idx}`} // use idx too, to avoid duplicate keys
                className="flex items-start border-b gap-4 py-8"
              >
                <img
                  src={review.avatar}
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
        </div>

        {/* Sticky Review Form */}
        <aside className="md:sticky md:top-28 bg-white p-6 rounded-lg shadow h-fit border">
          <h3 className="text-xl font-bold mb-4">Write a Review</h3>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3 text-sm font-medium focus:outline-none"
          />
          <input
            type="text"
            name="avatar"
            placeholder="Avatar URL (optional)"
            value={formData.avatar}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3 text-sm font-medium focus:outline-none"
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
            placeholder="Your Review"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            className="w-full border p-2 rounded mb-3 text-sm font-medium focus:outline-none"
          />
          <button
            onClick={handleAddReview}
            className="w-full bg-primaryColor text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </aside>
      </div>
    </div>
  );
};

export default ReviewSection;
