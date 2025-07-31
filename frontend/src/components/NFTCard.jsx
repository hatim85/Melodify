import React from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenAddress } from '../utils/shortenAddress';

const NFTCard = ({ nft }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-600"
      onClick={() => navigate(`/nft-details/${nft.tokenId}`, { state: nft })}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-4 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          {nft.price} ETH
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            {nft.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1">
            {nft.description}
          </p>
        </div>

        {/* Seller Info */}
        {nft.seller && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {nft.seller ? nft.seller.slice(2, 4).toUpperCase() : 'UN'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Seller</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {shortenAddress(nft.seller)}
                </p>
              </div>
            </div>

            {/* Music Icon */}
            <div className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-200">
              🎵
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard;