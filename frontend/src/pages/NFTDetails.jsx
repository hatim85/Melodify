import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NFTContext } from '../context/NFTContext';
import Loader from '../components/Loader';

const NFTDetails = () => {
  const { tokenId } = useParams();
  const { fetchSingleNFT, buyNFT, currentAccount } = useContext(NFTContext);
  const [nft, setNft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSingleNFT(tokenId).then((data) => {
      setNft(data);
      setIsLoading(false);
    });
  }, [tokenId]);

  if (isLoading || !nft) return <Loader />;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <img src={nft.image} alt={nft.name} className="w-full rounded-xl" />
      <h2 className="text-2xl font-bold mt-4">{nft.name}</h2>
      <p className="text-gray-600 mt-2">{nft.description}</p>
      <audio controls className="mt-4">
        <source src={nft.audio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="mt-4">
        {nft.owner.toLowerCase() === currentAccount.toLowerCase() ? (
          <button
            onClick={() => navigate(`/resell-nft/${nft.tokenId}?tokenURI=${nft.tokenURI}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            List on Marketplace
          </button>
        ) : (
          <button
            onClick={() => buyNFT(nft)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Buy for {nft.price} ETH
          </button>
        )}
      </div>
    </div>
  );
};

export default NFTDetails;