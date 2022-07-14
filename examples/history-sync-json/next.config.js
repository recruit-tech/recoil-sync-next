/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  experimental: {
    scrollRestoration: true,
    newNextLinkBehavior: true,
  },
}

module.exports = nextConfig
