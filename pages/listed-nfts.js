import { useState, useEffect, useContext } from 'react';
import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard } from '../components';
import Image from 'next/image';

const ListedNFTs = () => {
  const { fetchMyNFTsOrListedNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs('fetchItemsListed')
      .then((items) => {
        // Filter out non-music NFTs (assuming music NFTs have an 'audioUrl')
        const musicNFTs = items.filter(item => item.audio);
        console.log("Music: ",musicNFTs)
        setNfts(musicNFTs);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flexCenter sm:p-4 p-16 min-h-screen">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">No Music NFTs Listed for Sale</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12 min-h-screen">
      <div className="w-full minmd:w-4/5">
        <div className="mt-4">
          <h2 className="font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2">Music NFTs Listed for Sale</h2>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            
            {/* {nfts.map((nft) => (
              <div key={nft.tokenId} className="w-64 m-4">
                <NFTCard nft={nft} />
                {nft.audioUrl && (
                  <audio controls className="mt-2 w-full">
                    <source src={nft.audioUrl} type="audio/mp3" />
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
                  <span className="text-lg font-bold">{nft.price ? `Price: ${nft.price} ETH` : 'Price not available'}</span>
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
      </div>
    </div>
  );
};

export default ListedNFTs;
