export const getImageUrl = (url?: string) => {
  if (!url) return undefined;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // Already an API storage URL — return as-is
  if (url.startsWith(apiBaseUrl + '/storage/')) return url;

  // Absolute URL containing /storage/ — rewrite to go through API
  // (e.g. https://vectoria.carbonick.com/storage/branding/x.webp → /api/v1/storage/branding/x.webp)
  const storageMatch = url.match(/\/storage\/(.+)$/);
  if (storageMatch) {
    return `${apiBaseUrl}/storage/${storageMatch[1]}`;
  }

  // Relative path starting with /storage/
  if (url.startsWith('/storage/')) {
    return `${apiBaseUrl}${url}`;
  }

  // Other absolute URLs (http/https) — return as-is
  if (url.startsWith('http')) return url;

  // Non-storage relative paths (e.g. /placeholder-car.jpg)
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const baseUrl = apiBaseUrl.replace(/\/api\/v1$/, '');
  return `${baseUrl}${cleanUrl}`;
};
