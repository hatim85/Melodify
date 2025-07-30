import React, { useEffect } from 'react';
import { useNFTContext } from '../context/NFTContext';
import NFTCard from '../components/NFTCard';

const Home = () => {
  const { nfts, fetchNFTs } = useNFTContext();

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Explore Music NFTs</h2>
      {nfts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft, i) => (
            <NFTCard key={i} nft={nft} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No NFTs found.</p>
      )}
    </div>
  );
};

export default Home;
