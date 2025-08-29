'use client'

import React, { useEffect, useState } from 'react'
import { SearchSkeleton } from './skeltons/SearchSkeleton';
import { FeaturedPostSkeleton } from './skeltons/FeaturedPostSkeleton';
import { getAllBlogs } from '@/service/user/blogPage';

import DataPlaceholder from '../common/DataPlaceholder';
import SearchBar from '../common/SearchBar';
import { ChevronRight, Loader } from 'lucide-react';
import Link from 'next/link';
type Blogs = {
    uuid: string;
    user: string;
    content: string;
    title: string;
    created_by: string;
    image: string;
};

const BlogList = () => {
    const [blogData, setBlogData] = useState<Blogs[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showBlog, setShowBlog] = useState<Blogs[]>([])

    const getBlogData = async (pageNum: number) => {
        try {
            const res = await getAllBlogs(pageNum);
            const totalPages = res?.data?.total_pages || 1;
            setTotalPage(totalPages);
            setHasMore(pageNum < totalPages);
            const pageData = res?.data?.data || [];


            if (pageNum === 1) {
                setBlogData(pageData);
                setShowBlog(pageData.slice(0, 4))
            } else {
                setBlogData((prev) => [...prev, ...pageData]);
            }
        } catch (error) {
            console.log(error, 'error message')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getBlogData(1)
    }, [])

    const handleLoadMore = () => {
        if (page < totalPage) {
            const nextPage = page + 1;
            setPage(nextPage);
            getBlogData(nextPage);
        }
    };

    if (isLoading) {
        return (
            <>
                <SearchSkeleton />
                <div className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <FeaturedPostSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </>
        )
    }

    if (blogData.length === 0) {
        return (
            <>
                <SearchBar placeHolder='Search Bogs....' />
                <DataPlaceholder title='Blog Data Not Available!' />
            </>
        )
    }

    return (
        <div>
            {/* Search Part */}
            <SearchBar placeHolder='Search Bogs....' />

            {showBlog?.length > 0 && (
                <div className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {showBlog.map((post, index) => (
                            <Link href={`/blog/${post?.uuid}`}
                                key={index}
                                className="bg-white rounded-xl overflow-hidden cursor-pointer"
                            >
                                <img
                                    src={post?.image || '/blogs.png'}
                                    alt={post?.title}
                                    className="w-full h-48 object-cover rounded-xl"
                                    onError={(e) => {
                                        e.currentTarget.src = '/blogs.png';
                                    }}
                                />
                                <div className="pt-3 text-start capitalize">

                                    <h3 className="text-[18px] font-semibold text-[#0D171C] mb-1 line-clamp-2">
                                        {post?.title}
                                    </h3>
                                    <p className="text-[#4F7A96] text-sm line-clamp-2">
                                        {post?.content}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Title */}
            <div className="flex items-start mb-5">
                <h2 className="text-[22px] font-bold">Articles</h2>
            </div>

            {/* section for listing all page wise */}
            <div className='w-full md:w-[70%]'>
                {blogData?.length > 0 && (
                    <div className="mb-16">
                        {blogData.map((post, index) => (
                            <Link href={`/blog/${post?.uuid}`}
                                key={index}
                                className="bg-white rounded-xl overflow-hidden cursor-pointer flex mb-5 md:mb-10"
                            >
                                <div className="pt-3 md:pt-0 text-start capitalize md:w-[90%]">
                                    <span className="inline-block  text-[#49739C] text-xs font-medium rounded-full mb-1">
                                        {"Blogs"}
                                    </span>
                                    <h3 className="text-[16px] font-semibold text-[#0D171C] mb-1 line-clamp-2">
                                        {post?.title}
                                    </h3>
                                    <p className="text-[#4F7A96] text-sm line-clamp-5">
                                        {post?.content}
                                    </p>
                                </div>
                                <div>
                                    <img
                                        src={post?.image || '/blogs.png'}
                                        alt={post?.title}
                                        className="w-full h-48 object-cover rounded-xl"
                                        onError={(e) => {
                                            e.currentTarget.src = '/blogs.png';
                                        }}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Load More button - Only show if there are more pages and not loading */}
            {hasMore && !isLoading && blogData.length > 0 && (
                <div className="flex justify-center mt-8">

                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="p-2.5 px-5 bg-primaryColor flex items-center justify-center text-white rounded-full text-sm hover:bg-primaryColor/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader size={18} className="animate-spin mr-2" />
                                Loading...
                            </>
                        ) : (
                            <>
                                Load More
                                <ChevronRight size={18} className="ml-2" />
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Show message when no more services to load */}
            {!hasMore && blogData.length > 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No more Blogs to load
                </div>
            )}
        </div>
    )
}

export default BlogList
