'use client'
import React, { useEffect, useState } from "react";
import Title from "../ui/title";
import { useRouter } from "next/navigation";
import { getAllBlogData } from "@/service/user/home";
import placeHolderImage from '../../public/blogs.png'

const BlogComponent = () => {
  const navigate = useRouter();
  const [blogData, setBlogData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getBlogData = async () => {
    try {
      const res = await getAllBlogData()
      console.log(res)
      if (res.status === 200) {
        setBlogData(res?.data?.data)
      }
    } catch (error) {
      console.log(error, 'from the blog listing component')
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getBlogData()
  }, [])

  // Example blog data (you can replace this with API data)
  const blogs = [
    {
      id: 1,
      title: "10 Tips for a Healthy Smile",
      excerpt:
        "Discover the best dental hygiene tips for a brighter, healthier smile...",
      image:
        "https://picsum.photos/800/600?random=1",
      date: "Aug 10, 2025"
    },
    {
      id: 2,
      title: "The Future of Telemedicine",
      excerpt:
        "Telemedicine is reshaping healthcare. Learn how to access doctors from anywhere...",
      image:
        "https://picsum.photos/800/600?random=1",
      date: "Aug 8, 2025"
    },
    {
      id: 3,
      title: "Top 5 Nutrition Myths Debunked",
      excerpt:
        "Not everything you hear about dieting is true. Here’s what science says...",
      image:
        "https://picsum.photos/800/600?random=1",
      date: "Aug 5, 2025"
    },
    {
      id: 4,
      title: "How to Choose the Right Clinic",
      excerpt:
        "Finding the best clinic can be tricky. Here’s a guide to help you decide...",
      image:
        "https://picsum.photos/800/600?random=1",
      date: "Aug 1, 2025"
    }
  ];

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <Title
            title="Our Blogs"
            subtitle="Real stories from users who’ve discovered, booked, and visited
            clinics through our platform."
          />
        </div>

        {/* Blog Cards */}
        <div className="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogData?.map((blog: any) => (
            <div
              key={blog?.uuid}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate.push(`/blog/${blog?.uuid}`)}
            >
              <img
                src={blog?.image || placeHolderImage.src}
                alt={blog?.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <p className="text-xs text-gray-500 mb-2">{blog?.created_at.split('T')[0]}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 capitalize">
                  {blog?.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        <div className="flex items-center justify-center w-full mt-8">
          <button
            onClick={() => navigate.push("/blog")}
            className="bg-primaryColor p-2.5 text-sm text-white rounded-full px-10 hover:bg-primaryColor/90 transition"
          >
            See More
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogComponent;
