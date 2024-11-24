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
  const nftCurrency = 'ETH';

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

  // Upload Music File to IPFS via Pinata
  const uploadMusicToIPFS = async (file) => {
    try {
      const data = new FormData();
      data.append('file', file);

      const metadata = JSON.stringify({
        name: 'Music Upload',
        keyvalues: {
          type: 'audio',
        },
      });
      data.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 1,
      });
      data.append('pinataOptions', options);

      const result = await pinata.pinFileToIPFS(data);
      const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      return url;
    } catch (error) {
      console.error('Error uploading music to IPFS via Pinata:', error);
    }
  };

  // Upload JSON Metadata to IPFS via Pinata
  const uploadMetadataToIPFS = async (metadata) => {
    try {
      const result = await pinata.pinJSONToIPFS(metadata);
      const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      return url;
    } catch (error) {
      console.error('Error uploading metadata to IPFS via Pinata:', error);
    }
  };

  // Create an NFT with Metadata
  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return alert('All fields are required!');

    const metadata = {
      name,
      description,
      audio: fileUrl, // Link to the uploaded music file
    };

    try {
      const metadataUrl = await uploadMetadataToIPFS(metadata);
      await createSale(metadataUrl, price, false, null);
      router.push('/');
    } catch (error) {
      console.error('Error creating NFT:', error);
    }
  };

  // Create Sale on Smart Contract
  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();

    const transaction = !isReselling
      ? await contract.createToken(url, price, { value: listingPrice.toString() })
      : await contract.resellToken(id, price, { value: listingPrice.toString() });

    setIsLoadingNFT(true);
    await transaction.wait();
  };

  // Fetch NFTs from Marketplace
  const fetchNFTs = async () => {
    setIsLoadingNFT(false);

    const provider = new ethers.providers.JsonRpcProvider(`https://crossfi-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
    const contract = fetchContract(provider);

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const { data: { audio, name, description } } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

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

    return items;
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        connectWallet,
        currentAccount,
        uploadMusicToIPFS,
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
