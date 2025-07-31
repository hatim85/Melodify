// src/utils/pinata.js
import axios from 'axios';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY;

export const uploadFileToIPFS = async (file) => {
  if (!PINATA_JWT) throw new Error('Pinata JWT missing');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);
  formData.append('network', 'public');
  formData.append('keyvalues', JSON.stringify({ mimeType: file.type }));

  const res = await axios.post(
    'https://uploads.pinata.cloud/v3/files',
    formData,
    { headers: { Authorization: `Bearer ${PINATA_JWT}` } }
  );

  const cidhash = res.data.data.cid;
  const cid=`https://gateway.pinata.cloud/ipfs/${cidhash}`;
  console.log('File uploaded and pinned:', cid);

  return { success: true, cid };
};

// Upload and automatically pin JSON metadata
export const uploadJSONToIPFS = async (jsonData) => {
  if (!PINATA_JWT) throw new Error('Pinata JWT missing');

  const payload = {
    pinataContent: jsonData,
    pinataMetadata: { name: 'metadata.json' },
    pinataOptions: { cidVersion: 1 }
  };

  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PINATA_JWT}`
      }
    }
  );

  const cidhash = res.data.IpfsHash;
  const cid=`https://gateway.pinata.cloud/ipfs/${cidhash}`;
  console.log('JSON metadata uploaded and pinned:', cid);

  return { success: true, cid };
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
  fetchFromIPFS,
};