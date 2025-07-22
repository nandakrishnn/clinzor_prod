import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, Calendar, FileText, X, Check, XCircle, CheckCircle, Clock, ChevronLeft, ChevronRight, Search, Filter, User, Eye, BookOpen, TrendingUp } from 'lucide-react';

// Type definitions
type Blog = {
  uuid: string;
  user: string;
  created_at: string;
  created_by: string;
  content: string;
  title: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
};

type BlogFormData = {
  title: string;
  content: string;
  created_by: string;
};

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      uuid: "ba3a1470-dad0-4975-b2cd-f7910ed6c1af",
      user: "07f67587-727c-4a6c-99b6-08b3ec88c22f",
      created_at: "2025-05-19T11:51:24.669262Z",
      created_by: "admin@gmail.com",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
      title: "test blog 2",
      status: "PENDING"
    },
    {
      uuid: "d31d6790-41c2-426c-a9b2-e7facf85ae0f",
      user: "07f67587-727c-4a6c-99b6-08b3ec88c22f",
      created_at: "2025-05-18T14:16:08.220212Z",
      created_by: "admin@gmail.com",
      content: "Discover the latest innovations in healthcare technology and how they're transforming patient care. From AI-powered diagnostics to telemedicine solutions, explore the future of medical practice.",
      title: "Healthcare Innovation Trends",
      status: "APPROVED"
    },
    {
      uuid: "e42e7890-52d3-537d-b0c3-f8gbdg96bf1g",
      user: "08g78698-838d-5b7d-00c7-09c4fd99d33g",
      created_at: "2025-05-17T09:32:15.123456Z",
      created_by: "editor@gmail.com",
      content: "A comprehensive guide to implementing effective patient management systems in modern clinics. Learn about best practices, workflow optimization, and technology integration.",
      title: "Patient Management Best Practices",
      status: "REJECTED"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    created_by: 'admin@gmail.com',
  });

  // Filter and search logic
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.created_by.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || blog.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = blogs.length;
    const approved = blogs.filter(b => b.status === 'APPROVED').length;
    const pending = blogs.filter(b => b.status === 'PENDING').length;
    const rejected = blogs.filter(b => b.status === 'REJECTED').length;
    return { total, approved, pending, rejected };
  }, [blogs]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content === "None" || content === null) return "No content available";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const openModal = (blog: Blog | null = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        content: blog.content === "None" ? "" : blog.content,
        created_by: blog.created_by,
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        content: '',
        created_by: 'admin@gmail.com',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      content: '',
      created_by: 'admin@gmail.com',
    });
  };

  const openViewModal = (blog: Blog) => {
    setViewingBlog(blog);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingBlog(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      return;
    }

    if (editingBlog) {
      setBlogs(prev => prev.map(blog => 
        blog.uuid === editingBlog.uuid 
          ? {
              ...blog,
              title: formData.title,
              content: formData.content,
              created_by: formData.created_by,
            }
          : blog
      ));
    } else {
      const newBlog: Blog = {
        uuid: Date.now().toString(),
        user: "07f67587-727c-4a6c-99b6-08b3ec88c22f",
        created_at: new Date().toISOString(),
        created_by: formData.created_by,
        title: formData.title,
        content: formData.content,
        status: 'PENDING',
      };
      setBlogs(prev => [newBlog, ...prev]);
    }
    closeModal();
  };

  const deleteBlog = (uuid: string) => {
    setBlogs(prev => prev.filter(blog => blog.uuid !== uuid));
  };

  const updateBlogStatus = (uuid: string, newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    setBlogs(prev => prev.map(blog => 
      blog.uuid === uuid ? { ...blog, status: newStatus } : blog
    ));
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 shadow-emerald-100';
      case 'PENDING': return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 shadow-amber-100';
      case 'REJECTED': return 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 shadow-red-100';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 shadow-gray-100';
    }
  };

  const StatusIcon = ({ status }: { status?: string }) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle size={14} className="text-emerald-600" />;
      case 'PENDING': return <Clock size={14} className="text-amber-600" />;
      case 'REJECTED': return <XCircle size={14} className="text-red-600" />;
      default: return null;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }: { title: string; value: number; icon: any; color: string; bgColor: string }) => (
    <div className={`${bgColor} rounded-2xl p-6 border border-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-100')} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 mb-8 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
                Blog Management
              </h1>
              <p className="text-gray-600 mt-3 text-lg">Create, manage and approve blog posts with ease</p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              New Blog Post
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Posts" 
            value={stats.total} 
            icon={BookOpen} 
            color="text-blue-600" 
            bgColor="bg-white/70 backdrop-blur-xl"
          />
          <StatCard 
            title="Published" 
            value={stats.approved} 
            icon={CheckCircle} 
            color="text-emerald-600" 
            bgColor="bg-white/70 backdrop-blur-xl"
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={Clock} 
            color="text-amber-600" 
            bgColor="bg-white/70 backdrop-blur-xl"
          />
          <StatCard 
            title="Rejected" 
            value={stats.rejected} 
            icon={XCircle} 
            color="text-red-600" 
            bgColor="bg-white/70 backdrop-blur-xl"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 mb-8 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 bg-white/50 focus:bg-white backdrop-blur-sm shadow-sm hover:shadow-md text-lg"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-6 py-4 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 bg-white/50 focus:bg-white backdrop-blur-sm shadow-sm hover:shadow-md font-medium"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending Review</option>
                <option value="APPROVED">Published</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedBlogs.length > 0 ? paginatedBlogs.map((blog: Blog) => (
            <div key={blog.uuid} className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02] hover:-translate-y-1">
              <div className="p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-xl mb-3 leading-tight group-hover:text-blue-900 transition-colors duration-300">{blog.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <div className="p-1 rounded-full bg-gray-100">
                          <User size={12} />
                        </div>
                        <span className="font-medium">{blog.created_by}</span>
                      </div>
                    </div>
                    {blog.status && (
                      <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border shadow-sm ${getStatusColor(blog.status)}`}>
                        <StatusIcon status={blog.status} />
                        {blog.status}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {truncateContent(blog.content)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
                      <Calendar size={12} />
                      <span className="font-medium">{formatDate(blog.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openViewModal(blog)}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                        title="View Blog"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {blog.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateBlogStatus(blog.uuid, 'APPROVED')}
                            className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:scale-110"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => updateBlogStatus(blog.uuid, 'REJECTED')}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => openModal(blog)}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      
                      <button
                        onClick={() => deleteBlog(blog.uuid)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/20">
                <FileText size={80} className="text-gray-300 mb-6 mx-auto" />
                <h3 className="text-2xl font-bold text-gray-600 mb-3">No blog posts found</h3>
                <p className="text-gray-500 mb-8 text-lg">Try adjusting your search or create a new blog post</p>
                <button
                  onClick={() => openModal()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 mx-auto"
                >
                  <Plus size={20} />
                  Create First Blog Post
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-medium">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBlogs.length)} of {filteredBlogs.length} blog posts
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                          isCurrentPage
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:scale-105'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-8 border-b border-gray-100/50">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Blog Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 bg-gray-50/50 focus:bg-white text-lg font-medium shadow-sm hover:shadow-md"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 bg-gray-50/50 focus:bg-white text-lg resize-none shadow-sm hover:shadow-md"
                  placeholder="Write your blog content here..."
                  rows={12}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Author Email
                </label>
                <input
                  type="email"
                  name="created_by"
                  value={formData.created_by}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 bg-gray-50/50 focus:bg-white text-lg font-medium shadow-sm hover:shadow-md"
                  placeholder="Enter author email"
                  required
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-lg"
                >
                  {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-200 text-lg hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-8 border-b border-gray-100/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {viewingBlog.title}
                  </h2>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <User size={14} />
                      <span className="font-medium">{viewingBlog.created_by}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Calendar size={14} />
                      <span className="font-medium">{formatDate(viewingBlog.created_at)}</span>
                    </div>
                    {viewingBlog.status && (
                      <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border shadow-sm ${getStatusColor(viewingBlog.status)}`}>
                        <StatusIcon status={viewingBlog.status} />
                        {viewingBlog.status}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeViewModal}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap bg-gray-50/50 p-6 rounded-2xl">
                  {viewingBlog.content === "None" ? "No content available" : viewingBlog.content}
                </div>
              </div>
              
              {viewingBlog.status === 'PENDING' && (
                <div className="flex items-center gap-4 pt-8">
                  <button
                    onClick={() => updateBlogStatus(viewingBlog.uuid, 'APPROVED')}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateBlogStatus(viewingBlog.uuid, 'REJECTED')}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-lg"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;