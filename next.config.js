/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["motion-sensors-polyfill", "@turf/helpers"],
};

module.exports = nextConfig;
