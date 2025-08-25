"use client";

import * as React from "react";
import { useState, useEffect } from 'react';
import { createBlog, deleteBlog, editBlog, GetAllBlog } from "@/service/admin/blogManagementService";
import { uploadFiles } from "@/service/uploadService/uploadService";
import { ImageIcon, Upload, RefreshCw, X } from 'lucide-react';

interface BlogPost {
  uuid: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  created_by: string;
  created_at: string;
  images?: string[]; // Array of image URLs
}

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  images: string[]; // Array of image URLs
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogForm>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: '',
    category: '',
    readTime: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]); // Added this state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await GetAllBlog();
      setPosts(data);
      console.log(data, "blog data");
    } catch (error) {
      console.error("fetching Blogs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setForm({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      date: '',
      category: '',
      readTime: '',
      images: []
    });
    setImagePreviews([]);
    setSelectedImages([]); // Reset selected images
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Fixed image selection handler
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Add to selected images state
      setSelectedImages(prev => [...prev, ...filesArray]);
      
      // Create previews for immediate UI feedback
      const newPreviews: ImagePreview[] = filesArray.map((file, index) => {
        const id = `preview-${Date.now()}-${index}`;
        const url = URL.createObjectURL(file);
        return { id, url, file };
      });
      
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = imagePreviews[index];
    
    // Remove from previews
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    // Remove from selected images
    setSelectedImages(prev => prev.filter(file => file !== imageToRemove.file));
    
    // If it was uploaded to server, remove from form images
    if (imageToRemove.isUploaded && imageToRemove.serverUrl) {
      setForm(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== imageToRemove.serverUrl)
      }));
    }
    
    // Clean up object URL to prevent memory leaks
    URL.revokeObjectURL(imageToRemove.url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title || !form.excerpt || !form.content) {
      setMessage('Title, excerpt, and content are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls = [...form.images]; // Start with existing images (for edit mode)

      // Upload new images if any are selected
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        try {
          const uploadedUrls = await uploadFiles(selectedImages);
          imageUrls = [...imageUrls, ...uploadedUrls];
          
          // Update previews to show they're uploaded
          setImagePreviews(prev => 
            prev.map(preview => {
              const fileIndex = selectedImages.findIndex(file => file === preview.file);
              if (fileIndex !== -1) {
                return {
                  ...preview,
                  isUploaded: true,
                  serverUrl: uploadedUrls[fileIndex]
                };
              }
              return preview;
            })
          );
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          setMessage("Failed to upload images");
          return;
        } finally {
          setUploadingImages(false);
        }
      }

      // Prepare the blog data with all image URLs
      const blogData = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        date: form.date,
        category: form.category,
        readTime: form.readTime,
        images: imageUrls
      };

      if (editingId) {
        const updatedBlog = await editBlog(editingId.toString(), blogData);
        setPosts(posts.map(post =>
          post.uuid === editingId ? { ...post, ...updatedBlog } : post
        ));
        setMessage('Blog post updated successfully!');
        await fetchBlogs();
      } else {
        const newBlog = await createBlog(blogData);
        setPosts([{
          ...newBlog,
          uuid: newBlog.uuid || Date.now()
        }, ...posts]);
        setMessage('Blog post created successfully!');
        await fetchBlogs();
      }

      resetForm();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      setMessage(`Error: ${error.response?.data?.message || 'Failed to save blog post'}`);
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      category: post.category,
      readTime: post.readTime,
      images: post.images || []
    });
    setEditingId(post.uuid);
    
    // Clear current previews and selected images
    setImagePreviews([]);
    setSelectedImages([]);
    
    // If editing and post has existing images, create previews for them
    if (post.images && post.images.length > 0) {
      const existingPreviews: ImagePreview[] = post.images.map((imgUrl, index) => ({
        id: `existing-${Date.now()}-${index}`,
        url: imgUrl,
        file: new File([], `existing-${index}`), // Placeholder file
        isUploaded: true,
        serverUrl: imgUrl
      }));
      setImagePreviews(existingPreviews);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);

    try {
      await deleteBlog(id.toString());
      setPosts(posts.filter(post => post.uuid !== id));
      setMessage('Blog post deleted successfully!');
      await fetchBlogs();
      if (editingId === id) {
        resetForm();
      }
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      setMessage(`Error: ${error.response?.data?.message || 'Failed to delete blog post'}`);
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, []);

  const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Format as "August 25, 2025"
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  

};
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Blog Management</h1>
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Title</label>
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
            <label className="block text-sm font-medium mb-1 text-gray-600">Author</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="author"
              placeholder="Author name"
              value={form.author}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600">Excerpt</label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="excerpt"
            placeholder="Short description"
            value={form.excerpt}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600">Content</label>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Publish Date</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="date"
              placeholder="April 28, 2023"
              value={form.date}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Category</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Read Time</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="readTime"
              placeholder="5 min read"
              value={form.readTime}
              onChange={handleChange}
            />
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
                        onClick={() => removeImage(index)}
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
        
        <div className="flex gap-3">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center ${
              isSubmitting || uploadingImages ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isSubmitting || uploadingImages}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {uploadingImages ? 'Uploading Images...' : 'Processing...'}
              </>
            ) : editingId ? (
              'Update Blog Post'
            ) : (
              'Add Blog Post'
            )}
          </button>
          
          {editingId && (
            <button
              type="button"
              className="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Blog Posts</h2>
        
        {posts.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <p className="text-gray-500">No blog posts found. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map(post => (
              <div key={post.uuid} className="bg-white p-5 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row md:items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{post.title}</h3>
                    <p className="text-gray-600 mb-2">{post.content}</p>
                    
                    {post.images && post.images.length > 0 && (
                      <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
                        {post.images.slice(0, 3).map((img, index) => (
                          <img 
                            key={index} 
                            src={img} 
                            alt={`Post image ${index+1}`} 
                            className="h-20 w-32 object-cover rounded-lg"
                          />
                        ))}
                        {post.images.length > 3 && (
                          <div className="h-20 w-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            +{post.images.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      By {post.created_by} | {formatDate(post.created_at)} | {post.category} | {post.readTime}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3 md:mt-0 md:ml-4">
                    <button
                      className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-200"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      className={`bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200 ${
                        deletingId === post.uuid ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      onClick={() => handleDelete(post.uuid)}
                      disabled={deletingId === post.uuid}
                    >
                      {deletingId === post.uuid ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}