import React, { useEffect, useState } from 'react';
import { useNFTContext } from '../context/NFTContext';
import NFTCard from '../components/NFTCard';
import SearchBar from '../components/SearchBar';
import Banner from '../components/Banner';
import Loader from '../components/Loader';

const Home = () => {
  const { nfts, fetchNFTs, loading } = useNFTContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNFTs, setFilteredNFTs] = useState([]);

  useEffect(() => {
    fetchNFTs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = nfts.filter(nft =>
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNFTs(filtered);
    } else {
      setFilteredNFTs(nfts);
    }
  }, [nfts, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading amazing music NFTs..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <Banner
        name="Discover Music NFTs"
        subtext="Explore unique digital music collectibles from talented artists around the world"
        gradient="from-indigo-600 via-purple-600 to-pink-600"
        icon="🎵"
      />

      {/* Search Bar */}
      <SearchBar onHandleSearch={handleSearch} />

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎼</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{nfts.length}</p>
              <p className="text-gray-600 dark:text-gray-400">Total NFTs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(nfts.map(nft => nft.seller)).size}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Artists</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💎</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {nfts.reduce((sum, nft) => sum + parseFloat(nft.price || 0), 0).toFixed(2)}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Total Volume (ETH)</p>
            </div>
          </div>
        </div>
      </div>

      {/* NFTs Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {searchTerm ? `Search Results (${filteredNFTs.length})` : 'Featured Music NFTs'}
          </h2>
          
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium flex items-center space-x-2"
            >
              <span>Clear Search</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {filteredNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map((nft, i) => (
              <NFTCard key={`${nft.tokenId}-${i}`} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No NFTs found' : 'No NFTs available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? `No music NFTs match "${searchTerm}". Try a different search term.`
                : 'Be the first to mint and list a music NFT on our marketplace!'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => window.location.href = '/create-nft'}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Create Your First NFT
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;