/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // NOTE: GROQ_API_KEY* are intentionally NOT listed here. The Next.js `env` config
  // block inlines values into the client-side JS bundle. These keys are only ever
  // read inside server-only app/api/*/route.ts files via process.env, which works
  // automatically without this block. Adding them here would ship the secrets to
  // every visitor's browser the moment any client component referenced them.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;