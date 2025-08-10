import { motion } from 'framer-motion';
import { Clock, Bookmark } from 'lucide-react';

interface FeaturedPostCardProps {
  post: {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    authorImage: string;
    readTime: string;
    image: string;
    category: string;
  };
  onSave: (id: number) => void;
  onClick: (id: number) => void;
  saved: boolean;
}

export const FeaturedPostCard = ({ post, onSave, onClick, saved }: FeaturedPostCardProps) => (
  <motion.div
    className="relative group rounded-2xl overflow-hidden shadow-lg h-96"
    whileHover={{ scale: 0.98 }}
    transition={{ duration: 0.3 }}
  >
    <img
      src={post.image}
      alt={post.title}
      className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
    <div className="relative h-full flex flex-col justify-end p-8">
      <div className="flex justify-between items-start mb-4 absolute top-5 ">
        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
          Featured
        </span>
        {/* <button 
          onClick={(e) => {
            e.stopPropagation();
            onSave(post.id);
          }}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
        >
          <Bookmark size={20} className={saved ? "fill-white text-white" : "text-white"} />
        </button> */}
      </div>
      <div className='text-start'>
        <span className="text-blue-300 font-medium text-sm">{post.category}</span>
        <h3 
          className="text-2xl font-bold text-white mt-1 mb-2 group-hover:text-blue-300 transition-colors cursor-pointer"
          onClick={() => onClick(post.id)}
        >
          {post.title}
        </h3>
        <p className="text-gray-200 mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={post.authorImage} 
              alt={post.author} 
              className="w-8 h-8 rounded-full mr-3 border-2 border-white" 
            />
            <span className="text-white text-sm">{post.author}</span>
          </div>
          <span className="text-gray-300 text-sm flex items-center">
            <Clock size={14} className="mr-1" />
            {post.readTime}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);