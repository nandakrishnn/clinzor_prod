"use client";

import * as React from "react";
import { useState, useEffect } from 'react';
import { createBlog, deleteBlog, editBlog, GetAllBlog } from "@/service/admin/blogManagementService";
import { uploadFiles } from "@/service/uploadService/uploadService";
import { ImageIcon, Upload, RefreshCw, X, Plus, Edit, Trash2, Calendar, User, Clock, Folder, ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationData } from "@/types/common";
import { toast } from "sonner";

interface BlogPost {
  uuid: string;
  title: string;
  sub_heading?: string;
  content: string;
  created_by?: string;
  created_at?: string;
  image?: string;
  tags?: string;
}

interface BlogForm {
  title: string;
  sub_heading?: string;
  content: string;
  author?: string;
  image?: string;               // single image
  tags?: string;                // new field
}

interface ImagePreview {
  id: string;
  url: string;
  file: File;
  isUploaded?: boolean;
  serverUrl?: string;
}


export default function AdminBlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>({
    title: '',
    sub_heading: '',
    content: '',
    author: '',
    image: '',
    tags: ''
  });
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // pagination part
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });

  // New state for modal and confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | any>(null);

  const fetchBlogs = async (search = '') => {
    setLoading(true);
    try {
      const params: any = {
        page_size: itemsPerPage,
        page: currentPage,
      };

      if (search) {
        params.search = search;
      }

      const data = await GetAllBlog(params);
      console.log(data, 'all blogs')
      setPaginationData({
        current_page: data?.current_page,
        total_pages: data?.total_pages,
        total_items: data?.total_items,
        next: data?.next,
        previous: data?.previous
      });
      setPosts(data?.data);
    } catch (error) {
      console.error("fetching Blogs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const resetForm = () => {
    setForm({
      title: '',
      sub_heading: '',
      content: '',
      author: '',
      image: ''
    });
    setImagePreviews([]);
    setSelectedImages([]);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const preview: ImagePreview = {
        id: `preview-${Date.now()}`,
        url: URL.createObjectURL(file),
        file,
        isUploaded: false,
      };

      setImagePreviews([preview]);
      setUploadingImages(true);

      try {
        const uploadedUrls = await uploadFiles([file]);
        setForm(prev => ({
          ...prev,
          image: uploadedUrls[0]
        }));

        setImagePreviews([{
          ...preview,
          isUploaded: true,
          serverUrl: uploadedUrls[0]
        }]);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploadingImages(false);
      }
    }
  };

  const removeImage = () => {
    if (imagePreviews[0]) {
      URL.revokeObjectURL(imagePreviews[0].url);
    }
    setImagePreviews([]);
    setForm(prev => ({ ...prev, image: '' }));
  };

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      sub_heading: post.sub_heading || '',
      content: post.content,
      author: post.created_by || '',
      image: post.image || '',
      tags: post.tags || ''
    });

    setEditingId(post.uuid);

    if (post.image) {
      setImagePreviews([{
        id: `existing-${Date.now()}`,
        url: post.image,
        file: new File([], 'existing'),
        isUploaded: true,
        serverUrl: post.image
      }]);
    } else {
      setImagePreviews([]);
    }

    openModal();
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteBlog(id.toString());
      setPosts(posts.filter(post => post.uuid !== id.toString()));
      setMessage('Blog post deleted successfully!');
      await fetchBlogs();
      if (editingId === id.toString()) {
        resetForm();
      }
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      setMessage(`Error: ${error.response?.data?.message || 'Failed to delete blog post'}`);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      setMessage('Title and content are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const blogData = {
        title: form?.title,
        sub_heading: form?.sub_heading || '',
        content: form?.content,
        image: form?.image || '',
        tags: form?.tags || ''
      };

      if (editingId) {
        await editBlog(editingId.toString(), blogData);
        setMessage('Blog post updated successfully!');
      } else {
        await createBlog(blogData);
        setMessage('Blog post created successfully!');
      }

      await fetchBlogs();
      closeModal();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      toast.error(`Error: ${error.response?.data?.message || 'Failed to save blog post'}`)
      setMessage(`Error: ${error.response?.data?.message || 'Failed to save blog post'}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, []);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.total_pages) {
      console.log(newPage, paginationData.total_pages)
      setCurrentPage(newPage);
    }
  };

  // Generate page numbers for pagination display
  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = paginationData.total_pages;
    const current = paginationData.current_page;

    // Always show first page
    if (totalPages > 0) {
      pages.push(1);
    }

    // Add ellipsis if needed
    if (current > 3) {
      pages.push('...');
    }

    // Add pages around current page
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add ellipsis if needed
    if (current < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-5 px-4 sm:px-6 md:pb-8">
      <div className="max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="mb-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="text-gray-600 mt-2">Create and manage your blog posts</p>
            </div>
            <button
              onClick={openModal}
              className="bg-primaryColor text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <Plus size={20} />
              Add New Post
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
            {message}
          </div>
        )}

        {/* Results Count */}
        {/* <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing page {paginationData.current_page} of {paginationData.total_pages} ({paginationData.total_items} total experts)
          </p>
        </div> */}

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post.uuid} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Blog Image */}
              {post.image ? (
                <div className="aspect-video relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}


              {/* Blog Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar size={14} />
                  <span>{post?.created_at ? formatDate(post.created_at.toString()) : 'N/A'}</span>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 capitalize">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.sub_heading || post.content.substring(0, 100)}...</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{post.created_by}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(post)}
                    className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(post?.uuid)}
                    className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first blog post</p>
              <button
                onClick={openModal}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create First Post
              </button>
            </div>
          </div>
        )}

        {paginationData.total_pages > 1 && (
          <div className="flex mt-5 flex-col sm:flex-row items-center justify-between bg-white px-4 sm:px-6 py-2 sm:py-4 rounded-xl border border-gray-200 gap-2 sm:gap-0 mb-8">
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
              <span>
                Showing page {paginationData.current_page} of {paginationData.total_pages} ({paginationData.total_items} total items)
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => handlePageChange(paginationData.current_page - 1)}
                disabled={!paginationData.previous || loading}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex space-x-0.5 sm:space-x-1">
                {generatePageNumbers().map((page, index) => {
                  if (page === '...') {
                    return <span key={index} className="px-1 sm:px-2 text-gray-400">...</span>;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      disabled={loading}
                      className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${paginationData.current_page === page
                        ? 'bg-primaryColor text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(paginationData.current_page + 1)}
                disabled={!paginationData.next || loading}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Title *</label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name="title"
                    placeholder="Blog post title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Author</label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name="author"
                    placeholder="Author name"
                    value={form.author}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Sub Heading *</label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="sub_heading"
                  placeholder="Short description"
                  value={form.sub_heading}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Content *</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="content"
                  placeholder="Blog content"
                  value={form.content}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Tags (optional)</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name="tags"
                    placeholder="Healthcare, Growth"
                    value={form.tags || ''}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Blog Images
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Blog Images {imagePreviews.length > 0 && `(${imagePreviews.length} selected)`}
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
                        <Upload size={16} />
                        Select Images
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageSelection}
                          className="hidden"
                        />
                      </label>
                      {uploadingImages && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <RefreshCw size={16} className="animate-spin" />
                          Uploading...
                        </div>
                      )}
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={preview.id} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={preview.url}
                                alt="Preview"
                                className="object-cover w-full h-full"
                              />
                              {!preview.isUploaded && (
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                                  <RefreshCw size={20} className="animate-spin text-white" />
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage()}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className={`bg-primaryColor text-white px-6 py-3 rounded-lg font-medium flex items-center text-sm gap-2 ${isSubmitting || uploadingImages ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primaryColor'
                    }`}
                  disabled={isSubmitting || uploadingImages}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {uploadingImages ? 'Uploading Images...' : 'Processing...'}
                    </>
                  ) : editingId ? (
                    'Update Blog Post'
                  ) : (
                    'Create Blog Post'
                  )}
                </button>

                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 text-sm"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Blog Post</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this blog post? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => showDeleteConfirm !== null && handleDelete(showDeleteConfirm)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                  disabled={deletingId === showDeleteConfirm}
                >
                  {deletingId === showDeleteConfirm ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}