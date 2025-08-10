import { Clock } from 'lucide-react';

interface BlogSidebarProps {
  trendingPosts: Array<{
    id: number;
    title: string;
    readTime: string;
    image: string;
  }>;
  blogPosts: Array<{
    category: string;
  }>;
  onPostClick: (id: number) => void;
}

export const BlogSidebar = ({ trendingPosts, blogPosts, onPostClick }: BlogSidebarProps) => (
  <div className="space-y-8">
    {trendingPosts.length > 0 && (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
          Trending Now
        </h3>
        <div className="space-y-4">
          {trendingPosts.slice(0, 5).map((post) => (
            <div 
              key={post.id} 
              className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => onPostClick(post.id)}
            >
              <div className="flex-shrink-0 w-20 h-16 rounded-md overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  {post.readTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}


    <div className="bg-gradient-to-t from-[#1C3455] to-[#1C3455] p-6 rounded-xl shadow-lg text-white">
      <h3 className="text-lg font-bold mb-3">Stay Updated</h3>
      <p className="text-sm text-blue-100 mb-4">
        Subscribe to our newsletter for the latest articles and insights.
      </p>
      <form className="space-y-3">
        <input
          type="email"
          placeholder="Your email address"
          className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm"
        >
          Subscribe
        </button>
      </form>
    </div>
  </div>
);