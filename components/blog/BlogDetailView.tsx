'use client'
import useLocalStorage from "@/hooks/useLocalStorage.ts";
import { getABlog } from "@/service/user/blogPage";
import { getBlogDataByName } from "@/service/user/sevicePage";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Bookmark, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface BlogDetailViewProps {
  
    image?: string
    title: string
    content?: string
    created_by?: string
    created_at?: string
  
}

export const BlogDetailView: React.FC<{ blogName: string }> = ({ blogName })  => {
 const [post,setPost] = useState<BlogDetailViewProps|null>(null)
 const {getItem} = useLocalStorage()
   
   
 useEffect(() => {
  const fetchData = async () => {
    try {
      let  slug = getItem("blogSlug");
      if(!slug){
       const blogData = await getBlogDataByName(blogName)
       slug = blogData.uuid
      }
      const postData = await getABlog(slug);      
      setPost(postData.data);
    } catch (error) {
      console.log("Error fetching blog:", error);
      setPost(null);
    }
  };

  fetchData();
}, []);


  return (
    <div className="min-h-screen pb-10">
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 -mt-16 relative z-10 ">
        <div className="max-w-4xl mx-auto ">

          {/* floating part */}
          <div className="absolute left-20 top-[69%] md:flex flex-col items-center justify-center hidden">
            <div className=" bg-primaryColor w-[50px] h-[50px] rounded-full z-20 flex items-center justify-center">
              <h3 className="text-white font-bold text-[22px]">C</h3>
            </div>
            <h3 className="font-semibold text-[9px] mt-1 uppercase">Clinzor</h3>
          </div>

          {/* Blog content part */}
        {post&&  <motion.div
            className="my-4 md:my-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 ">

              <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-black capitalize">
                {post?.title} <br />
              </h1>
              <span className="text-xs text-gray-600 font-semibold capitalize">Auther : {post?.created_by?.split("@")[0]}</span>
            </div>

            {/* Hero Image */}
            <div className="relative h-[50vh] overflow-hidden mt-5">
              <img
                src={post?.image || '/blogs.png'}
                alt={post?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/blogs.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
            </div>
            <div
              className="prose prose-lg max-w-none mt-5 md:mt-10"
              dangerouslySetInnerHTML={{ __html: post?.content || "" }}
            />

          </motion.div>}


          <hr />

          {/* Action Bar */}
          <div className="flex items-center justify-between p-4 mb-12">
          </div>
        </div>
      </div>
    </div>
  );
};