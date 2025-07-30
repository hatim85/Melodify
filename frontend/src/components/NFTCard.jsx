import React from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenAddress } from '../utils/shortenAddress';

const NFTCard = ({ nft }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md hover:shadow-xl p-4 cursor-pointer transition-all duration-300"
      onClick={() => navigate(`/nft-details/${nft.tokenId}`, { state: nft })}
    >
      <img src={nft.image} alt="nft" className="rounded-xl w-full h-60 object-cover" />
      <div className="mt-3">
        <h3 className="text-xl font-semibold truncate">{nft.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 truncate">{nft.description}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-400">Price</p>
          <p className="font-semibold">{nft.price} ETH</p>
        </div>
        <p className="text-xs mt-1 text-gray-500">Seller: {shortenAddress(nft.seller)}</p>
      </div>
    </div>
  );
};

export default NFTCard;