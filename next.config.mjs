/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Set NEXT_DIST_DIR to build/run an isolated copy while another dev or prod
  // server holds `.next` (they cannot share a build directory).
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default nextConfig;
