import { useState, useEffect, useContext } from 'react';
import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard } from '../components';

const ListedNFTs = () => {
  const { fetchMyNFTsOrListedNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs('fetchItemsListed')
      .then((items) => {
        // Filter out non-music NFTs (assuming music NFTs have an 'audioUrl')
        const musicNFTs = items.filter(item => item.audioUrl);
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
            {nfts.map((nft) => (
              <div key={nft.tokenId} className="w-64 m-4">
                <NFTCard nft={nft} />
                {/* Displaying an audio player if the NFT has an audioUrl */}
                {nft.audioUrl && (
                  <audio controls className="mt-2 w-full">
                    <source src={nft.audioUrl} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedNFTs;
