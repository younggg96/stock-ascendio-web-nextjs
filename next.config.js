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
      // Xiaohongshu (小红书)
      "sns-img-qc.xhscdn.com",
      "sns-img-bd.xhscdn.com",
      "sns-img-hw.xhscdn.com",
      "ci.xiaohongshu.com",
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
  },
};

module.exports = nextConfig;
