/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disables ESLint during builds
  },
};

module.exports = nextConfig; 