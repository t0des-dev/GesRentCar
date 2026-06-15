/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "/api",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_51T8nnFRtlBRWCJjP6yN2nPbjklvryI7wbIbDTBpkgnJzlsJTCigyLy0XjfxF5XzTJIUEWAMo55Zdkx7bnMW5xlrC00nof24gmR"
  },
  output: "standalone",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
