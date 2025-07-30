import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { NFTContext } from '../context/NFTContext';
import Input from '../components/Input';
import Loader from '../components/Loader';

const ResellNFT = () => {
  const { tokenId } = useParams();
  const [searchParams] = useSearchParams();
  const tokenURI = searchParams.get('tokenURI');
  const { resellNFT } = useContext(NFTContext);
  const [price, setPrice] = useState('');
  const [nft, setNft] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(tokenURI)
      .then((res) => res.json())
      .then((meta) => setNft(meta));
  }, [tokenURI]);

  const handleResell = async () => {
    setIsLoading(true);
    await resellNFT(tokenId, price);
    setIsLoading(false);
    navigate('/');
  };

  if (!nft) return <Loader />;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <img src={nft.image} alt={nft.name} className="w-full rounded-xl" />
      <h2 className="text-2xl font-bold mt-4">{nft.name}</h2>
      <Input
        label="New Price in ETH"
        inputType="number"
        value={price}
        handleClick={(e) => setPrice(e.target.value)}
      />
      <button
        onClick={handleResell}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        disabled={isLoading || !price}
      >
        {isLoading ? 'Listing...' : 'List NFT'}
      </button>
    </div>
  );
};

export default ResellNFT;
