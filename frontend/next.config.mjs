/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
