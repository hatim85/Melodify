import React, { useState } from 'react';
import { useNFTContext } from '../context/NFTContext';
import Input from '../components/Input';

const CreateNFT = () => {
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [image, setImage] = useState(null);
  const [music, setMusic] = useState(null);
  const { loading, setLoading, createNFT, uploadToIPFS } = useNFTContext();

  const handleChange = (e, name) => {
    setForm({ ...form, [name]: e.target.value });
  };

  const handleCreateNFT = async () => {
    if (!form.name || !form.description || !form.price || !image || !music) {
      alert('Please fill all fields and upload both files.');
      return;
    }
    try {
      setLoading(true);
      const coverUrl = await uploadToIPFS(image);
      const musicUrl = await uploadToIPFS(music);
      await createNFT(form.name, form.description, form.price, musicUrl, coverUrl);
    } catch (err) {
      console.error('NFT creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Music NFT</h1>

      <Input
        inputType="text"
        title="NFT Name"
        value={form.name}
        handleClick={(e) => handleChange(e, 'name')}
      />
      <Input
        inputType="textarea"
        title="Description"
        value={form.description}
        handleClick={(e) => handleChange(e, 'description')}
      />
      <Input
        inputType="number"
        title="Price (in ETH)"
        value={form.price}
        handleClick={(e) => handleChange(e, 'price')}
      />

      <div className="my-4">
        <label htmlFor="coverImage" className="text-sm font-medium block mb-1">
          Cover Image
        </label>
        <input
          id="coverImage"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="my-4">
        <label htmlFor="musicFile" className="text-sm font-medium block mb-1">
          Music File (MP3, WAV, etc.)
        </label>
        <input
          id="musicFile"
          type="file"
          accept="audio/*"
          onChange={(e) => setMusic(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleCreateNFT}
        disabled={loading}
        className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        {loading ? 'Uploading & Minting...' : 'Create NFT'}
      </button>
    </div>
  );
};

export default CreateNFT;
