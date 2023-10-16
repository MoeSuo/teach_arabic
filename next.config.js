/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "images.google.com",
      'avatars.githubusercontent.com', // Add the problematic hostname here
    ],
   
  },

  reactStrictMode: true,
}

module.exports = nextConfig
