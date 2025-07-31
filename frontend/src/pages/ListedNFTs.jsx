import React, { useEffect, useState } from 'react';
import { useNFTContext } from '../context/NFTContext';
import NFTCard from '../components/NFTCard';
import Loader from '../components/Loader';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';

const ListedNFTs = () => {
  const { fetchListedNFTs, currentAccount } = useNFTContext();
  const [nfts, setNfts] = useState([]);
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentAccount) {
      fetchListedNFTs().then((items) => {
        setNfts(items);
        setFilteredNFTs(items);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [currentAccount]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading your listed NFTs..." />
      </div>
    );
  }

  if (!currentAccount) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please connect your wallet to view your listed NFTs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Banner
        name="My Listed NFTs"
        subtext="Track and manage your NFTs currently for sale on the marketplace"
        gradient="from-orange-600 to-red-600"
        icon="📋"
      />

      {nfts.length > 0 && (
        <SearchBar 
          onHandleSearch={handleSearch} 
          placeholder="Search your listed NFTs..."
        />
      )}

      {/* Listing Stats */}
      {nfts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{nfts.length}</p>
                <p className="text-gray-600 dark:text-gray-400">Listed NFTs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {nfts.reduce((sum, nft) => sum + parseFloat(nft.price || 0), 0).toFixed(2)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Total Value (ETH)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {nfts.length > 0 ? (nfts.reduce((sum, nft) => sum + parseFloat(nft.price || 0), 0) / nfts.length).toFixed(3) : '0.000'}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Avg Price (ETH)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Active</p>
                <p className="text-gray-600 dark:text-gray-400">Status</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NFTs Grid */}
      <div className="mb-8">
        {filteredNFTs.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchTerm ? `Search Results (${filteredNFTs.length})` : `Listed for Sale (${nfts.length})`}
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNFTs.map((nft, i) => (
                <NFTCard key={`${nft.tokenId}-${i}`} nft={nft} />
              ))}
            </div>
          </>
        ) : nfts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No NFTs listed for sale
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You haven't listed any NFTs for sale yet. Start by creating or listing your existing NFTs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/create-nft'}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>✨</span>
                <span>Create NFT</span>
              </button>
              <button
                onClick={() => window.location.href = '/my-nfts'}
                className="bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
              >
                <span>💎</span>
                <span>View My NFTs</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No NFTs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No listed NFTs match "{searchTerm}". Try a different search term.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
            >
              Clear search and view all listed NFTs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListedNFTs;