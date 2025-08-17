"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogListView } from "@/components/blog/BlogListView";
import { BlogDetailView } from "@/components/blog/BlogDetailView";

// Simplified mock data generator focused on health content
const generateBlogPosts = () => {
  const categories = ["Health", "Nutrition", "Fitness", "Mental Health"];
  const authors = [
    {
      name: "Dr. Sarah Miller",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Alex Rivera",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    title: [
      "The Importance of Regular Health Check-ups",
      "Healthy Eating Habits for a Balanced Life",
      "Effective Exercises for a Stronger Body",
      "Managing Stress and Anxiety in Daily Life",
      "Sleep Hygiene: The Foundation of Good Health",
      "Understanding Your Body's Nutritional Needs",
      "Cardio vs. Strength Training: What You Need",
      "Mindfulness Techniques for Better Mental Health",
      "Preventive Care: Staying Ahead of Health Issues",
      "The Role of Hydration in Overall Wellness"
    ][i % 10],
    excerpt: [
      "Regular health check-ups are essential for maintaining overall well-being and early detection of potential health issues.",
      "A diet rich in fruits, vegetables, and whole grains supports healthy nutrition and promotes diverse benefits.",
      "Regular exercise is vital for building a stronger body and maintaining physical fitness.",
      "Managing stress and anxiety is essential for maintaining mental well-being in our fast-paced world.",
      "Quality sleep is just as important as diet and exercise for your overall health.",
      "Learn how to listen to your body's signals for optimal nutrition and energy.",
      "Understanding the benefits of different exercise types for a balanced fitness routine.",
      "Simple mindfulness practices that can transform your daily stress levels.",
      "How regular screenings and check-ups can prevent serious health problems.",
      "Why water is the most essential nutrient for your body's functions."
    ][i % 10],
    content: `<p>This is detailed content for post ${
      i + 1
    }. In a real application, this would be the full blog post content with proper HTML formatting.</p>`,
    author: authors[i % 3].name,
    authorImage: authors[i % 3].image,
    date: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }),
    category: categories[i % 4],
    readTime: `${Math.floor(Math.random() * 7) + 3} min read`,
    image: `https://picsum.photos/id/${Math.floor(
      Math.random() * 1000
    )}/800/600`,
    likes: Math.floor(Math.random() * 500),
    isTrending: i % 7 === 0,
    isFeatured: i % 10 === 0
  }));
};

const BlogApp = () => {
  const [currentView, setCurrentView] = useState("list");
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [visiblePosts, setVisiblePosts] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setBlogPosts(generateBlogPosts());
    }, 500);
  }, []);

  const handleReadMore = (postId: number) => {
    setCurrentPostId(postId);
    setCurrentView("detail");
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setCurrentView("list");
  };

  const loadMorePosts = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisiblePosts((prev) => Math.min(prev + 8, blogPosts.length));
      setIsLoading(false);
    }, 800);
  };

  const toggleSavePost = (postId: number) => {
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === "list" ? (
        <BlogListView
          blogPosts={blogPosts}
          visiblePosts={visiblePosts}
          isLoading={isLoading}
          hasMore={visiblePosts < blogPosts.length}
          savedPosts={savedPosts}
          handleReadMore={handleReadMore}
          loadMorePosts={loadMorePosts}
          toggleSavePost={toggleSavePost}
        />
      ) : (
        <BlogDetailView
          post={blogPosts.find((p) => p.id === currentPostId)}
          savedPosts={savedPosts}
          toggleSavePost={toggleSavePost}
          goBack={goBack}
          blogPosts={blogPosts}
          handleReadMore={handleReadMore}
        />
      )}
    </AnimatePresence>
  );
};

export default BlogApp;
