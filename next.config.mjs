/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['ehvtdwqzdcncyllqzhwh.supabase.co'], // Remove 'https://' from the beginning
  },
};

export default nextConfig;
