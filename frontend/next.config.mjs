/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "/api",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_51T8nnFRtlBRWCJjP6yN2nPbjklvryI7wbIbDTBpkgnJzlsJTCigyLy0XjfxF5XzTJIUEWAMo55Zdkx7bnMW5xlrC00nof24gmR"
  },
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.transparenttextures.com" },
    ],
  },
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://m.stripe.network https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://api.stripe.com https://maps.googleapis.com; frame-src https://js.stripe.com; media-src 'self' blob:; object-src 'none';"
        },
      ],
    },
  ],
};

export default nextConfig;
