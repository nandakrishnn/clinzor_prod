import { Bookmark } from "lucide-react";

export const ArticleCard = ({
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
            className="h-full w-full object-cover cursor-pointer"
            src={post.image}
            alt={post.title}
            onClick={onClick}
          />
        </div>
        <div className="p-6 md:w-2/3 text-start">
          <div className="flex justify-between items-start">
            <span className="inline-block px-2 py-1 bg-blue-100 text-primaryColor text-xs font-medium rounded mb-2">
              {post.category}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave(post.id);
              }}
              className="text-gray-400 hover:text-primaryColor"
            >
              <Bookmark
                className={saved ? "fill-primaryColor text-primaryColor" : ""}
                size={18}
              />
            </button>
          </div>
          <h3
            className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-primaryColor transition-colors"
            onClick={onClick}
          >
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
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