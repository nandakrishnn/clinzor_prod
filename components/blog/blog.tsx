"use client";

import { AnimatePresence } from "framer-motion";
import BlogList from "./BlogList";

const BlogApp = () => {
  return (
    <AnimatePresence mode="wait">
      <section className="max-w-7xl w-full mx-auto px-4 py-8">
        <BlogList />
      </section>
    </AnimatePresence>
  );
};

export default BlogApp;
