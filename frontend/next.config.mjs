/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.transparenttextures.com" },
    ],
  },
  // NOTE: trailingSlash must NOT be set to true in standalone mode.
  // It breaks _next/static/ asset resolution: the browser requests chunks
  // without a trailing slash but Next.js standalone would route them with one → 404.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://api.stripe.com https://maps.googleapis.com https://static.cloudflareinsights.com; frame-src https://js.stripe.com https://www.google.com https://maps.google.com; media-src 'self' blob: https://assets.mixkit.co; object-src 'none';"
        },
      ],
    },
  ],
};

export default nextConfig;
