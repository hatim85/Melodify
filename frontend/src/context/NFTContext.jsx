import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useContext } from 'react';
import { getEthers } from '../utils/Ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../utils/config';
import { uploadFileToIPFS, uploadJSONToIPFS, fetchFromIPFS } from '../utils/pinata';
import { useNavigate } from 'react-router-dom';

export const NFTContext = createContext();

export const NFTProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentAccount, setCurrentAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nfts, setNFTs] = useState([]);
  const [listedNFTs, setListedNFTs] = useState([]);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        console.log('Connected account:', accounts[0]);
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
      setError('Failed to check wallet connection.');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        throw new Error('No accounts found.');
      }
      setCurrentAccount(accounts[0]);
      console.log('Connected account:', accounts[0]);
    } catch (err) {
      console.error('Wallet connection failed:', err);
      setError('Failed to connect wallet.');
    }
  };

  const uploadToIPFS = async (file) => {
    try {
      setLoading(true);
      console.log('Uploading file to Pinata IPFS:', file);
      
      const result = await uploadFileToIPFS(file);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log('File uploaded to IPFS URL:', result.url);
      return result.url;
    } catch (err) {
      console.error('Pinata upload error:', err);
      setError('Failed to upload to IPFS.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createNFT = async (name, desc, price, musicUrl, coverUrl) => {
    console.log('Creating NFT with values:', { name, desc, price, musicUrl, coverUrl });
    const metadata = { name, description: desc, music: musicUrl, image: coverUrl };
    setLoading(true);
    try {
      const result = await uploadJSONToIPFS(metadata);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log('NFT Metadata uploaded to:', result.url);
      await createSale(result.url, price);
    } catch (err) {
      console.error('NFT creation error:', err);
      setError('Failed to create NFT.');
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (url, formInputPrice, isReselling = false, id = null) => {
    try {
      console.log('Creating sale...');
      const { contract } = await getEthers();

      const price = ethers.parseUnits(formInputPrice, 'ether');
      const listingPrice = await contract.getListingPrice();
      console.log('Parsed sale price:', price.toString());
      console.log('Listing fee from contract:', listingPrice.toString());

      // Validate parameters
      if (!url || !url.startsWith('https://')) {
        throw new Error('Invalid IPFS URL');
      }
      if (!formInputPrice || isNaN(formInputPrice) || Number(formInputPrice) <= 0) {
        throw new Error('Invalid price');
      }

      let transaction;
      if (isReselling) {
        if (!contract.resellToken) {
          throw new Error('resellToken function not found in contract ABI');
        }
        console.log(`Reselling token ID ${id} with price ${price.toString()}`);
        transaction = await contract.resellToken(id, price, {
          value: listingPrice,
        });
      } else {
        if (!contract.createToken) {
          throw new Error('createToken function not found in contract ABI');
        }
        console.log(`Creating new token with URL ${url} and price ${price.toString()}`);
        transaction = await contract.createToken(url, price, {
          value: listingPrice,
        });
      }

      setLoading(true);
      console.log('Waiting for transaction to be mined...');
      const receipt = await transaction.wait();
      console.log('Transaction confirmed:', receipt);
      setLoading(false);
    } catch (error) {
      console.error('Error creating sale:', error);
      setError(`Transaction failed: ${error.reason || error.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  const fetchMetadata = async (tokenURI) => {
    try {
      console.log('Fetching metadata from tokenURI:', tokenURI);
      const gatewayKey = import.meta.env.VITE_PINATA_GATEWAY_KEY;
      if (!gatewayKey) {
        throw new Error('Pinata Gateway Key is not configured in .env');
      }

      const response = await axios.get(tokenURI, {
        headers: {
          'X-Pinata-Gateway-Key': gatewayKey, // Pass Gateway Key in headers
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  };

  const fetchMyNFTs = async () => {
    try {
      const { contract } = await getEthers();
      const data = await contract.fetchMyNFTs();
      
      const items = await Promise.all(
        data.map(async (item) => {
          try {
            const tokenURI = await contract.tokenURI(item.tokenId);
            const metadata = await fetchMetadata(tokenURI);
            
            return {
              tokenId: Number(item.tokenId),
              seller: item.seller,
              owner: item.owner,
              price: ethers.formatUnits(item.price.toString(), 'ether'),
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
              music: metadata.music,
              tokenURI,
            };
          } catch (metaErr) {
            console.warn(`Metadata fetch error for tokenId ${item.tokenId}:`, metaErr);
            return null;
          }
        })
      );
      
      const filteredItems = items.filter(Boolean);
      return filteredItems;
    } catch (err) {
      console.error('Error fetching My NFTs:', err);
      setError('Failed to fetch your NFTs.');
      return [];
    }
  };

  const fetchListedNFTs = async () => {
    try {
      const { contract } = await getEthers();
      const data = await contract.fetchItemsListed();
      console.log('Raw fetchItemsListed data:', data);
      
      if (!Array.isArray(data) || data.length === 0) {
        setListedNFTs([]);
        return [];
      }

      const items = await Promise.all(
        data.map(async (item) => {
          try {
            // Handle both array and object formats
            const tokenId = Number(item.tokenId || item[0]);
            const seller = item.seller || item[1];
            const owner = item.owner || item[2];
            const price = ethers.formatUnits((item.price || item[3]).toString(), 'ether');

            const tokenURI = await contract.tokenURI(tokenId);
            const metadata = await fetchFromIPFS(tokenURI);
            console.log(`Fetched metadata for tokenId ${tokenId}:`, metadata);
            return {
              tokenId,
              seller,
              owner,
              price,
              image: metadata.image || metadata.img || '',
              name: metadata.name || '',
              description: metadata.description || '',
              music: metadata.music || metadata.audio || '',
              tokenURI,
            };
          } catch (err) {
            console.warn(`Processing error for tokenId ${item.tokenId || item[0]}:`, err);
            return null;
          }
        })
      );

      const filteredItems = items.filter(Boolean);
      setListedNFTs(filteredItems);
      return filteredItems;
    } catch (err) {
      console.error('Error fetching listed NFTs:', err);
      setError('Failed to fetch listed NFTs.');
      return [];
    }
  };

  const fetchNFTs = async () => {
    try {
      const { contract } = await getEthers();
      const data = await contract.fetchMarketItems();
      
      if (!Array.isArray(data) || data.length === 0) {
        setNFTs([]);
        return;
      }
      
      console.log('Raw fetchMarketItems data:', data);

      const items = await Promise.all(
        data.map(async (item) => {
          try {
            const tokenURI = await contract.tokenURI(item.tokenId);
            const metadata = await fetchMetadata(tokenURI);
            
            return {
              tokenId: Number(item.tokenId),
              seller: item.seller,
              owner: item.owner,
              price: ethers.formatUnits(item.price.toString(), 'ether'),
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
              music: metadata.music,
              tokenURI,
            };
          } catch (metaErr) {
            console.warn(`Metadata fetch error for tokenId ${item.tokenId}:`, metaErr);
            return null;
          }
        })
      );

      const filteredItems = items.filter(Boolean);
      setNFTs(filteredItems);
    } catch (err) {
      console.error('Error in fetchNFTs:', err);
      setNFTs([]);
      setError('Failed to fetch NFTs.');
    }
  };

  const buyNFT = async (nft) => {
    try {
      setLoading(true);
      const { contract } = await getEthers();
      const price = ethers.parseUnits(nft.price.toString(), 'ether');
      
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      
      await transaction.wait();
      console.log('NFT purchased successfully');
      
      // Refresh NFTs after purchase
      await fetchNFTs();
      await fetchMyNFTs();
    } catch (error) {
      console.error('Error buying NFT:', error);
      setError(`Purchase failed: ${error.reason || error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        setCurrentAccount(accounts[0] || '');
        console.log('Account changed:', accounts[0] || 'None');
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <NFTContext.Provider
      value={{
        currentAccount,
        connectWallet,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        createSale,
        fetchMyNFTs,
        fetchListedNFTs,
        buyNFT,
        nfts,
        listedNFTs,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export const useNFTContext = () => useContext(NFTContext);