/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['https://jade-legal-quail-7.mypinata.cloud/ipfs/XKtAK2mMaV8SLd6umB6kbRE5T835Y6bYz3qhUK1DL3giSw1HRsIrtKps1sJsRiZI'],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
};

module.exports = nextConfig;