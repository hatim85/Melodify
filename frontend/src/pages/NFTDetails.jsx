import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NFTContext } from '../context/NFTContext';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { getEthers } from '../utils/Ethers';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../utils/config';
import { shortenAddress } from '../utils/shortenAddress';

const NFTDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { fetchMetadata, buyNFT, currentAccount, listNFT, resellNFT, loading } = useContext(NFTContext);

  const [nft, setNft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [priceInput, setPriceInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      if (audio.currentTime >= 30) { // 30 second preview
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(Math.min(audio.duration, 30)); // Max 30 seconds
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
      navigate('/listed-nfts');
    } catch (err) {
      console.error('Listing failed:', err);
      alert('Failed to list NFT');
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading || !nft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading NFT details..." />
      </div>
    );
  }

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

  const showListButton = isOwner && !isListed && !wasListed;
  const showResellButton = isOwner && !isListed && wasListed;
  const listedByCurrentUser = nft.seller?.toLowerCase() === currentAccount?.toLowerCase();
const showBuyButton = isListed && !isOwner && !listedByCurrentUser;


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Media */}
        <div className="space-y-6">
          {/* NFT Image */}
          <div className="relative group">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Audio Player */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <span className="text-2xl">🎵</span>
                <span>Audio Preview</span>
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">30s preview</span>
            </div>

            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => {
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              className="hidden"
            />

            {/* Custom Audio Controls */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* NFT Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-slate-700">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{name}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{description}</p>
              </div>

              {/* Owner Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {owner ? owner.slice(2, 4).toUpperCase() : 'UN'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Owned by</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {isOwner ? 'You' : shortenAddress(owner)}
                  </p>
                </div>
              </div>

              {/* Price Display */}
              {isListed && (
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Price</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {price} ETH
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                {showListButton || showResellButton ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Set Price (ETH)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        placeholder="0.1"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <Button
                      label={showResellButton ? 'Resell NFT' : 'List on Marketplace'}
                      onClick={handleListOrResell}
                      disabled={!priceInput || loading}
                      loading={loading}
                      icon={showResellButton ? '🔄' : '📋'}
                      className="w-full"
                      size="lg"
                    />
                  </div>
                ) : showBuyButton ? (
                  <Button
                    label={`Buy for ${price} ETH`}
                    onClick={() => buyNFT(nft)}
                    disabled={loading}
                    loading={loading}
                    icon="💰"
                    variant="success"
                    className="w-full"
                    size="lg"
                  />
                ) : (
                  <div className="text-center p-6 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="text-4xl mb-2">🔒</div>
                    <p className="text-gray-600 dark:text-gray-400">This NFT is not for sale</p>
                  </div>
                )}
              </div>

              {/* Back Button */}
              <Button
                label="Back to Collection"
                onClick={() => navigate(-1)}
                variant="secondary"
                icon="←"
                className="w-full"
              />
            </div>
          </div>

          {/* NFT Properties */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <span className="text-xl">📊</span>
              <span>Properties</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Token ID</p>
                <p className="font-semibold text-gray-900 dark:text-white">#{tokenId}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Blockchain</p>
                <p className="font-semibold text-gray-900 dark:text-white">Ethereum</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;