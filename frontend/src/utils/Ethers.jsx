// utils/Ethers.js
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';

export async function getEthers() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed!');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const expectedChainId = '0xaa36a7'; // Sepolia chain ID
    const currentChainId = `0x${network.chainId.toString(16)}`;
    console.log('Current chain ID:', currentChainId, 'Expected chain ID:', expectedChainId);
    if (currentChainId !== expectedChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: expectedChainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/mvDywxIpGQXBPg9KVQNXh'],
                nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } else {
          throw new Error(`Please connect to the correct network (chainId: ${expectedChainId})`);
        }
      }
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    if (!contract) {
      throw new Error('Failed to initialize contract. Check CONTRACT_ADDRESS and CONTRACT_ABI.');
    }
    console.log('Contract initialized at:', CONTRACT_ADDRESS);
    return { provider, signer, contract };
  } catch (error) {
    console.error('Ethers setup failed:', error);
    throw error;
  }
}