import React, { useState } from 'react';
import { useNFTContext } from '../context/NFTContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Banner from '../components/Banner';

const CreateNFT = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [image, setImage] = useState(null);
  const [music, setMusic] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { loading, createNFT, uploadToIPFS } = useNFTContext();

  const handleChange = (e, name) => {
    setForm({ ...form, [name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNFT = async () => {
    if (!form.name || !form.description || !image || !music) {
      alert('Please fill all fields and upload both files.');
      return;
    }

    try {
      const coverCid = await uploadToIPFS(image);
      const musicCid = await uploadToIPFS(music);
      await createNFT(form.name, form.description, musicCid, coverCid);
    } catch (err) {
      console.error('NFT creation failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Banner
        name="Create Music NFT"
        subtext="Transform your music into a unique digital collectible"
        gradient="from-purple-600 to-pink-600"
        icon="✨"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <span className="text-2xl">📝</span>
            <span>NFT Details</span>
          </h2>

          <Input
            inputType="text"
            title="NFT Name"
            placeholder="Enter a catchy name for your music NFT"
            value={form.name}
            handleClick={(e) => handleChange(e, 'name')}
            required
          />
          
          <Input
            inputType="textarea"
            title="Description"
            placeholder="Describe your music, inspiration, or story behind this NFT"
            value={form.description}
            handleClick={(e) => handleChange(e, 'description')}
            required
          />

          {/* File Upload Sections */}
          <div className="space-y-6">
            {/* Cover Image Upload */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                <span className="text-lg">🖼️</span>
                <span>Cover Image</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="coverImage"
                />
                <label
                  htmlFor="coverImage"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-200 bg-gray-50 dark:bg-slate-700/50"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload cover image</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Music File Upload */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                <span className="text-lg">🎵</span>
                <span>Music File</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setMusic(e.target.files[0])}
                  className="hidden"
                  id="musicFile"
                />
                <label
                  htmlFor="musicFile"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-200 bg-gray-50 dark:bg-slate-700/50"
                >
                  {music ? (
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎼</div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{music.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{(music.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎵</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload music file</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">MP3, WAV, FLAC up to 50MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <Button
            label="Mint NFT"
            onClick={handleCreateNFT}
            disabled={loading || !form.name || !form.description || !image || !music}
            loading={loading}
            icon="✨"
            className="w-full mt-8"
            size="lg"
          />
        </div>

        {/* Preview Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <span className="text-2xl">👀</span>
            <span>Preview</span>
          </h2>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-6 border-2 border-dashed border-gray-200 dark:border-slate-500">
            {/* Preview Image */}
            <div className="aspect-square bg-gray-200 dark:bg-slate-600 rounded-xl mb-4 overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="NFT Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400 dark:text-gray-500">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-sm">Cover image preview</p>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Details */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {form.name || 'NFT Name'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {form.description || 'NFT description will appear here...'}
              </p>
              
              {/* Music File Info */}
              {music && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-700 p-3 rounded-lg">
                  <span className="text-lg">🎵</span>
                  <span>{music.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center space-x-2">
              <span>💡</span>
              <span>Tips for Success</span>
            </h4>
            <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-1">
              <li>• Use high-quality cover art (at least 1000x1000px)</li>
              <li>• Write a compelling description</li>
              <li>• Ensure your music file is high quality</li>
              <li>• Consider your target audience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;