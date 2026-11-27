import { NextRequest, NextResponse } from "next/server";
import { guardAdmin } from "../../_guard";
import { isUploadFolder, signUploadParams } from "../_sign";

// Signs a direct browser upload to Cloudinary. The secret never leaves the server.
export async function POST(req: NextRequest) {
  const denied = guardAdmin(req);
  if (denied) return denied;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const folder = body?.folder;
  if (!isUploadFolder(folder)) {
    return NextResponse.json({ error: "Unknown upload folder" }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signUploadParams({ folder, timestamp }, apiSecret);
  return NextResponse.json({ data: { cloudName, apiKey, timestamp, signature, folder } });
}
