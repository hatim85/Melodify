import { useState, useCallback, useMemo, useContext } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { NFTContext } from '../context/NFTContext';
import { Button, Input, Loader } from '../components';
import images from '../assets';

const CreateMusicNFT = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [formInput, setFormInput] = useState({ price: '', name: '', description: '' });
  const { theme } = useTheme();
  const { isLoadingNFT, uploadMusicToIPFS, uploadImageToIPFS, createNFT } = useContext(NFTContext);
  const router = useRouter();

  // Music file upload handler
const onDropMusic = useCallback(async (acceptedFile) => {
  try {
    const url = await uploadMusicToIPFS(acceptedFile[0]);
    console.log("Uploaded music file URL:", url); // Add logging to check the result
    setFileUrl(url);
  } catch (error) {
    console.error("Error uploading music:", error);
  }
}, [uploadMusicToIPFS]);

// Cover photo upload handler
const onDropCover = useCallback(async (acceptedFile) => {
  try {
    const url = await uploadImageToIPFS(acceptedFile[0]);
    console.log("Uploaded cover image URL:", url); // Add logging to check the result
    setCoverUrl(url);
  } catch (error) {
    console.error("Error uploading cover image:", error);
  }
}, [uploadImageToIPFS]);


  const musicDropzoneProps = useDropzone({
    onDrop: onDropMusic,
    accept: 'audio/*',
    maxSize: 50000000,
  });

  const coverDropzoneProps = useDropzone({
    onDrop: onDropCover,
    accept: 'image/*', // Accept only image files
    maxSize: 5000000, // Limit image file size to 5MB
  });

  const fileStyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${musicDropzoneProps.isDragActive ? ' border-file-active' : ''} 
    ${musicDropzoneProps.isDragAccept ? ' border-file-accept' : ''} 
    ${musicDropzoneProps.isDragReject ? ' border-file-reject' : ''}`
  ), [musicDropzoneProps.isDragActive, musicDropzoneProps.isDragReject, musicDropzoneProps.isDragAccept]);

  if (isLoadingNFT) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  const handleCreateNFT = async () => {
    // Validate inputs before creating the NFT
    if (!formInput.name || !formInput.description || !formInput.price || !fileUrl || !coverUrl) {
      alert('All fields and files are required!');
      console.log("name: ",formInput.name);
      console.log("description: ",formInput.description);
      console.log("price: ",formInput.price);
      console.log("fileUrl: ",fileUrl);
      console.log("coverUrl: ",coverUrl);
      return;
    }

    try {
      // Call createNFT with the appropriate data
      await createNFT(formInput, router);
    } catch (error) {
      console.error('Error creating NFT:', error);
      alert('Failed to create NFT');
    }
  };

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">Create new Music NFT</h1>

        {/* Music Upload Section */}
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">Upload Music File</p>
          <div className="mt-4">
            <div {...musicDropzoneProps.getRootProps()} className={fileStyle}>
              <input {...musicDropzoneProps.getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">MP3, WAV, OGG. Max 50MB.</p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit="contain"
                    alt="file upload"
                    className={theme === 'light' ? 'filter invert' : undefined}
                  />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">Drag and Drop Music File</p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">Or browse music on your device</p>
              </div>
            </div>
            {fileUrl && (
              <aside>
                <audio controls>
                  <source src={fileUrl} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </aside>
            )}
          </div>
        </div>

        {/* Cover Photo Upload Section */}
        <div className="mt-8">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">Upload Cover Photo</p>
          <div className="mt-4">
            <div {...coverDropzoneProps.getRootProps()} className={fileStyle}>
              <input {...coverDropzoneProps.getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">JPG, PNG, SVG. Max 5MB.</p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit="contain"
                    alt="cover upload"
                    className={theme === 'light' ? 'filter invert' : undefined}
                  />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">Drag and Drop Cover Photo</p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">Or browse image on your device</p>
              </div>
            </div>
            {coverUrl && (
              <aside>
                <img src={coverUrl} alt="Cover Preview" className="mt-4 rounded-md w-full" />
              </aside>
            )}
          </div>
        </div>

        {/* Form Inputs */}
        <Input
          inputType="input"
          title="Name"
          placeholder="Music NFT Name"
          handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />
        <Input
          inputType="textarea"
          title="Description"
          placeholder="Music Description"
          handleClick={(e) => setFormInput({ ...formInput, description: e.target.value })}
        />
        <Input
          inputType="number"
          title="Price"
          placeholder="Music NFT Price"
          handleClick={(e) => setFormInput({ ...formInput, price: e.target.value })}
        />

        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="Create Music NFT"
            className="rounded-xl"
            handleClick={handleCreateNFT} // Only calls createNFT if all fields are filled
          />
        </div>
      </div>
    </div>
  );
};

export default CreateMusicNFT;
