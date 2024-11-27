import { useEffect, useState, useRef, useContext } from 'react';
import { NFTContext } from '../context/NFTContext';
import { Banner, Loader, NFTCard, SearchBar } from '../components';

const Home = () => {
  const { fetchNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [activeSelect, setActiveSelect] = useState('Recently added');
  const [isLoading, setIsLoading] = useState(true);

  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  // Audio control references

  // const [userAddress, setUserAddress] = useState(null);

  // // Get current user's address
  // const getUserAddress = async () => {
  //   if (window.ethereum) {
  //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     setUserAddress(accounts[0]);
  //   }
  // };

  // useEffect(() => {
  //   getUserAddress(); // Fetch the user's address when the component mounts
  // }, []);

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    fetchNFTs()
      .then((items) => {
        if (isMounted) {
        // console.log("Items in index.js: ", items);

          // Filter out non-music NFTs (assuming music NFTs are identified by having an audio file URL)
          const musicNFTs = items.filter((item) => item.audio);
          // console.log("Music NFTs: ", musicNFTs);

          // Set the state only if the component is still mounted
          setNfts(musicNFTs);
          setNftsCopy(musicNFTs);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error('Error fetching NFTs: ', error);
        }
      });

    return () => {
      isMounted = false; // Cleanup: Mark the component as unmounted
    };
  }, []);
  // Dependency array does not include userAddress anymore

  // useEffect(() => {
  //   const sortedNfts = [...nfts];

  //   switch (activeSelect) {
  //     case 'Price (low to high)':
  //       setNfts(sortedNfts.sort((a, b) => a.price - b.price));
  //       break;
  //     case 'Price (high to low)':
  //       setNfts(sortedNfts.sort((a, b) => b.price - a.price));
  //       break;
  //     case 'Recently added':
  //       setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
  //       break;
  //     default:
  //       setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
  //       break;
  //   }
  // }, [activeSelect]);

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

  // useEffect(() => {
  //   isScrollable();
  //   window.addEventListener('resize', isScrollable);

  //   return () => {
  //     window.removeEventListener('resize', isScrollable);
  //   };
  // });

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
                {nfts && Object.values(nfts).map((nft, key) => <NFTCard key={key} nft={nft} image={nft.image} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
