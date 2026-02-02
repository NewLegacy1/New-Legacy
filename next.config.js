/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    // Windows: webpack filesystem cache can corrupt (.pack.gz rename / missing chunks)
    // which causes intermittent "Cannot find module './xxx.js'" at runtime.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
