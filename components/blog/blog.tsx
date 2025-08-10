"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Calendar, Loader, Share2, Clock, Bookmark, Heart } from 'lucide-react';
import { FeaturedPostCard } from './FeaturedPostCard';
import { BlogSidebar } from './BlogSidebar';
import { BlogCard } from './BlogCard';

// Mock data generator (same as before)
const generateBlogPosts = () => {
  const categories = ["Design", "Technology", "Business", "Health", "Lifestyle"];
  const authors = [
    { name: "Sarah Miller", image: "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=100&h=100&fit=crop&crop=face" },
    { name: "Michael Chen", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Alex Rivera", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    { name: "James Wilson", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
    { name: "Emma Davis", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" }
  ];

  return Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    title: [
      "Designing with Purpose",
      "The Evolution of Interfaces",
      "Minimalism in Digital Products",
      "Future of Web Development",
      "Sustainable Design Practices",
      "AI in Creative Industries",
      "User Psychology in UX",
      "Mobile First Approach",
      "Color Theory in 2025",
      "Typography Trends"
    ][i % 10] + ` ${Math.floor(i / 10) + 1}`,
    excerpt: [
      "Exploring how intentional design choices create meaningful user experiences.",
      "How UI design has transformed over the decades and where it's headed next.",
      "Why less continues to be more in the world of product design.",
      "The latest technologies shaping the future of web development.",
      "How eco-conscious design is changing the creative landscape.",
      "Artificial intelligence is revolutionizing creative workflows.",
      "Understanding user behavior to create better experiences.",
      "Why designing for mobile first leads to better products.",
      "Modern approaches to color in digital interfaces.",
      "Emerging typography styles and how to use them effectively."
    ][i % 10],
    content: `<p>This is detailed content for post ${i + 1}. In a real application, this would be the full blog post content with proper HTML formatting.</p>`,
    author: authors[i % 5].name,
    authorImage: authors[i % 5].image,
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    category: categories[i % 5],
    readTime: `${Math.floor(Math.random() * 7) + 3} min read`,
    image: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/800/600`,
    likes: Math.floor(Math.random() * 500),
    isTrending: i % 7 === 0,
    isFeatured: i % 10 === 0
  }));
};

const BlogApp = () => {
  const [currentView, setCurrentView] = useState('list');
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [visiblePosts, setVisiblePosts] = useState(10);
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
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setCurrentView('list');
  };

  const loadMorePosts = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisiblePosts(prev => Math.min(prev + 10, blogPosts.length));
      setIsLoading(false);
    }, 800);
  };

  const toggleSavePost = (postId: number) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };

  const BlogListView = () => {
    const featuredPosts = blogPosts.filter(post => post.isFeatured);
    const trendingPosts = blogPosts.filter(post => post.isTrending);
    const regularPosts = blogPosts.slice(0, visiblePosts);

    return (
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto px-4 py-12 pb-10 md:pb-20">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.slice(0, 2).map((post) => (
                  <FeaturedPostCard
                    key={post.id}
                    post={post}
                    onSave={toggleSavePost}
                    onClick={handleReadMore}
                    saved={savedPosts.includes(post.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Posts Column */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    onSave={toggleSavePost}
                    onClick={handleReadMore}
                    saved={savedPosts.includes(post.id)}
                  />
                ))}
              </div>

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
              <div className="sticky top-6">
                <BlogSidebar 
                  trendingPosts={trendingPosts} 
                  blogPosts={blogPosts} 
                  onPostClick={handleReadMore} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BlogDetailView = () => {
    const post = blogPosts.find(p => p.id === currentPostId);
    if (!post) return <div>Post not found</div>;

    return (
      <div className="min-h-screen bg-gray-50">
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
                    className={savedPosts.includes(post.id) ? "fill-blue-600 text-blue-600" : ""} 
                  />
                  <span className="text-sm">{savedPosts.includes(post.id) ? "Saved" : "Save"}</span>
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
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">You Might Also Like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {blogPosts
                  .filter(p => p.category === post.category && p.id !== post.id)
                  .slice(0, 2)
                  .map(relatedPost => (
                    <BlogCard
                      key={relatedPost.id}
                      post={relatedPost}
                      onSave={toggleSavePost}
                      onClick={handleReadMore}
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
      {currentView === 'list' ? <BlogListView /> : <BlogDetailView />}
    </AnimatePresence>
  );
};

export default BlogApp;