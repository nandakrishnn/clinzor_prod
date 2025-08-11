"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowLeft,
  Calendar,
  Loader,
  Share2,
  Clock,
  Bookmark,
  Heart
} from "lucide-react";

// Simplified mock data generator focused on health content
const generateBlogPosts = () => {
  const categories = ["Health", "Nutrition", "Fitness", "Mental Health"];
  const authors = [
    {
      name: "Dr. Sarah Miller",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Alex Rivera",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    title: [
      "The Importance of Regular Health Check-ups",
      "Healthy Eating Habits for a Balanced Life",
      "Effective Exercises for a Stronger Body",
      "Managing Stress and Anxiety in Daily Life",
      "Sleep Hygiene: The Foundation of Good Health",
      "Understanding Your Body's Nutritional Needs",
      "Cardio vs. Strength Training: What You Need",
      "Mindfulness Techniques for Better Mental Health",
      "Preventive Care: Staying Ahead of Health Issues",
      "The Role of Hydration in Overall Wellness"
    ][i % 10],
    excerpt: [
      "Regular health check-ups are essential for maintaining overall well-being and early detection of potential health issues.",
      "A diet rich in fruits, vegetables, and whole grains supports healthy nutrition and promotes diverse benefits.",
      "Regular exercise is vital for building a stronger body and maintaining physical fitness.",
      "Managing stress and anxiety is essential for maintaining mental well-being in our fast-paced world.",
      "Quality sleep is just as important as diet and exercise for your overall health.",
      "Learn how to listen to your body's signals for optimal nutrition and energy.",
      "Understanding the benefits of different exercise types for a balanced fitness routine.",
      "Simple mindfulness practices that can transform your daily stress levels.",
      "How regular screenings and check-ups can prevent serious health problems.",
      "Why water is the most essential nutrient for your body's functions."
    ][i % 10],
    content: `<p>This is detailed content for post ${
      i + 1
    }. In a real application, this would be the full blog post content with proper HTML formatting.</p>`,
    author: authors[i % 3].name,
    authorImage: authors[i % 3].image,
    date: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }),
    category: categories[i % 4],
    readTime: `${Math.floor(Math.random() * 7) + 3} min read`,
    image: `https://picsum.photos/id/${Math.floor(
      Math.random() * 1000
    )}/800/600`,
    likes: Math.floor(Math.random() * 500),
    isTrending: i % 7 === 0,
    isFeatured: i % 10 === 0
  }));
};

const BlogApp = () => {
  const [currentView, setCurrentView] = useState("list");
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [visiblePosts, setVisiblePosts] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setBlogPosts(generateBlogPosts());
    }, 500);
  }, []);

  const handleReadMore = (postId: number) => {
    setCurrentPostId(postId);
    setCurrentView("detail");
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setCurrentView("list");
  };

  const loadMorePosts = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisiblePosts((prev) => Math.min(prev + 8, blogPosts.length));
      setIsLoading(false);
    }, 800);
  };

  const toggleSavePost = (postId: number) => {
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const BlogListView = () => {
    const featuredPosts = blogPosts.filter((post) => post.isFeatured);
    const trendingPosts = blogPosts.filter((post) => post.isTrending);
    const regularPosts = blogPosts.slice(0, visiblePosts);

    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          {/* <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Health Insights
            </h1>
            <p className="text-lg text-gray-600">
              Discover the latest articles on health and wellness
            </p>
          </div> */}

          {/* Search bar - simple version */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Featured Posts - TREADS section */}
          {featuredPosts.length > 0 && (
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
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Posts Column */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold text-start text-gray-900 mb-6">
                Articles
              </h2>

              {/* Health Category */}
              <div className="mb-12">
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
              </div>

              {/* Nutrition Category */}
              <div className="mb-12">
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
              </div>

              {/* Load More Button */}
              {visiblePosts < blogPosts.length && (
                <div className="mt-10 text-center">
                  <button
                    onClick={loadMorePosts}
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Popular Articles
                  </h3>
                  <div className="space-y-4">
                    {trendingPosts.slice(0, 5).map((post) => (
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

  const ArticleCard = ({
    post,
    onClick,
    onSave,
    saved
  }: {
    post: any;
    onClick: () => void;
    onSave: (id: number) => void;
    saved: boolean;
  }) => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/3">
            <img
              className="h-full w-full object-cover"
              src={post.image}
              alt={post.title}
              onClick={onClick}
            />
          </div>
          <div className="p-6 md:w-2/3 text-start">
            <div className="flex justify-between items-start">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded mb-2">
                {post.category}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(post.id);
                }}
                className="text-gray-400 hover:text-blue-500"
              >
                <Bookmark
                  className={saved ? "fill-blue-500 text-blue-500" : ""}
                  size={18}
                />
              </button>
            </div>
            <h3
              className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={onClick}
            >
              {post.title}
            </h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={post.authorImage}
                  alt={post.author}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-600">{post.author}</span>
              </div>
              <span className="text-sm text-gray-500">{post.date}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BlogDetailView = () => {
    const post = blogPosts.find((p) => p.id === currentPostId);
    if (!post) return <div>Post not found</div>;

    return (
      <div className="min-h-screen pb-10">
        {/* Hero Image */}
        <div className="relative h-[50vh] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

          <div className="container mx-auto px-4 sm:px-6 relative h-full flex flex-col justify-end pb-12">
            <button
              className="absolute top-6 left-4 sm:left-6 flex items-center text-white bg-black/20 backdrop-blur-sm hover:bg-black/40 px-4 py-2 rounded-full transition-all duration-300"
              onClick={goBack}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Articles
            </button>

            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-3 py-1 bg-white text-blue-600 text-sm font-medium rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center justify-center space-x-6 text-white/90">
                <div className="flex items-center">
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="w-8 h-8 rounded-full mr-2 border-2 border-white"
                  />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 py-12 -mt-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </motion.div>

            {/* Action Bar */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 mb-12">
              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => toggleSavePost(post.id)}
                >
                  <Bookmark
                    size={20}
                    className={
                      savedPosts.includes(post.id)
                        ? "fill-blue-600 text-blue-600"
                        : ""
                    }
                  />
                  <span className="text-sm">
                    {savedPosts.includes(post.id) ? "Saved" : "Save"}
                  </span>
                </button>
                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <Heart size={20} />
                  <span className="text-sm">Like ({post.likes})</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <Share2 size={20} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                onClick={goBack}
              >
                Back to Articles
              </button>
            </div>

            {/* Related Posts */}
            <div className="py-10">
              <h3 className="text-xl font-bold text-gray-900 mb-6 ">
                You Might Also Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {blogPosts
                  .filter(
                    (p) => p.category === post.category && p.id !== post.id
                  )
                  .slice(0, 2)
                  .map((relatedPost) => (
                    <ArticleCard
                      key={relatedPost.id}
                      post={relatedPost}
                      onSave={toggleSavePost}
                      onClick={() => handleReadMore(relatedPost.id)}
                      saved={savedPosts.includes(relatedPost.id)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === "list" ? <BlogListView /> : <BlogDetailView />}
    </AnimatePresence>
  );
};

export default BlogApp;
