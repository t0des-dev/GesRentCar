export const getImageUrl = (url?: string) => {
  if (!url) return undefined;

  // Already an absolute external URL — return as-is
  if (url.startsWith('http')) return url;

  // Ensure leading slash
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  // Storage paths: serve via nginx /storage location (direct filesystem, no PHP)
  // Works for both relative (/storage/...) and absolute (https://domain/storage/...)
  const storageMatch = cleanUrl.match(/^\/storage\/(.+)$/);
  if (storageMatch) {
    return `/storage/${storageMatch[1]}`;
  }

  // Absolute URLs containing /storage/ — strip domain, use nginx path
  const absStorageMatch = url.match(/https?:\/\/[^/]+(\/storage\/.+)$/);
  if (absStorageMatch) {
    return absStorageMatch[1];
  }

  // Non-storage paths — return as-is (public assets, external URLs, etc.)
  return cleanUrl;
};
