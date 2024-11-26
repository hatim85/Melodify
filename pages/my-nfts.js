import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';

import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard, Banner, SearchBar } from '../components';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const MyNFTs = () => {
  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]); // Store the processed array of NFTs
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSelect, setActiveSelect] = useState('Recently Added');

  useEffect(() => {
    fetchMyNFTsOrListedNFTs('fetchItemsListed')
      .then((items) => {
        console.log("Fetched Items:", items);

        // If the data is an object, convert it to an array using Object.values
        // const parsedItems = Array.isArray(items) ? items : Object.values(items);

        console.log("Parsed Items:", items);

        // Now filter for music NFTs by checking if the 'audio' field exists and is valid
        const musicNFTs = items.filter(item =>
          item.audio && typeof item.audio === 'string' && item.audio.trim() !== ''
        );

        console.log("Filtered Music NFTs:", musicNFTs);

        // Set state with the filtered data
        setNfts(musicNFTs);
        setNftsCopy(musicNFTs);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching NFTs:", error);
        setIsLoading(false);
      });
  }, []);



  useEffect(() => {
    if (nfts.length) {
      const sortedNfts = [...nfts];
      switch (activeSelect) {
        case 'Price (low to high)':
          setNfts(sortedNfts.sort((a, b) => a.price - b.price));
          break;
        case 'Price (high to low)':
          setNfts(sortedNfts.sort((a, b) => b.price - a.price));
          break;
        case 'Recently added':
        default:
          setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
          break;
      }
    }
  }, [activeSelect]);

  const onHandleSearch = (value) => {
    const filteredNfts = nftsCopy.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));
    setNfts(filteredNfts.length ? filteredNfts : nftsCopy);
  };

  const onClearSearch = () => setNfts(nftsCopy);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          name="Your Music NFTs"
          childStyles="text-center mb-4"
          parentStyles="h-80 justify-center"
        />
        <div className="flexCenter flex-col -mt-20 z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full">
            <Image
              src={images.creator1?.src || '/default-profile.png'}
              alt="Creator Profile"
              className="rounded-full object-cover"
              height={120}
              width={120}
              objectFit="cover"
            />
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">
            {shortenAddress(currentAccount)}
          </p>
        </div>
      </div>
      {nfts.length === 0 ? (
        <div className="flexCenter sm:p-4 p-16">
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">
            No Music NFTs Owned
          </h1>
        </div>
      ) : (
        <div className="sm:px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col">
          <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
            <SearchBar
              activeSelect={activeSelect}
              setActiveSelect={setActiveSelect}
              handleSearch={onHandleSearch}
              clearSearch={onClearSearch}
            />
          </div>
          <div className="mt-3 w-full flex flex-wrap">
            {/* {nfts.map((nft) => (
              <div key={nft.tokenId} className="w-64 m-4">
                <NFTCard nft={nft} onProfilePage />
                {nft.audio && (
                  <audio controls className="mt-2 w-full">
                    <source src={nft.audio} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))} */}

            {nfts && Object.values(nfts).map((nft, key) =>
              <div key={key}>
                {/* NFT Image */}
                <div className="relative w-full h-64">
                  <Image
                    src={nft.image || '/default-image.png'} // Ensure default image if no image URL
                    alt={nft.name}
                    className="rounded-lg object-cover"
                    height={256}
                    width={256}
                    objectFit="cover"
                  />
                </div>

                {/* NFT Name */}
                <p className="font-poppins dark:text-white text-nft-black-1 text-xl font-semibold mt-3">{nft.name}</p>

                {/* NFT Description */}
                <p className="font-poppins dark:text-white text-nft-black-2 text-sm mt-2">{nft.description || 'No description available'}</p>

                {/* NFT Price */}
                <div className="mt-2">
                  <span className="text-lg font-bold">{nft.price ? `Price: ${nft.price} XFI` : 'Price not available'}</span>
                </div>

                {/* Render audio player if audio exists */}
                {nft.audio && (
                  <audio controls className="mt-2 w-full">
                    <source src={nft.audio} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFTs;
