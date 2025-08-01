"use client";

import * as React from "react";
import { useState, useEffect } from 'react';
import { createBlog, deleteBlog, editBlog, GetAllBlog } from "@/service/admin/blogManagementService";

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
}

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBlogs = async () => {
    try {
      const data = await GetAllBlog();
      setPosts(data);
      console.log(data, "blog data");
    } catch (error) {
      console.error("fetching Blogs error:", error);
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
      readTime: ''
    });
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title || !form.excerpt || !form.content) {
      setMessage('Title, excerpt, and content are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        const updatedBlog = await editBlog(editingId.toString(), {
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          author: form.author,
          date: form.date,
          category: form.category,
          readTime: form.readTime
        });

        setPosts(posts.map(post =>
          post.uuid === editingId ? { ...post, ...updatedBlog } : post
        ));
        setMessage('Blog post updated successfully!');
        fetchBlogs();
      } else {
        const newBlog = await createBlog({
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          author: form.author,
          date: form.date,
          category: form.category,
          readTime: form.readTime
        });

        setPosts([{
          ...newBlog,
          id: newBlog.id || Date.now()
        }, ...posts]);
        setMessage('Blog post created successfully!');
        fetchBlogs();
      }

      resetForm();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      setMessage(`Error: ${error.response?.data?.message || 'Failed to save blog post'}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 2000);
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
      readTime: post.readTime
    });
    setEditingId(post.uuid);
  };
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);

    try {
      await deleteBlog(id.toString());

      setPosts(posts.filter(post => post.uuid !== id));
      setMessage('Blog post deleted successfully!');
      fetchBlogs();
      if (editingId === id) {
        resetForm();
      }
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      setMessage(`Error: ${error.response?.data?.message || 'Failed to delete blog post'}`);
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(''), 2000);
    }
  };
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Blog Management</h1>
      {message && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{message}</div>}
      <form onSubmit={handleSubmit} className="mb-8 space-y-3 bg-gray-50 p-4 rounded">
        <input
          className="w-full p-2 border rounded"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          name="excerpt"
          placeholder="Excerpt"
          value={form.excerpt}
          onChange={handleChange}
        />
        <textarea
          className="w-full p-2 border rounded"
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          rows={5}
        />
        <input
          className="w-full p-2 border rounded"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          name="date"
          placeholder="Date (e.g. April 28, 2025)"
          value={form.date}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          name="readTime"
          placeholder="Read Time (e.g. 4 min read)"
          value={form.readTime}
          onChange={handleChange}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : editingId ? 'Update' : 'Add'} Blog Post
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <h2 className="text-xl font-semibold mb-4">All Blog Posts</h2>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.uuid} className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-bold text-lg">{post.title}</div>
              <div className="text-sm text-gray-600">{post.content}</div>
              <div className="text-xs text-gray-400">By {post?.created_by} | {post.date} | {post.category} | {post.readTime}</div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                className="bg-yellow-400 text-white px-3 py-1 rounded"
                onClick={() => handleEdit(post)}
              >
                Edit
              </button>
              <button
                className={`bg-red-500 text-white px-3 py-1 rounded ${deletingId === post.uuid ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                onClick={() => handleDelete(post.uuid)}
                disabled={deletingId === post.uuid}
              >
                {deletingId === post.uuid ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}