import React from 'react';

const SearchBar = ({ onHandleSearch, placeholder = "Search NFTs by name..." }) => {
  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <div className="flex items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all duration-200">
        {/* Search Icon */}
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onHandleSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg"
        />
        
        {/* Decorative Element */}
        <div className="hidden sm:flex items-center space-x-2 text-gray-400 dark:text-gray-500">
          <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 rounded border">⌘</kbd>
          <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 rounded border">K</kbd>
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10 opacity-50"></div>
    </div>
  );
};

export default SearchBar;