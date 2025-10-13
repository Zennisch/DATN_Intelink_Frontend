// URL utilities shared across platforms

/**
 * Remove placeholder pattern `{shortCode}/` from a shortUrl if present.
 * Example: http://localhost:8080/{shortCode}/uc3Tl39rSh -> http://localhost:8080/uc3Tl39rSh
 */
export const fixShortUrlFormat = (shortUrl: string): string => {
  return shortUrl.replace(/{shortCode}\//, '');
};

/**
 * Build a publicly accessible short URL that anyone can click.
 * Preference order:
 * 1) Use provided absolute shortUrl (after fixing placeholder)
 * 2) Use EXPO_PUBLIC_FRONTEND_URL + /shortCode
 * 3) Use EXPO_PUBLIC_BACKEND_URL + /shortCode
 * 4) Fallback to relative /shortCode
 */
export const buildPublicShortUrl = (shortCode: string, shortUrl?: string): string => {
  const FRONTEND = process.env.EXPO_PUBLIC_FRONTEND_URL;
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL;

  if (shortUrl && /^https?:\/\//i.test(shortUrl)) {
    return fixShortUrlFormat(shortUrl);
  }

  if (FRONTEND) {
    return `${FRONTEND.replace(/\/$/, '')}/${shortCode}`;
  }

  if (BACKEND) {
    return `${BACKEND.replace(/\/$/, '')}/${shortCode}`;
  }

  // Last resort: relative path (works if the current origin hosts the redirect route)
  return `/${shortCode}`;
};
