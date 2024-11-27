/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['gateway.pinata.cloud'],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    PINATA_API_KEY:process.env.PINATA_API_KEY,
    PINATA_API_SECRET:process.env.PINATA_API_SECRET,
    PINATA_GATEWAY:process.env.PINATA_GATEWAY,
    PINATA_JWT:process.env.PINATA_JWT,
    ALCHEMY_API_KEY:process.env.ALCHEMY_API_KEY,
    PRIVATE_KEY:process.env.PRIVATE_KEY
  },
};

module.exports = nextConfig;
