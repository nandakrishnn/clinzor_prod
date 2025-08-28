"use strict";

/** @type {import('next').NextConfig} */
var nextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "clinzor.s3.amazonaws.com",
      pathname: "/**" // ✅ allow all paths inside the bucket

    }, {
      protocol: "https",
      hostname: "clinzor.s3.ap-south-1.amazonaws.com",
      pathname: "/**" // ✅ allow all paths inside the bucket

    }, {
      protocol: "https",
      hostname: "bkd.clinzor.com",
      pathname: "/**"
    }, {
      protocol: "https",
      hostname: "images.unsplash.com",
      pathname: "/**"
    }]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};
module.exports = nextConfig;