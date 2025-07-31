// utils/shortenAddress.js
export const shortenAddress = (address) => {
  if (!address || typeof address !== 'string') return 'Unknown';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};