/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.vercel.run'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
