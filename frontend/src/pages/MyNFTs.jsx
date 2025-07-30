import React, { useEffect, useState } from 'react';
import { useNFTContext } from '../context/NFTContext';
import NFTCard from '../components/NFTCard';
import Loader from '../components/Loader';

const MyNFTs = () => {
  const { fetchMyNFTs } = useNFTContext();
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyNFTs().then((items) => {
      setNfts(items);
      setIsLoading(false);
    });
  }, []);

  return isLoading ? <Loader /> : (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">My NFTs</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nfts.map((nft, i) => <NFTCard key={i} nft={nft} />)}
      </div>
    </div>
  );
};

export default MyNFTs;