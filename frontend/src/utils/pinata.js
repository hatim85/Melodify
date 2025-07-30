// src/utils/pinata.js
import axios from 'axios';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY;

// Option 1: Direct API calls (less secure - exposes keys)
export const uploadFileToIPFS = async (file) => {
  if (!PINATA_JWT) throw new Error('Pinata JWT missing in env');

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify({ name: file.name }));
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      }
    );

    return {
      success: true,
      cid: response.data.IpfsHash,
      url: `${PINATA_GATEWAY_URL}${response.data.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading file:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};


export const uploadJSONToIPFS = async (jsonData) => {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      jsonData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      }
    );

    console.log('JSON uploaded:', response.data);
    return {
      success: true,
      cid: response.data.IpfsHash,
      url: `${PINATA_GATEWAY_URL}${response.data.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading JSON:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Option 2: Backend proxy approach (more secure)
export const uploadFileThroughBackend = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/upload-to-pinata', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      cid: response.data.cid,
      url: response.data.url,
    };
  } catch (error) {
    console.error('Error uploading through backend:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const uploadJSONThroughBackend = async (jsonData) => {
  try {
    const response = await axios.post('/api/upload-json-to-pinata', {
      data: jsonData,
    });

    return {
      success: true,
      cid: response.data.cid,
      url: response.data.url,
    };
  } catch (error) {
    console.error('Error uploading JSON through backend:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Utility function to fetch metadata from IPFS
export const fetchFromIPFS = async (cid) => {
  try {
   const response = await axios.get(`${cid}`);
    console.log('Fetched data from IPFS:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
};

export default {
  uploadFileToIPFS,
  uploadJSONToIPFS,
  uploadFileThroughBackend,
  uploadJSONThroughBackend,
  fetchFromIPFS,
};