import { API_BASE_URL } from './config';

/**
 * Get the full URL for a user image
 * Handles both relative paths from the backend and absolute URLs
 */
export function getUserImageUrl(imagePath?: string | null): string {
  console.log('🖼️ getUserImageUrl called with:', imagePath);
  console.log('🖼️ API_BASE_URL:', API_BASE_URL);
  
  // If no image path, return placeholder
  if (!imagePath) {
    console.log('🖼️ No image path, returning placeholder');
    return '/placeholder-avatar.svg';
  }

  // If it's already an absolute URL (starts with http), return as is
  if (imagePath.startsWith('http')) {
    console.log('🖼️ Already absolute URL, returning as is:', imagePath);
    return imagePath;
  }

  // If it's a relative path starting with /, prepend the backend URL
  if (imagePath.startsWith('/')) {
    const fullUrl = `${API_BASE_URL}${imagePath}`;
    console.log('🖼️ Relative path, full URL:', fullUrl);
    return fullUrl;
  }

  // If it's just a filename, assume it's in the storage path
  const fullUrl = `${API_BASE_URL}/storage/profile_images/${imagePath}`;
  console.log('🖼️ Filename only, full URL:', fullUrl);
  return fullUrl;
}

/**
 * Get the full URL for any storage asset
 */
export function getStorageUrl(path?: string | null): string {
  if (!path) {
    return '';
  }

  if (path.startsWith('http')) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`;
  }

  return `${API_BASE_URL}/storage/${path}`;
}

/**
 * Get the full URL for a service image
 * Handles service images stored in the services directory
 */
export function getServiceImageUrl(imagePath?: string | null): string {
  console.log('🖼️ getServiceImageUrl called with:', imagePath);
  console.log('🖼️ API_BASE_URL:', API_BASE_URL);
  
  // If no image path, return a service placeholder or empty string
  if (!imagePath) {
    console.log('🖼️ No service image path, returning empty string');
    return ''; // Let Avatar fallback handle this
  }

  // If it's already an absolute URL (starts with http), return as is
  if (imagePath.startsWith('http')) {
    console.log('🖼️ Already absolute URL, returning as is:', imagePath);
    return imagePath;
  }

  // If it's a relative path starting with /, prepend the backend URL
  if (imagePath.startsWith('/')) {
    const fullUrl = `${API_BASE_URL}${imagePath}`;
    console.log('🖼️ Relative path, full URL:', fullUrl);
    return fullUrl;
  }

  // Check if the path already includes "storage/" to avoid double storage prefix
  let fullUrl;
  if (imagePath.startsWith('storage/')) {
    // Path already includes storage/, just prepend base URL
    fullUrl = `${API_BASE_URL}/${imagePath}`;
    console.log('🖼️ Path already includes storage/, full URL:', fullUrl);
  } else {
    // Path doesn't include storage/, add the storage prefix
    fullUrl = `${API_BASE_URL}/storage/${imagePath}`;
    console.log('🖼️ Adding storage prefix, full URL:', fullUrl);
  }
  
  return fullUrl;
}
