'use client'
import React, { useEffect, useState } from "react";
import Title from "../ui/title";
import { useRouter } from "next/navigation";
import { getAllBlogData } from "@/service/user/home";
import placeHolderImage from '../../public/blogs.png'
import useLocalStorage from "@/hooks/useLocalStorage.ts";

const BlogComponent = () => {
  const navigate = useRouter();
  const [blogData, setBlogData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const {setItem} = useLocalStorage()

  const getBlogData = async () => {
    try {
      const res = await getAllBlogData()
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
          {blogData?.slice(0, 4)?.map((blog: any) => (
            <div
              key={blog?.uuid}
              className="bg-white rounded-2xl  shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() =>{
                setItem("blogSlug",blog.uuid)
                 navigate.push(`/blog/${blog?.slug}`)
                }}
            >
              <img
                src={blog?.image || placeHolderImage.src}
                alt={blog?.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/blogs.png';
                }}
              />
              <div className="p-5 ">
                
                <p className="text-xs text-gray-500 mb-2">{blog?.created_at.split('T')[0]}</p>
                <h3 className="text-lg truncate font-semibold text-gray-900 mb-2 line-clamp-2 capitalize">
                  {blog?.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {blog.excerpt}
                </p>
                 {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
  {blog.tags
    ?.split(',')
    ?.map((tag: string, index: number) => (
      <span
        key={index}
        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium capitalize"
      >
        {tag.trim()}
      </span>
    ))}
</div>

        )}
                
               
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
