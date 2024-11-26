import { useEffect, useState, useRef, useContext } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { NFTContext } from '../context/NFTContext';
import { Banner, CreatorCard, Loader, NFTCard, SearchBar } from '../components';
import images from '../assets';
import { getCreators } from '../utils/getTopCreators';
import { shortenAddress } from '../utils/shortenAddress';

const Home = () => {
  const { fetchNFTs } = useContext(NFTContext);
  const [hideButtons, setHideButtons] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const { theme } = useTheme();
  const [activeSelect, setActiveSelect] = useState('Recently added');
  const [isLoading, setIsLoading] = useState(true);
  
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  
  // Audio control references
  const audioRefs = useRef([]);

  const [userAddress, setUserAddress] = useState(null);

  // Get current user's address
  const getUserAddress = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setUserAddress(accounts[0]);
    }
  };

  useEffect(() => {
    getUserAddress(); // Fetch the user's address when the component mounts
  }, []);

  useEffect(() => {
    fetchNFTs()
      .then((items) => {
        console.log("Items in index.js: ",items);
        // Filter out non-music NFTs (assuming music NFTs are identified by having an audio file URL)
        const musicNFTs = items.filter(item => item.audio); // Ensure there's an audioUrl field for music NFTs
        console.log("Music NFTs: ", musicNFTs);

        // Filter out NFTs that belong to the current user
        if (userAddress) {
          console.log(items[0].seller)
          const filteredNFTs = musicNFTs.filter(item => item.seller !== userAddress);
          
          setNfts(filteredNFTs);
          setNftsCopy(filteredNFTs);
        } else {
          setNfts(musicNFTs);
          setNftsCopy(musicNFTs);
        }

        setIsLoading(false);
      });
  }, [userAddress]); // Trigger the useEffect again when userAddress changes

  useEffect(() => {
    const sortedNfts = [...nfts];
    
    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
    }
  }, [activeSelect]);

  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));

    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  const handleScroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;
    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  const topCreators = getCreators(nftsCopy);

  // Function to handle the 10 second audio preview
  const handleAudioPreview = (index) => {
    const audioElement = audioRefs.current[index];
    if (audioElement) {
      audioElement.play();
      setTimeout(() => {
        audioElement.pause();
        audioElement.currentTime = 0;  // Reset to the start
      }, 10000); // 10 seconds
    }
  };

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name={(<>Discover, collect, and sell <br /> extraordinary Music NFTs</>)}
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyles="justify-start mb-7 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />

        {!isLoading && !nfts.length ? (
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">That&apos;s weird... No Music NFTs for sale!</h1>
        ) : isLoading ? <Loader /> : (
          <>
            <div>
              <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Top Music Creators</h1>
              <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
                <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
                  {/* Uncomment when you implement top creators */}
                  {/* {topCreators.map((creator, i) => (
                    <CreatorCard
                      key={creator.seller}
                      rank={i + 1}
                      creatorImage={images[`creator${i + 1}`]}
                      creatorName={shortenAddress(creator.seller)}
                      creatorEths={creator.sum}
                    />
                  ))} */}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">Hot Music NFTs</h1>
                <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />
                </div>
              </div>
              <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                {/* {nfts && Object.values(nfts).map((nft,key)=><NFTCard key={key} nft={nft} image={nft.image} /> )} */}
                {nfts && Object.values(nfts).map((nft, key) =>
                  <div key={key}>
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

                    <p className="font-poppins dark:text-white text-nft-black-1 text-xl font-semibold mt-3">{nft.name}</p>

                    <p className="font-poppins dark:text-white text-nft-black-2 text-sm mt-2">{nft.description || 'No description available'}</p>

                    <div className="mt-2">
                      <span className="text-lg font-bold">{nft.price ? `Price: ${nft.price} XFI` : 'Price not available'}</span>
                    </div>

                    {nft.audio && (
                      <div>
                        <audio
                          ref={(el) => audioRefs.current[key] = el}
                          className="mt-2 w-full"
                        >
                          <source src={nft.audio} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>
                        <button
                          onClick={() => handleAudioPreview(key)}
                          className="mt-2 text-blue-500 hover:text-blue-700"
                        >
                          Preview (10s)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;