import axios from 'axios';

// ImgBB API key from environment variables
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

/**
 * Compresses an image to reduce file size
 * @param base64Image - Base64 encoded image
 * @param maxSizeKB - Maximum size in KB (default: 800KB)
 * @returns Promise resolving to compressed base64 image
 */
export const compressImage = (base64Image: string, maxSizeKB = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.src = base64Image;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxDimension = 1200;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Failed to get canvas context'));
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        let compressed = canvas.toDataURL('image/jpeg', quality);

        while (compressed.length > maxSizeKB * 1024 * 1.37 && quality > 0.3) {
          quality -= 0.1;
          compressed = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressed);
      };

      img.onerror = () => reject(new Error('Failed to load image for compression'));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Uploads an image to ImgBB and returns the URL
 * @param imageData - The image file or base64 string to upload
 * @param imageName - Optional name for the image
 * @returns Promise resolving to the image URL
 */
export const uploadImageToImgBB = async (imageData: File | string, imageName = 'dnft_image'): Promise<string> => {
  try {
    if (!IMGBB_API_KEY) {
      console.error('ImgBB API key not found. Please add NEXT_PUBLIC_IMGBB_API_KEY to your .env file.');
      throw new Error('ImgBB API key not configured');
    }

    let processedImageData = imageData;
    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
      try {
        processedImageData = await compressImage(imageData);
      } catch (error) {
        console.warn('Image compression failed, using original image:', error);
      }
    }

    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);

    if (typeof processedImageData === 'string' && processedImageData.startsWith('data:image')) {
      const base64Data = processedImageData.split(',')[1];
      formData.append('image', base64Data);
    } else if (processedImageData instanceof File) {
      formData.append('image', processedImageData);
    } else {
      throw new Error('Invalid image data format');
    }

    formData.append('name', imageName);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      signal: controller.signal,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    clearTimeout(timeoutId);

    if (response.data && response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error('Image upload failed');
    }
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error);
    throw error;
  }
};

/**
 * Fallback to localStorage if ImgBB upload fails
 * @param base64Image - Base64 encoded image data
 * @returns Local storage URL or original base64 string
 */
export const storeImageLocally = (base64Image: string): string => {
  try {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const key = `dnft_image_${timestamp}_${randomStr}`;

    localStorage.setItem(key, base64Image);
    return `local://${key}`;
  } catch (error) {
    console.error('Error storing image locally:', error);
    return base64Image;
  }
};

/**
 * Retrieves an image from localStorage if it's a local URL
 * @param url - Image URL or local storage reference
 * @returns The image data or original URL
 */
export const getStoredImage = (url: string): string => {
  if (url && url.startsWith('local://')) {
    const key = url.replace('local://', '');
    const storedImage = localStorage.getItem(key);
    return storedImage || url;
  }
  return url;
};