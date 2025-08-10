import { motion } from 'framer-motion';
import { Clock, Heart, Bookmark } from 'lucide-react';

interface BlogCardProps {
  post: {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    authorImage: string;
    date: string;
    category: string;
    readTime: string;
    image: string;
    likes: number;
    isTrending?: boolean;
  };
  onSave: (id: number) => void;
  onClick: (id: number) => void;
  saved: boolean;
}

export const BlogCard = ({ post, onSave, onClick, saved }: BlogCardProps) => (
  <motion.article
    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
    whileHover={{ y: -5 }}
    onClick={() => onClick(post.id)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {post.isTrending && (
        <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Trending
        </span>
      )}
      <button 
        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onSave(post.id);
        }}
      >
        <Bookmark size={16} className={saved ? "fill-blue-600 text-blue-600" : "text-gray-600"} />
      </button>
    </div>

    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-PrimaryColor text-sm font-medium">{post.category}</span>
        <span className="text-gray-500 text-sm flex items-center">
          <Clock size={14} className="mr-1" />
          {post.readTime}
        </span>
      </div>

      <h3 className="text-xl flex items-start justify-start text-start font-semibold text-gray-900 mb-2 group-hover:text-PrimaryColor transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-600 text-start mb-4 line-clamp-2 leading-relaxed">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={post.authorImage} 
            alt={post.author} 
            className="w-8 h-8 rounded-full mr-3" 
          />
          <span className="text-sm text-gray-700">{post.author}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Heart size={14} className="mr-1" />
          {post.likes}
        </div>
      </div>
    </div>
  </motion.article>
);