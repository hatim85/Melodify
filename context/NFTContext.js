/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import axios from 'axios';
import { MarketAddress, MarketAddressABI } from './constants';
import dotenv from 'dotenv';
import { create as ipfsHttpClient } from 'ipfs-http-client'
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
  const auth = useRef(null);
  const client = useRef(null);

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

  const fetchAuth = async () => {
    const response = await fetch('/api/secure');
    const data = await response.json();
    console.log('Fetch auth data: ', data)
    return data;
  };

  // Maintain state for URLs
  let uploadedMusicUrl = null;
  let uploadedImageUrl = null;

  // Upload Music File to IPFS
  const uploadMusicToIPFS = async (musicFile) => {
    try {
      if (!musicFile) {
        alert('Please select a music file to upload.');
        return;
      }

      const formData = new FormData();
      formData.append('file', musicFile);

      const metadata = JSON.stringify({
        name: 'Music Upload',
        keyvalues: {
          type: 'audio',
        },
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 1,
      });
      formData.append('pinataOptions', options);

      console.log('Sending music file to Pinata...');

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to upload music: ${result.error || 'Unknown error'}`);
      }

      // uploadedMusicUrl = `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${result.IpfsHash}`;
      uploadedMusicUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      console.log('Music URL:', uploadedMusicUrl);

      checkIfBothUploaded();

      return uploadedMusicUrl;
    } catch (error) {
      console.error('Error uploading music to IPFS:', error);
      throw error;
    }
  };

  // Upload Image File to IPFS
  const uploadImageToIPFS = async (imageFile) => {
    try {
      if (!imageFile) {
        alert('Please select an image file to upload.');
        return;
      }

      const formData = new FormData();
      formData.append('file', imageFile);

      const metadata = JSON.stringify({
        name: 'Image Upload',
        keyvalues: {
          type: 'image',
        },
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 1,
      });
      formData.append('pinataOptions', options);

      console.log('Sending image file to Pinata...');

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${result.error || 'Unknown error'}`);
      }

      // uploadedImageUrl = `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${result.IpfsHash}`;
      uploadedImageUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      console.log('Image URL:', uploadedImageUrl);

      checkIfBothUploaded();

      return uploadedImageUrl;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
    }
  };


  // Check if both files are uploaded
  const checkIfBothUploaded = () => {
    if (uploadedMusicUrl && uploadedImageUrl) {
      console.log('Both files uploaded successfully!');
      console.log('Music URL:', uploadedMusicUrl);
      console.log('Image URL:', uploadedImageUrl);

      // Perform any final actions here (e.g., save URLs, update UI)
      return { uploadedImageUrl, uploadedMusicUrl };
    } else {
      console.log('Waiting for both files to be uploaded...');
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
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to upload JSON: ${result.error || "Unknown error"}`);
      }

      // const url = `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${result.IpfsHash}`;
      const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      console.log("Uploaded JSON URL:", url);
      return url;
    } catch (error) {
      console.error("Error uploading JSON to IPFS:", error);
      throw error;
    }
  };

  // Create an NFT with Music and Image Metadata
  const createNFT = async (formInput, router) => {
    const { name, description, price } = formInput;

    // Validate inputs
    if (!name || !description || !price || !uploadedMusicUrl || !uploadedImageUrl) {
      alert('All fields are required, including music and image uploads!');
      return;
    }

    try {
      // Construct metadata
      const metadata = {
        name,
        description,
        audio: uploadedMusicUrl, // URL of the uploaded music file
        image: uploadedImageUrl, // URL of the uploaded image file
      };

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
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
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
    try {
      const cid = url.split('/').pop(); // Extract CID from the URL
      const isPinned = await validateFileOnPinata(cid);
      if (!isPinned) return alert('File is not pinned on Pinata!');

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const price = ethers.utils.parseUnits(formInputPrice, "ether");
      const contract = fetchContract(signer);
      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, { value: listingPrice.toString() })
        : await contract.resellToken(id, price, { value: listingPrice.toString() });

      setIsLoadingNFT(true);
      const receipt=await transaction.wait();
      console.log('Transaction successful:', receipt);
    } catch (error) {
      console.error('Error during createSale:', error);
    }
  };


  const fetchNFTs = async () => {
    setIsLoadingNFT(false);

    const provider = new ethers.providers.JsonRpcProvider(`https://crossfi-testnet.g.alchemy.com/v2/3Vx8_tAtSAwagrnHSCstu5sXzRrR6ZRT`);
    const contract = fetchContract(provider);

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const { data: { audio, name, description } } = await axios.get(tokenURI);

        const cid = audio.split('/').pop(); // Extract CID from the audio URL
        const isPinned = await validateFileOnPinata(cid);
        if (!isPinned) return null; // Skip unpinned files

        const price = ethers.utils.formatUnits(unformattedPrice.toString(), "ether");

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
          uploadImageToIPFS,
          uploadMusicToIPFS,
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
      return error;
    }
  };

  const getClient = (auth) => {
    if (!auth) {
      throw new Error('Authorization token is required to initialize the IPFS client');
    }

    const responseClient = ipfsHttpClient({
      host: 'api.pinata.cloud',  // Pinata IPFS API host
      port: 443,                // Standard HTTPS port
      protocol: 'https',        // Use HTTPS for secure communication
      apiPath: '/api/v0',       // Default API path for Pinata
      headers: {
        authorization: auth,    // Include the authorization token in the headers
      },
    });

    return responseClient;
  };



  useEffect(() => {
    checkIfWalletIsConnected();
    console.log(process.env);
    console.log(process.env.BASE_URL)
    console.log("pinata api key: ", process.env.NEXT_PUBLIC_PINATA_API_KEY);
    console.log("alchemy api key: ", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
    console.log("pinata api secret: ", process.env.NEXT_PUBLIC_PINATA_API_SECRET);
    const initialize = async () => {
      try {
        const { data } = await fetchAuth();  // Fetch auth token from API
        console.log("data from auth: ", data);
        auth.current = data;  // Store the auth token
        console.log("auth.current after assignment: ", auth.current);

        // Assuming getClient is a function to initialize the IPFS client
        client.current = getClient(auth.current);
        console.log("Client initialized: ", client.current);
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
        createNFT,
        fetchNFTs,
        uploadImageToIPFS,
        uploadMusicToIPFS,
        createSale,
        isLoadingNFT,
        fetchAuth,
        buyNFT,
        fetchMyNFTsOrListedNFTs
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
