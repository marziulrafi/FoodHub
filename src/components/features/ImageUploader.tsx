'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { uploadImage } from '@/lib/uploadImage';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  onUploadSuccess?: (imageData: any) => void;
  onUploadError?: (error: string) => void;
  onClear?: () => void;
  initialImageUrl?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  onClear,
  initialImageUrl,
  label = 'Upload Image',
  className = '',
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<any | null>(
    initialImageUrl ? { optimizedUrl: initialImageUrl } : null
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      const imageData = await uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadedImage(imageData);
      setPreview(imageData.optimizedUrl || imageData.url);
      onUploadSuccess?.(imageData);
      toast.success('Image uploaded successfully!');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    setUploadProgress(0);
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear?.();
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />


      {!preview ? (
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${disabled || isUploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
        >
          <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-xs text-gray-500 mt-1">
            JPEG, PNG, or WebP (Max 5MB)
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Loader className="h-8 w-8 text-white animate-spin mx-auto" />
                  <p className="text-white text-sm mt-2">{uploadProgress}%</p>
                </div>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <div className="space-y-2">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {uploadedImage && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Upload complete!</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={disabled || isUploading || !fileInputRef.current?.files?.length}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${disabled || isUploading || !fileInputRef.current?.files?.length
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Uploading...
                  </div>
                ) : uploadedImage ? (
                  'Upload Another'
                ) : (
                  'Upload'
                )}
              </button>

              <button
                onClick={handleClear}
                disabled={disabled || isUploading}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${disabled || isUploading
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className={`w-full px-4 py-2 text-sm transition-colors ${disabled || isUploading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-500 hover:text-blue-600'
                }`}
            >
              Choose Different File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
