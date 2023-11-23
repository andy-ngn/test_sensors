/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["motion-sensors-polyfill", "echarts", "zrender"],
};

module.exports = nextConfig;
