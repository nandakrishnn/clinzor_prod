import { useState, useEffect } from "react";
import { ArticleCard } from "./ArticleCard";
import { ChevronRight, Loader } from "lucide-react";
import { SearchSkeleton } from "./skeltons/SearchSkeleton";
import { FeaturedPostSkeleton } from "./skeltons/FeaturedPostSkeleton";
import { ArticleCardSkeleton } from "./skeltons/ArticleCardSkeleton";
import { PopularPostSkeleton } from "./skeltons/PopularPostSkeleton";

export const BlogListView = ({
  blogPosts,
  visiblePosts,
  isLoading,
  hasMore,
  savedPosts,
  handleReadMore,
  loadMorePosts,
  toggleSavePost
}: {
  blogPosts: any[];
  visiblePosts: number;
  isLoading: boolean;
  hasMore: boolean;
  savedPosts: number[];
  handleReadMore: (id: number) => void;
  loadMorePosts: () => void;
  toggleSavePost: (id: number) => void;
}) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (blogPosts.length > 0) {
      setIsInitialLoading(false);
    }
  }, [blogPosts]);

  const featuredPosts = blogPosts.filter((post) => post.isFeatured);
  const trendingPosts = blogPosts.filter((post) => post.isTrending);
  const regularPosts = blogPosts.slice(0, visiblePosts);

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl w-full mx-auto px-4 py-8">
        {/* Search bar */}
        {isInitialLoading ? (
          <SearchSkeleton />
        ) : (
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Featured Posts */}
        {isInitialLoading ? (
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <FeaturedPostSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          featuredPosts.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPosts.slice(0, 4).map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleReadMore(post.id)}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6 text-start">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full mb-2">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Posts Column */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-start text-gray-900 mb-6">
              Articles
            </h2>

            {/* Health Category */}
            <div className="mb-12">
              {isInitialLoading ? (
                <div className="grid grid-cols-1 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {regularPosts
                    .filter((post) => post.category === "Health")
                    .map((post) => (
                      <ArticleCard
                        key={post.id}
                        post={post}
                        onClick={() => handleReadMore(post.id)}
                        onSave={toggleSavePost}
                        saved={savedPosts.includes(post.id)}
                      />
                    ))}
                </div>
              )}
            </div>

            {/* Nutrition Category */}
            <div className="mb-12">
              {isInitialLoading ? (
                <div className="grid grid-cols-1 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {regularPosts
                    .filter((post) => post.category === "Nutrition")
                    .map((post) => (
                      <ArticleCard
                        key={post.id}
                        post={post}
                        onClick={() => handleReadMore(post.id)}
                        onSave={toggleSavePost}
                        saved={savedPosts.includes(post.id)}
                      />
                    ))}
                </div>
              )}
            </div>

            {/* Load More Button */}
            {!isInitialLoading && visiblePosts < blogPosts.length && (
              <div className="mb-10 text-center">
                <button
                  onClick={loadMorePosts}
                  disabled={isLoading}
                  className="inline-flex items-center px-6 p-2.5 text-white shadow-sm font-medium text-sm rounded-full bg-primaryColor focus:outline-none"
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
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              {/* Popular Articles */}
              <div className="rounded-xl border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-nowrap">
                  Popular Articles
                </h3>
                <div className="space-y-4">
                  {isInitialLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <PopularPostSkeleton key={i} />
                      ))
                    : trendingPosts.slice(0, 5).map((post) => (
                        <div
                          key={post.id}
                          className="flex items-start space-x-3 cursor-pointer border hover:bg-gray-50 p-2 rounded-lg transition-colors"
                          onClick={() => handleReadMore(post.id)}
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="text-start">
                            <h4 className="font-medium text-gray-900 line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {post.readTime}
                            </p>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};