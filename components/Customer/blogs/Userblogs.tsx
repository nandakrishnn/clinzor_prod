import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Search, Calendar, ChevronRight, X, BookOpen } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  content: string;
}

const BlogCRUD = () => {
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: 1,
      title: "test blog 2",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: ''
  });

  // Filter blogs based on search
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }
    
    if (currentView === 'create') {
      const newBlog: Blog = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setBlogs([newBlog, ...blogs]);
    } else if (currentView === 'edit' && selectedBlog) {
      setBlogs(blogs.map(blog =>
        blog.id === selectedBlog.id
          ? { ...blog, ...formData, updatedAt: new Date().toISOString() }
          : blog
      ));
    }
    resetForm();
  };

  // Reset form and view
  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setCurrentView('list');
    setSelectedBlog(null);
  };

  // Handle edit
  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content
    });
    setCurrentView('edit');
  };

  // Handle delete
  const handleDelete = (id: number) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  // Handle view blog
  const handleView = (blog: Blog) => {
    setSelectedBlog(blog);
    setCurrentView('view');
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  // Get reading time estimate
  const getReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentView !== 'list' && (
                <button
                  onClick={resetForm}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-200 font-medium"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {currentView === 'list' ? 'My Blogs' : 
                   currentView === 'create' ? 'Create Blog' : 
                   currentView === 'edit' ? 'Edit Blog' : 'Blog Details'}
                </h1>
              </div>
            </div>
            
            {currentView === 'list' && (
              <button
                onClick={() => setCurrentView('create')}
                className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Blog
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* List View */}
        {currentView === 'list' && (
          <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/70 backdrop-blur-sm text-lg placeholder-gray-500 shadow-sm"
              />
            </div>

            {/* Stats */}
            <div className="flex justify-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200/50">
                <p className="text-gray-600 font-medium">
                  {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Blog' : 'Blogs'}
                </p>
              </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredBlogs.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-gray-900 text-xl font-semibold mb-2">No blogs found</div>
                  <p className="text-gray-500 text-lg">Create your first blog to get started</p>
                </div>
              ) : (
                filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 hover:border-blue-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1"
                    onClick={() => handleView(blog)}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex-1 mr-4 line-clamp-2 group-hover:text-blue-900 transition-colors">
                        {blog.title}
                      </h3>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(blog);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(blog.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 text-base line-clamp-4 leading-relaxed">
                      {truncateContent(blog.content, 120)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(blog.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getReadingTime(blog.content)}
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ChevronRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {(currentView === 'create' || currentView === 'edit') && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-gray-200/50 shadow-xl">
                <div className="space-y-8">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Blog Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter your blog title..."
                      className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 text-xl font-medium bg-white/50 backdrop-blur-sm placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Write your blog content here..."
                      rows={16}
                      className="w-full px-6 py-4 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 resize-none text-base leading-relaxed bg-white/50 backdrop-blur-sm placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={resetForm}
                  className="px-8 py-4 text-gray-600 hover:text-gray-800 transition-colors font-semibold text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {currentView === 'create' ? 'Create Blog' : 'Update Blog'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Blog */}
        {currentView === 'view' && selectedBlog && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-gray-200/50 shadow-xl">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {selectedBlog.title}
                </h1>
                <div className="flex items-center text-base text-gray-600 space-x-6">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Created: {formatDate(selectedBlog.createdAt)}
                  </div>
                  <div className="text-gray-500">
                    {getReadingTime(selectedBlog.content)}
                  </div>
                  {selectedBlog.updatedAt !== selectedBlog.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Updated: {formatDate(selectedBlog.updatedAt)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {selectedBlog.content}
                </div>
              </div>

              <div className="mt-10 flex space-x-4">
                <button
                  onClick={() => selectedBlog && handleEdit(selectedBlog)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Edit3 className="w-5 h-5 mr-2" />
                  Edit Blog
                </button>
                <button
                  onClick={() => {
                    if (selectedBlog) {
                      handleDelete(selectedBlog.id);
                      setCurrentView('list');
                    }
                  }}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete Blog
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCRUD;