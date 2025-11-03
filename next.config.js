const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // General
      "images.unsplash.com",
      // Twitter/X
      "pbs.twimg.com",
      "abs.twimg.com",
      // Reddit
      "www.redditstatic.com",
      "i.redd.it",
      "external-preview.redd.it",
      "preview.redd.it",
      "a.thumbs.redditmedia.com",
      "b.thumbs.redditmedia.com",
      // YouTube
      "i.ytimg.com",
      "yt3.ggpht.com",
      "img.youtube.com",
      // Rednote (小红书)
      "sns-img-qc.xhscdn.com",
      "sns-img-bd.xhscdn.com",
      "sns-img-hw.xhscdn.com",
      "ci.rednote.com",
      "sns-avatar-qc.xhscdn.com",
      // Finnhub (Company Logos)
      "static.finnhub.io",
      "static2.finnhub.io",
      // Clearbit (Alternative Logo Source)
      "logo.clearbit.com",
      // Wikimedia Commons (S&P 500 Company Logos)
      "upload.wikimedia.org",
      // Supabase Storage
      "*.supabase.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 优化图片缓存配置
    minimumCacheTTL: 31536000, // 1年（秒）- 优化的图片缓存时间
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 配置静态资源缓存头
  async headers() {
    return [
      {
        // 匹配所有静态资源
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|mp4|ttf|otf|woff|woff2)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Next.js优化后的图片
        source: "/_next/image",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // 静态文件
        source: "/_next/static/:path*",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // CSP for Twitter embeds
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-src 'self' https://platform.twitter.com https://x.com https://twitter.com https://www.youtube.com https://embed.reddit.com; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://platform.twitter.com; " +
              "style-src 'self' 'unsafe-inline' https://platform.twitter.com; " +
              "img-src 'self' data: https: blob:; " +
              "font-src 'self' data: https:;",
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
