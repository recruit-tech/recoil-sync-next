/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
    newNextLinkBehavior: true,
  },
}

module.exports = nextConfig
