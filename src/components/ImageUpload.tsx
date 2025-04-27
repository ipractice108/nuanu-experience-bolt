import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export function ImageUpload({ onImageUpload, onCancel, showCancel = true }: ImageUploadProps) {
  const { user } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      // Check if user is authenticated and is a manager
      if (!user || user.role !== 'manager') {
        throw new Error('Unauthorized: Only managers can upload images');
      }

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        // Try to refresh the session
        const { data: { session: refreshedSession }, error: refreshError } = 
          await supabase.auth.refreshSession();

        if (refreshError || !refreshedSession) {
          throw new Error('No active session found');
        }
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `experience-images/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onImageUpload(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.message === 'No active session found') {
        alert('Your session has expired. Please refresh the page and try again.');
      } else if (error.message === 'Unauthorized: Only managers can upload images') {
        alert('Only managers can upload images.');
      } else {
        alert('Failed to upload image. Please try again.');
      }
    }
  }, [onImageUpload, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-nuanu bg-nuanu/5' : 'border-gray-300 hover:border-nuanu/50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isDragActive ? (
            <>
              <Upload className="w-8 h-8 text-nuanu" />
              <p className="text-nuanu">Drop the image here</p>
            </>
          ) : (
            <>
              <Image className="w-8 h-8 text-gray-400" />
              <p className="text-gray-600">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, GIF (max 5MB)
              </p>
            </>
          )}
        </div>
      </div>

      {showCancel && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel Upload
        </button>
      )}
    </div>
  );
}