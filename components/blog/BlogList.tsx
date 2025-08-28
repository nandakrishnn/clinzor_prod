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

    const getBlogData = async (pageNum: number) => {
        try {
            const res = await getAllBlogs(pageNum);
            const totalPages = res?.data?.total_pages || 1;
            setTotalPage(totalPages);
            setHasMore(pageNum < totalPages);
            const pageData = res?.data?.data || [];

            if (pageNum === 1) {
                setBlogData(pageData);
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

    console.log(blogData)

    return (
        <div>
            {/* Search Part */}
            <SearchBar placeHolder='Search Bogs....' />

            {blogData.length > 0 && (
                <div className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {blogData.slice(0, 4).map((post, index) => (
                            <Link href={`/blog/${post?.uuid}`}
                                key={index}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                <img
                                    src={post?.image || '/blogs.png'}
                                    alt={post?.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/blogs.png';
                                    }}
                                />
                                <div className="p-6 text-start capitalize">
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full mb-2">
                                        {"Blogs"}
                                    </span>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {post?.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {post?.content}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

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
