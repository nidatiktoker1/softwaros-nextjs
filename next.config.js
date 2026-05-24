/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_API_KEY_2: process.env.GROQ_API_KEY_2,
    GROQ_API_KEY_3: process.env.GROQ_API_KEY_3,
  },
};

module.exports = nextConfig;