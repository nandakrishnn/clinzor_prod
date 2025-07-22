"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import BookingDashboard from "@/components/admin/bookingmanagement/PatientBookings";
import BlogManagement from "@/components/admin/blog/blogmanagement";
import { useState } from 'react';

// Initial mock blog data
const initialBlogPosts = [
  {
    id: 1,
    title: "Designing with Purpose",
    excerpt: "Exploring how intentional design choices create meaningful user experiences.",
    content: "Great design doesn't just happen by accident. It's the result of intentional decisions that prioritize the needs of users while achieving business goals.",
    author: "Sarah Miller",
    date: "April 28, 2025",
    category: "Design",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "The Evolution of Interfaces",
    excerpt: "How UI design has transformed over the decades and where it's headed next.",
    content: "User interfaces have come a long way since the early days of computing...",
    author: "Michael Chen",
    date: "April 24, 2025",
    category: "Technology",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "Minimalism in Digital Products",
    excerpt: "Why less continues to be more in the world of product design.",
    content: "Minimalism isn't just an aesthetic choice—it's a design philosophy...",
    author: "Alex Rivera",
    date: "April 20, 2025",
    category: "Design",
    readTime: "3 min read",
  }
];

export default function AdminBlogManagement() {
  const [posts, setPosts] = useState(initialBlogPosts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: '',
    category: '',
    readTime: '',
  });
  const [message, setMessage] = useState('');

  const resetForm = () => {
    setForm({ title: '', excerpt: '', content: '', author: '', date: '', category: '', readTime: '' });
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) {
      setMessage('Title, excerpt, and content are required.');
      return;
    }
    if (editingId) {
      setPosts(posts.map(post => post.id === editingId ? { ...post, ...form, id: editingId } : post));
      setMessage('Blog post updated!');
    } else {
      const newId = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;
      setPosts([{ ...form, id: newId }, ...posts]);
      setMessage('Blog post added!');
    }
    resetForm();
    setTimeout(() => setMessage(''), 2000);
  };

  const handleEdit = (post: typeof initialBlogPosts[number]) => {
    setForm({ ...post });
    setEditingId(post.id);
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
    setMessage('Blog post deleted!');
    setTimeout(() => setMessage(''), 2000);
    if (editingId === id) resetForm();
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
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update' : 'Add'} Blog Post
          </button>
          {editingId && (
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <h2 className="text-xl font-semibold mb-4">All Blog Posts</h2>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-bold text-lg">{post.title}</div>
              <div className="text-sm text-gray-600">{post.excerpt}</div>
              <div className="text-xs text-gray-400">By {post.author} | {post.date} | {post.category} | {post.readTime}</div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button className="bg-yellow-400 text-white px-3 py-1 rounded" onClick={() => handleEdit(post)}>Edit</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
