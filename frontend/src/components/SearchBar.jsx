import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onHandleSearch }) => {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-xl shadow-sm mb-6">
      <FaSearch className="mx-2 text-gray-500" />
      <input
        type="text"
        placeholder="Search NFTs by name..."
        onChange={(e) => onHandleSearch(e.target.value)}
        className="flex-1 bg-transparent outline-none px-2 text-gray-700 dark:text-white"
      />
    </div>
  );
};

export default SearchBar;
