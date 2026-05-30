export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

type MagicSignature = {
  mime: string;
  bytes: number[];
  offset?: number;
};

const MAGIC_SIGNATURES: MagicSignature[] = [
  { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] },
  { mime: "image/jpeg", bytes: [0xFF, 0xD8, 0xFF] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4E, 0x47] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/bmp", bytes: [0x42, 0x4D] },
];

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function validateFileSize(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File exceeds 10MB limit (${sizeMB}MB)`,
    };
  }
  if (file.size === 0) {
    return { valid: false, error: "File is empty" };
  }
  return { valid: true };
}

export async function detectMimeType(file: File): Promise<string> {
  const blob = file.slice(0, 16);
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  for (const sig of MAGIC_SIGNATURES) {
    const offset = sig.offset ?? 0;
    if (bytes.length >= offset + sig.bytes.length) {
      const match = sig.bytes.every(
        (byte, i) => bytes[offset + i] === byte,
      );
      if (match) return sig.mime;
    }
  }

  return file.type || "application/octet-stream";
}

export async function validateFileMimeType(
  file: File,
): Promise<ValidationResult> {
  const detected = await detectMimeType(file);
  if (!ALLOWED_MIME_TYPES.includes(detected)) {
    const ext = file.name.split(".").pop()?.toUpperCase() ?? "UNKNOWN";
    return {
      valid: false,
      error: `"${ext}" files are not supported. Accepted: PDF, JPEG, PNG, WEBP`,
    };
  }
  return { valid: true };
}

export async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
