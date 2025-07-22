import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, User, ArrowLeft, Calendar } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "Designing with Purpose",
    excerpt: "Exploring how intentional design choices create meaningful user experiences that resonate with users and drive business success.",
    content: `
      <p>Great design doesn't just happen by accident. It's the result of intentional decisions that prioritize the needs of users while achieving business goals.</p>
      <p>When we talk about designing with purpose, we're referring to the practice of making deliberate design choices that serve specific objectives. Every element, from typography to color choice, should have a reason for being there.</p>
      <h2>The Elements of Purposeful Design</h2>
      <p>Purposeful design considers all aspects of the user experience. It's about creating solutions that not only look beautiful but also function seamlessly and intuitively.</p>
      <h2>Beyond the Surface</h2>
      <p>Designing with purpose goes deeper than what's immediately visible. It's about understanding the why behind every decision and ensuring that form follows function in the most elegant way possible.</p>
    `,
    author: "Sarah Miller",
    date: "April 28, 2025",
    category: "Design",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    title: "The Evolution of Interfaces",
    excerpt: "How UI design has transformed over the decades and where it's headed next in our increasingly connected world.",
    content: `
      <p>User interfaces have come a long way since the early days of computing. From command-line interfaces to touch screens, and now to voice and gesture-based interactions, we've witnessed a remarkable evolution.</p>
      <h2>From Commands to Gestures</h2>
      <p>The 1980s saw the mainstream adoption of graphical user interfaces. The introduction of the mouse and windows changed everything, making computers accessible to a broader audience.</p>
      <h2>Present and Future Directions</h2>
      <p>Today's interfaces are increasingly conversational, ambient, and contextual. We're moving toward interfaces that understand not just what we want, but when and why we want it.</p>
    `,
    author: "Michael Chen",
    date: "April 24, 2025",
    category: "Technology",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    title: "Minimalism in Digital Products",
    excerpt: "Why less continues to be more in the world of product design and how to achieve meaningful simplicity.",
    content: `
      <p>Minimalism isn't just an aesthetic choice—it's a design philosophy that prioritizes clarity, usability, and focus. In digital products, minimalism helps users accomplish their goals without distraction.</p>
      <h2>The Benefits of Digital Minimalism</h2>
      <p>Minimalist design offers several advantages: faster load times, improved usability, and reduced cognitive load. When users aren't overwhelmed by choices, they can focus on what truly matters.</p>
      <h2>Minimalism vs. Simplicity</h2>
      <p>It's important to distinguish between minimalism and simplicity. Minimalism is about removing the unnecessary, while simplicity is about making the necessary easy to understand and use.</p>
    `,
    author: "Alex Rivera",
    date: "April 20, 2025",
    category: "Design",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
];

export default function BlogApp() {
  const [currentView, setCurrentView] = useState('list');
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);

  const handleReadMore = (postId: number) => {
    setCurrentPostId(postId);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setCurrentView('list');
  };

  const BlogListView = () => {
    const [hoveredTile, setHoveredTile] = useState<number | null>(null);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
      }
    };

    const tileVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
      }
    };

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"></div>
          <div className="relative max-w-6xl mx-auto px-6 py-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center"
            >
              <h1 className="text-6xl md:text-7xl font-light tracking-tight text-gray-900 mb-6">
                Stories
              </h1>
              <p className="text-xl md:text-2xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Thoughtful perspectives on design, technology, and the creative process.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-6xl mx-auto px-6 pb-24">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                className="group cursor-pointer"
                variants={tileVariants}
                onMouseEnter={() => setHoveredTile(post.id)}
                onMouseLeave={() => setHoveredTile(null)}
                onClick={() => handleReadMore(post.id)}
              >
                <div className="bg-white rounded-3xl overflow-hidden transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-2">
                  <div className="aspect-[4/3] overflow-hidden">
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      animate={{ scale: hoveredTile === post.id ? 1.05 : 1 }}
                      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>

                  <div className="p-8">
                    <div className="flex items-center mb-4 space-x-4">
                      <span className="text-sm font-medium text-blue-600 tracking-wide uppercase">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed font-light">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                          <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{post.author}</p>
                          <p className="text-sm text-gray-500">{post.date}</p>
                        </div>
                      </div>

                      <motion.div
                        className="flex items-center text-sm font-medium text-blue-600"
                        initial={{ x: 0 }}
                        animate={{ x: hoveredTile === post.id ? 4 : 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        Read <ChevronRight size={16} className="ml-1" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    );
  };

  const BlogDetailView = () => {
    const post = blogPosts.find(p => p.id === currentPostId);
    if (!post) return <div>Post not found</div>;

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Image */}
        <motion.div
          className="relative h-[60vh] md:h-[70vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          <motion.button
            className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center text-white bg-black/20 backdrop-blur-sm hover:bg-black/40 px-4 py-2 rounded-full transition-all duration-300"
            onClick={goBack}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Stories
          </motion.button>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
          <motion.div
            className="bg-white rounded-3xl shadow-2xl shadow-black/10 p-8 md:p-12 mb-16"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-full tracking-wide uppercase">
                {post.category}
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                <Clock size={14} className="mr-1" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8 text-gray-900 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center pb-8 border-b border-gray-100">
              <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-lg">{post.author}</p>
                <div className="flex items-center text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  <span className="text-sm">{post.date}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl shadow-lg shadow-black/5 p-8 md:p-12 mb-16"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              className="prose prose-lg prose-gray max-w-none"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.8',
                color: '#374151'
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1"
              onClick={goBack}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Stories
            </button>
          </motion.div>
        </div>
      </div>
    );
  };

  return currentView === 'list' ? <BlogListView /> : <BlogDetailView />;
}