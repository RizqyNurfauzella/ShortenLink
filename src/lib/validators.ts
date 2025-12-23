import { z } from 'zod';

export const shortenUrlSchema = z.object({
  url: z.string()
    .min(1, 'URL is required')
    .max(2048, 'URL is too long')
    .url('Invalid URL format')
    .refine((url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    }, 'Only HTTP and HTTPS URLs are allowed')
    .transform((url) => url.trim()), // Sanitize whitespace
});

export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;