'use client'

import axios from 'axios';
import { ImagePlus } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function UploadImage({ serverUser }: { serverUser: any }) {
  const [resource, setResource] = useState<any | undefined>(undefined);

  const updateProfilePicture = async (imageData: any) => {
    console.log(imageData)
    try {
      const response = await axios.post('/api/avatar/update-profile-picture', {
        userId: serverUser?.id,
        profilePicture: imageData,
      });
      if (response.status === 200) {
        toast.success('Profile picture updated successfully');
        return response.data;
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  }

  return (
    <CldUploadWidget
      options={{ 
        sources: ['local', 'camera', 'google_drive'],
        clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
        maxImageFileSize: 2_000_000,
        folder: "avatars",
        thumbnailTransformation: [
          { width: 256, height: 256 },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      }}
      signatureEndpoint="/api/avatar/sign-cloudinary-params"
      onSuccess={async (result, { widget }) => {
        const info = result?.info;
        setResource(info);
        if(info?.url){
          updateProfilePicture(info?.url);
        }
      }}
      onQueuesEnd={(result, { widget }) => {
        widget.close();
      }}
    >
      {({ open }) => {
        function handleOnClick() {
          setResource(undefined);
          open();
        }
        return (
          <button onClick={handleOnClick}>
            <ImagePlus
              className='absolute right-0 top-0 text-gray-800 size-7 p-1 bg-white rounded-full'
            />
          </button>
        );
      }}
    </CldUploadWidget>

  )
}