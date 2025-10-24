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
      "sns-avatar-qc.xhscdn.com",
    ],
  },
};

module.exports = nextConfig;
