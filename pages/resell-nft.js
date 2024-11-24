import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { NFTContext } from '../context/NFTContext';
import { Loader, Button, Input } from '../components';

const ResellNFT = () => {
  const { createSale, isLoadingNFT } = useContext(NFTContext);
  const router = useRouter();
  const { tokenId, tokenURI } = router.query;
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');

  // Fetch NFT details from tokenURI
  const fetchNFT = async () => {
    if (!tokenURI) return;

    const { data } = await axios.get(tokenURI);
    
    // Set metadata for Music NFT (audio URL, name, artist)
    setPrice(data.price);
    setImage(data.image);
    setAudioUrl(data.audioUrl);
    setSongName(data.name);
    setArtistName(data.artist);
  };

  useEffect(() => {
    if (tokenURI) fetchNFT();
  }, [tokenURI]);

  // Resell the Music NFT
  const resell = async () => {
    await createSale(tokenURI, price, true, tokenId);
    router.push('/');
  };

  if (isLoadingNFT) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black font-semibold text-2xl">Resell Music NFT</h1>

        <Input 
          inputType="number" 
          title="Price" 
          placeholder="NFT Price" 
          handleClick={(e) => setPrice(e.target.value)} 
        />

        {image && <img src={image} className="rounded mt-4" width={350} />}
        <div className="mt-4">
          <h2 className="font-poppins dark:text-white text-nft-black font-semibold text-lg">Song Details</h2>
          <p className="font-poppins dark:text-white text-nft-black text-base">Song: {songName}</p>
          <p className="font-poppins dark:text-white text-nft-black text-base">Artist: {artistName}</p>
        </div>

        {/* Audio Player for Preview */}
        {audioUrl && (
          <div className="mt-5">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="mt-7 w-full flex justify-end">
          <Button btnName="List Music NFT" classStyles="rounded-xl" handleClick={resell} />
        </div>
      </div>
    </div>
  );
};

export default ResellNFT;
