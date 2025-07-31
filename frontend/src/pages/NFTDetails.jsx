import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NFTContext } from '../context/NFTContext';
import Loader from '../components/Loader';
import { getEthers } from '../utils/Ethers';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../utils/config';

const NFTDetails = () => {
  const { tokenId } = useParams();
  const { fetchMetadata, buyNFT, currentAccount, listNFT, resellNFT } = useContext(NFTContext);

  const [nft, setNft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [priceInput, setPriceInput] = useState('');
  const audioRef = useRef(null);

 useEffect(() => {
  const fetchNFTDetails = async () => {
    try {
      const { contract } = await getEthers();
      const tokenURI = await contract.tokenURI(tokenId);
      const metadata = await fetchMetadata(tokenURI);
      const actualOwner = await contract.ownerOf(tokenId);

      const marketItem = await contract.getMarketItem(tokenId);

      const price = marketItem && marketItem.price
        ? ethers.formatUnits(marketItem.price.toString(), 'ether')
        : '0';

      const wasListed = marketItem && marketItem.price > 0n && marketItem.sold === true;

      // console.log('========= DEBUG NFT =========');
      // console.log('Token ID:', tokenId);
      // console.log('Token URI:', tokenURI);
      // console.log('Current Account:', currentAccount);
      // console.log('Actual Owner from contract:', actualOwner);
      // console.log('MarketItem Data:', marketItem);
      // console.log('Price:', price);
      // console.log('Was Listed Before:', wasListed);
      // console.log('Seller Address:', marketItem?.seller);
      // console.log('Market Contract Owner:', marketItem?.owner);

      setNft({
        tokenId,
        ...metadata,
        tokenURI,
        price,
        owner: actualOwner,
        contractOwner: marketItem.owner,
        seller: marketItem.seller,
        wasListed,
        sold: marketItem.sold,
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching NFT details:', error);
      setIsLoading(false);
    }
  };

  fetchNFTDetails();
}, [tokenId, fetchMetadata]);


  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime >= 5) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const handleListOrResell = async () => {
    if (!priceInput || isNaN(priceInput) || Number(priceInput) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      const action = showResellButton ? resellNFT : listNFT;
      await action(nft.tokenId, priceInput);
      alert('NFT listed successfully');
    } catch (err) {
      console.error('Listing failed:', err);
      alert('Failed to list NFT');
    }
  };

  if (isLoading || !nft) return <Loader />;

  const {
    name,
    description,
    image,
    music,
    owner,
    price,
    contractOwner,
    wasListed,
  } = nft;

  const imageUrl = image.startsWith('http') ? image : `https://gateway.pinata.cloud/ipfs/${image}`;
  const audioUrl = music.startsWith('http') ? music : `https://gateway.pinata.cloud/ipfs/${music}`;

  const marketplaceAddress = CONTRACT_ADDRESS.toLowerCase();
  

  const isOwner = owner?.toLowerCase() === currentAccount?.toLowerCase();
  const isListed = contractOwner?.toLowerCase() === marketplaceAddress;

  // Decide buttons based on ownership, listing status, and past listing history
  const showListButton = isOwner && !isListed && !wasListed;
  const showResellButton = isOwner && !isListed && wasListed;
  const showBuyButton = !isOwner && isListed;

//   console.log('=== Button Logic ===');
// console.log('isOwner:', isOwner);
// console.log('isListed:', isListed);
// console.log('wasListed:', wasListed);
// console.log('showListButton:', showListButton);
// console.log('showResellButton:', showResellButton);
// console.log('showBuyButton:', showBuyButton);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <img src={imageUrl} alt={name} className="w-full rounded-xl" />
      <h2 className="text-2xl font-bold mt-4">{name}</h2>
      <p className="text-gray-600 mt-2">{description}</p>

      <audio
        controls
        className="mt-4"
        src={audioUrl}
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
      >
        Your browser does not support the audio element.
      </audio>

      <div className="mt-6">
        {showListButton || showResellButton ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter price in ETH"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <button
              onClick={handleListOrResell}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {showResellButton ? 'Resell NFT' : 'List on Marketplace'}
            </button>
          </div>
        ) : showBuyButton ? (
          <button
            onClick={() => buyNFT(nft)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Buy for {price} ETH
          </button>
        ) : (
          <p className="text-sm text-gray-500">This NFT is not for sale.</p>
        )}
      </div>
    </div>
  );
};

export default NFTDetails;
