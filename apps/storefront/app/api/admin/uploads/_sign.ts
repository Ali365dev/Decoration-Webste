import { createHash } from "node:crypto";

export const UPLOAD_FOLDERS = ["dec-walls/products", "dec-walls/categories", "dec-walls/storefront"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

/** Cloudinary signature: sorted `key=value` pairs joined by `&`, secret appended, SHA-1 hex. */
export function signUploadParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

export function isUploadFolder(value: unknown): value is UploadFolder {
  return typeof value === "string" && (UPLOAD_FOLDERS as readonly string[]).includes(value);
}
