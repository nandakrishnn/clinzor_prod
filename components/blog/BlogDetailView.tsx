import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Bookmark, Heart, Share2 } from "lucide-react";
import { ArticleCard } from "./ArticleCard";

export const BlogDetailView = ({
  post,
  savedPosts,
  toggleSavePost,
  goBack,
  blogPosts,
  handleReadMore
}: {
  post: any;
  savedPosts: number[];
  toggleSavePost: (id: number) => void;
  goBack: () => void;
  blogPosts: any[];
  handleReadMore: (id: number) => void;
}) => {
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
            <h3 className="text-xl font-bold text-gray-900 mb-6">
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