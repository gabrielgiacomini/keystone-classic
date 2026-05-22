/**
 * Shared value type for file-adapter fields (localfile, file).
 * The server stores a subset of these fields depending on the adapter.
 */
export type FileValue = {
  filename?: string;
  originalname?: string;
  size?: number;
  filetype?: string;
  url?: string;
} | null;
