export const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  
  // Storage paths from Laravel Storage::url() start with /storage/
  // Route them through the API storage endpoint
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  if (cleanUrl.startsWith('/storage/')) {
    return `${apiBaseUrl}${cleanUrl}`;
  }
  
  // Non-storage paths: strip API prefix for direct access
  const baseUrl = apiBaseUrl.replace(/\/api\/v1$/, '');
  return `${baseUrl}${cleanUrl}`;
};
