export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
}



export interface CloudinarySignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
}

export interface UploadResponse {
  secure_url: string;
  public_id: string;
}

export interface CloudinaryUploadResponse extends UploadResponse {
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  width: number;
  original_filename: string;
  resource_type: string;
  type: string;
  url: string;
  version: number;
}


export interface Image {
  id: string;
  url: string;
  publicId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  optimizedUrl?: string;
}

export interface ImageUploadData {
  id: string;
  url: string;
  publicId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageUploaderProps {
  onUploadSuccess?: (imageData: Image) => void;
  onUploadError?: (error: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024;



export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'thumb' | 'crop';
  radius?: number;
  quality?: 'auto' | 'best' | 'good' | 'eco' | 'low';
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
}


export interface UserWithImages {
  id: string;
  email: string;
  name: string;
  images: Image[];
}
