/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Windows: webpack filesystem cache can corrupt / fail to rename pack files (EPERM),
    // causing missing chunks and flaky CSS/JS loading in dev/build.
    if (process.platform === "win32") {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
