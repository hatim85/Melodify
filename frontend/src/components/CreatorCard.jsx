import React from 'react';
import { shortenAddress } from '../utils/shortenAddress';

const CreatorCard = ({ index, creator }) => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-4 text-center">
      <img
        src={creator.image}
        alt="creator"
        className="w-20 h-20 rounded-full mx-auto mb-4"
      />
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {shortenAddress(creator.address)}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Volume: {creator.volume} ETH
      </p>
      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
        #{index + 1}
      </span>
    </div>
  );
};

export default CreatorCard;
