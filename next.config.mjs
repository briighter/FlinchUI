/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Set NEXT_DIST_DIR to build/run an isolated copy while another dev or prod
  // server holds `.next` (they cannot share a build directory).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Every page has a Markdown twin. The routes live under /md so the page
  // segments stay untouched; these rewrites expose the conventional `.md` URL
  // an agent or crawler will try first.
  async rewrites() {
    return [
      { source: '/index.md', destination: '/md' },
      { source: '/components.md', destination: '/md/components' },
      { source: '/components/:slug.md', destination: '/md/components/:slug' },
      { source: '/docs.md', destination: '/md/docs' },
      { source: '/docs/:slug.md', destination: '/md/docs/:slug' },
      { source: '/examples.md', destination: '/md/examples' },
      { source: '/examples/:slug.md', destination: '/md/examples/:slug' },
      { source: '/tools.md', destination: '/md/tools' },
      { source: '/tools/theme.md', destination: '/md/tools/theme' },
      { source: '/agents.md', destination: '/md/docs/agents' },
      { source: '/agents', destination: '/docs/agents' },
    ];
  },
};

export default nextConfig;
