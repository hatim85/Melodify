import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { NFTContext } from '../context/NFTContext';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const NFTCard = ({ nft, onProfilePage }) => {
  const { nftCurrency } = useContext(NFTContext);

  return (
    <Link href={{ pathname: '/music-nft-details', query: nft }}>
      <div className="flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
        <div className="relative w-full h-52 sm:h-36 minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
          {/* <Image src={nft.coverImage || images[`music${nft.id}`]} layout="fill" objectFit="cover" fill={true} alt={`music-nft-${nft.id}`} /> */}
        </div>
        <div className="mt-3 flex flex-col">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{nft.trackName}</p>
          <p className="font-poppins dark:text-gray-400 text-nft-gray-2 text-xs minlg:text-lg mt-1">{nft.artist}</p>
          <div className="flexBetween mt-2 minlg:mt-4 flex-row xs:flex-col xs:items-start xs:mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">{nft.price} <span className="normal">{nftCurrency}</span></p>
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">{shortenAddress(onProfilePage ? nft.owner : nft.seller)}</p>
          </div>
          <div className="mt-2">
            <p className="font-poppins dark:text-gray-400 text-nft-gray-2 text-xs">Genre: {nft.genre || 'Unknown'}</p>
            {nft.preview && (
              <audio controls className="mt-2 w-full">
                <source src={nft.preview} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NFTCard;
