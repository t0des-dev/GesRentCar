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

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 0.85;

export async function compressImage(file: File, maxWidth = MAX_WIDTH, quality = JPEG_QUALITY): Promise<File> {
  if (file.size < 500 * 1024) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = Math.round((h / w) * maxWidth);
        w = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const out = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(out.size < file.size ? out : file);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}
