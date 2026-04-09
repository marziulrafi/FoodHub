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

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed types: JPEG, PNG, WebP',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 5MB limit. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  return { valid: true };
};

export const getUploadSignature = async (): Promise<CloudinarySignature> => {
  const response = await fetch(`/api/cloudinary/signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to get upload signature from server');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to generate signature');
  }

  if (!data.data) {
    throw new Error('Invalid signature response from server');
  }

  return data.data;
};

export const uploadImageToCloudinary = async (
  file: File,
  signature: CloudinarySignature
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature.signature);
  formData.append('timestamp', signature.timestamp.toString());
  formData.append('api_key', signature.apiKey);
  formData.append('upload_preset', 'foodhub_unsigned');

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`;

  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const uploadedData = await response.json();

  return {
    secure_url: uploadedData.secure_url,
    public_id: uploadedData.public_id,
  };
};

export const saveImageMetadata = async (
  secure_url: string,
  public_id: string
): Promise<any> => {
  const response = await fetch(`/api/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      secure_url,
      public_id,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save image metadata');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to save image');
  }

  if (!data.data) {
    throw new Error('Invalid save-image response from server');
  }

  return data.data;
};


export const uploadImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<any> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    onProgress?.(10);
    const signature = await getUploadSignature();
    onProgress?.(30);

    const uploadResponse = await uploadImageToCloudinary(file, signature);
    onProgress?.(70);

    const savedImage = await saveImageMetadata(
      uploadResponse.secure_url,
      uploadResponse.public_id
    );
    onProgress?.(90);

    const optimizedUrl = uploadResponse.secure_url
      .replace('/upload/', '/upload/f_auto,q_auto/')
      .replace('http://', 'https://');

    onProgress?.(100);

    return {
      ...savedImage,
      optimizedUrl,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
