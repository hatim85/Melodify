/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
// import PinataSDK from '@pinata/sdk';
import { PinataSDK } from 'pinata-web3';
import { MarketAddress, MarketAddressABI } from './constants';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Pinata SDK
// const pinata = new PinataSDK({process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET});
// const pinata = new PinataSDK({pinataJwt:process.env.PINATA_JWT, pinataGateway:process.env.PINATA_GATEWAY});

export const NFTContext = React.createContext();

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const nftCurrency = 'XFI';

  // Check if Wallet is Connected
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No Accounts Found');
    }
  };

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  // Upload Music and Image Files to IPFS via Pinata
  const uploadFilesToIPFS = async (musicFile, imageFile) => {
    try {
      const formDataMusic = new FormData();
      formDataMusic.append('file', musicFile);

      const metadataMusic = JSON.stringify({
        name: 'Music Upload',
        keyvalues: {
          type: 'audio',
        },
      });
      formDataMusic.append('pinataMetadata', metadataMusic);

      const optionsMusic = JSON.stringify({
        cidVersion: 1,
      });
      formDataMusic.append('pinataOptions', optionsMusic);

      // Upload Music File
      const musicResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: formDataMusic,
      });

      const musicResult = await musicResponse.json();
      if (!musicResponse.ok) {
        throw new Error(`Failed to upload music: ${musicResult.error || 'Unknown error'}`);
      }

      const musicUrl = `${process.env.PINATA_GATEWAY}/ipfs/${musicResult.IpfsHash}`;

      // Upload Image File
      const formDataImage = new FormData();
      formDataImage.append('file', imageFile);

      const metadataImage = JSON.stringify({
        name: 'Image Upload',
        keyvalues: {
          type: 'image',
        },
      });
      formDataImage.append('pinataMetadata', metadataImage);

      const optionsImage = JSON.stringify({
        cidVersion: 1,
      });
      formDataImage.append('pinataOptions', optionsImage);

      const imageResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: formDataImage,
      });

      const imageResult = await imageResponse.json();
      if (!imageResponse.ok) {
        throw new Error(`Failed to upload image: ${imageResult.error || 'Unknown error'}`);
      }

      const imageUrl = `${process.env.PINATA_GATEWAY}/ipfs/${imageResult.IpfsHash}`;

      console.log('Music URL:', musicUrl);
      console.log('Image URL:', imageUrl);
      return { musicUrl, imageUrl };
    } catch (error) {
      console.error('Error uploading files to IPFS:', error);
      throw error;
    }
  };

  // Upload JSON Metadata to IPFS
  const uploadMetadataToIPFS = async (metadata) => {
    try {
      const body = {
        pinataContent: metadata, // The JSON content to pin
        pinataMetadata: {
          name: "NFT Metadata", // Optional, can be customized
        },
        pinataOptions: {
          cidVersion: 1, // Optional, specifies CID version
        },
      };

      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to upload JSON: ${result.error || "Unknown error"}`);
      }

      const url = `${process.env.PINATA_GATEWAY}/ipfs/${result.IpfsHash}`;
      console.log("Uploaded JSON URL:", url);
      return url;
    } catch (error) {
      console.error("Error uploading JSON to IPFS:", error);
      throw error;
    }
  };

  // Create an NFT with Music and Image Metadata
  const createNFT = async (formInput, musicFile, imageFile, router) => {
    const { name, description, price } = formInput;

    // Validate inputs
    if (!name || !description || !price || !musicFile || !imageFile) {
      alert('All fields are required!');
      return;
    }

    try {
      // Upload music and image to IPFS
      const { musicUrl, imageUrl } = await uploadFilesToIPFS(musicFile, imageFile);

      // Construct metadata
      const metadata = {
        name,
        description,
        audio: musicUrl, // Link to the uploaded music file
        image: imageUrl, // Link to the uploaded image
      };

      // Upload metadata to IPFS
      console.log('Uploading metadata to Pinata...');
      const metadataUrl = await uploadMetadataToIPFS(metadata);

      console.log('Metadata successfully pinned to IPFS:', metadataUrl);

      // Proceed with blockchain sale
      await createSale(metadataUrl, price, false, null);

      // Redirect user to the home page
      router.push('/');
    } catch (error) {
      console.error('Error creating NFT:', error);

      // Inform the user of the error
      alert(`Failed to create NFT: ${error.message}`);
    }
  };

  const buyNFT = async (nft) => {
    try {
      // Fetch contract and set up blockchain interaction
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      // Check if the associated media is pinned on Pinata (for metadata validation)
      const tokenURI = await contract.tokenURI(nft.tokenId);
      const { data: { image } } = await axios.get(tokenURI);
      const cid = image.split('/').pop();  // Extract the CID from the image URL
      const isPinned = await validateFileOnPinata(cid);

      if (!isPinned) {
        return alert('The NFT image is not pinned to Pinata!');
      }

      // Proceed with purchasing the NFT
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
      const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
      setIsLoadingNFT(true);
      await transaction.wait();
      setIsLoadingNFT(false);
    } catch (error) {
      console.error("Error buying NFT:", error);
      alert(`Error buying NFT: ${error.message}`);
    }
  };


  const validateFileOnPinata = async (cid) => {
    try {
      const response = await fetch(
        `https://api.pinata.cloud/data/pinList?cid=${cid}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok && result.rows.length > 0) {
        return true; // File is pinned
      }
      throw new Error('File not found or not pinned on Pinata');
    } catch (error) {
      console.error('Error validating file on Pinata:', error);
      return false;
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const cid = url.split('/').pop(); // Extract CID from the URL
    const isPinned = await validateFileOnPinata(cid);
    if (!isPinned) return alert('File is not pinned on Pinata!');

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'XFI');
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();

    const transaction = !isReselling
      ? await contract.createToken(url, price, { value: listingPrice.toString() })
      : await contract.resellToken(id, price, { value: listingPrice.toString() });

    setIsLoadingNFT(true);
    await transaction.wait();
  };


  const fetchNFTs = async () => {
    setIsLoadingNFT(false);

    const provider = new ethers.providers.JsonRpcProvider(`https://crossfi-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
    const contract = fetchContract(provider);

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const { data: { audio, name, description } } = await axios.get(tokenURI);

        const cid = audio.split('/').pop(); // Extract CID from the audio URL
        const isPinned = await validateFileOnPinata(cid);
        if (!isPinned) return null; // Skip unpinned files

        const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'XFI');

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          audio,
          name,
          description,
          tokenURI,
        };
      })
    );

    return items.filter((item) => item !== null); // Filter out unpinned items
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      setIsLoadingNFT(false);

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = type === 'fetchItemsListed'
        ? await contract.fetchItemsListed()
        : await contract.fetchMyNFTs();

      const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const { data: { image, name, description } } = await axios.get(tokenURI);

        // Check if image is pinned on Pinata
        const cid = image.split('/').pop(); // Extract CID from the image URL
        const isPinned = await validateFileOnPinata(cid);
        if (!isPinned) {
          return null; // Skip unpinned items
        }

        const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          image,
          name,
          description,
          tokenURI,
        };
      }));

      return items.filter((item) => item !== null); // Filter out unpinned items
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return [];
    }
  };


  useEffect(() => {
    checkIfWalletIsConnected();
    const initialize = async () => {
      try {
        const { data } = await fetchAuth();  // Fetch auth token from API
        auth.current = data;  // Store the auth token
        client.current = getClient(auth.current);  // Initialize the IPFS client with the token
      } catch (error) {
        console.error("Error fetching auth data:", error);
      }
    };

    initialize();
  }, []);


  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        connectWallet,
        currentAccount,
        uploadFilesToIPFS,
        createNFT,
        fetchNFTs,
        createSale,
        isLoadingNFT,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
