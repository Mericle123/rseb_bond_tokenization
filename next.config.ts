// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
   typescript: {
    // ❗ Let builds succeed even if there are TS errors
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
