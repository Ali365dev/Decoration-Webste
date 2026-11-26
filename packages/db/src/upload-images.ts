/**
 * Phase 1 of image migration: upload all store images to Cloudinary.
 *
 * Run from repo root:
 *   DATABASE_URL=... CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=... \
 *   npx tsx packages/db/src/upload-images.ts
 *
 * Or set vars in apps/storefront/.env.local and run:
 *   npm run upload-images --workspace=packages/db
 *
 * What it does:
 *   1. Uploads every image in apps/storefront/public/ to Cloudinary under dec-walls/
 *   2. Fetches every external URL (pyariwalls.pk, bareezehome.com.pk) into Cloudinary
 *   3. Writes packages/db/src/cloudinary-url-map.json  (old path → Cloudinary URL)
 *
 * Safe to run twice — Cloudinary skips already-uploaded assets (use_filename + overwrite: false).
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── env ─────────────────────────────────────────────────────────────────────
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error("Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET");
  process.exit(1);
}

cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET, secure: true });

// ── paths ────────────────────────────────────────────────────────────────────
const REPO_ROOT = path.resolve(__dirname, "../../../");
const PUBLIC_DIR = path.join(REPO_ROOT, "apps/storefront/public");
const URL_MAP_PATH = path.join(__dirname, "cloudinary-url-map.json");

// ── external image URLs used in the seed data ────────────────────────────────
const EXTERNAL_URLS: string[] = [
  // bareezehome.com.pk — BED IN A BAG product
  "https://bareezehome.com.pk/cdn/shop/files/CAPP-169-QF-RP.jpg?v=1793964554&width=1206",
  "https://bareezehome.com.pk/cdn/shop/files/CAPP-169-QF-RPcloseup1.jpg?v=1793964554&width=1206",
  "https://bareezehome.com.pk/cdn/shop/files/CAPP-169-QF-RPcloseup2.jpg?v=1793964554&width=1206",
  "https://bareezehome.com.pk/cdn/shop/files/CAPP-169-QF-RPcloseup3.jpg?v=1793964555&width=1206",
  // pyariwalls.pk — wall art products
  "https://pyariwalls.pk/cdn/shop/files/99_Names_of_Allah_wall_art.jpg?v=1741673892&width=533",
  "https://pyariwalls.pk/cdn/shop/files/buy1get2-2.jpg?v=1685129653&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsAppImage2023-05-01at3.22.53PM_2.jpg?v=1682936758&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsAppImage2023-05-22at3.41.32PM.jpg?v=1684752398&width=533",
  "https://pyariwalls.pk/cdn/shop/products/IMG_0591.jpg?v=1672063140&width=533",
  "https://pyariwalls.pk/cdn/shop/files/Islamic_wall_sceneries_set.png?v=1788335623&width=533",
  "https://pyariwalls.pk/cdn/shop/products/AcrylicLOH.jpg?v=1672063506&width=533",
  "https://pyariwalls.pk/cdn/shop/products/TasbeehEFatima.png?v=1649328702&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsAppImage2024-02-26at12.14.41.jpg?v=1741244624&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsAppImage2024-02-01at20.10.24.jpg?v=1706801303&width=533",
  "https://pyariwalls.pk/cdn/shop/files/Home_Decor.jpg?v=1732651211&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsAppImage2024-02-11at00.02.46_1.jpg?v=1707592076&width=533",
  "https://pyariwalls.pk/cdn/shop/files/ChatGPT_Image_Jan_19_2026_02_47_17_PM_1.png?v=1768816122&width=533",
  "https://pyariwalls.pk/cdn/shop/products/IMG_0994.jpg?v=1675690486&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsAppImage2023-06-06at4.22.47PM_1_1724ea20-70c5-4e8b-ad14-16b1bce42042.jpg?v=1689065111&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsAppImage2023-10-06at5.09.54PM.jpg?v=1696594887&width=533",
  "https://pyariwalls.pk/cdn/shop/products/Asset31.png?v=1648059791&width=533",
  "https://pyariwalls.pk/cdn/shop/products/Asset34.png?v=1648059848&width=533",
  "https://pyariwalls.pk/cdn/shop/files/IMG_6692.jpg?v=1708420755&width=533",
  "https://pyariwalls.pk/cdn/shop/products/NadEali_960x-2_960x_afd07597-2c70-4975-8f2c-83ae5b2d5c29.webp?v=1669193548&width=533",
  "https://pyariwalls.pk/cdn/shop/products/Asset30.png?v=1648059810&width=533",
  "https://pyariwalls.pk/cdn/shop/products/Asset26.png?v=1648059747&width=533",
  "https://pyariwalls.pk/cdn/shop/products/WhatsAppImage2022-02-17at12.47.42AM.jpg?v=1645044769&width=533",
  "https://pyariwalls.pk/cdn/shop/products/Asset33.png?v=1648059830&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsAppImage2023-07-22at5.58.36PM.jpg?v=1690031074&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsAppImage2023-08-05at4.39.38PM.jpg?v=1691246323&width=533",
  "https://pyariwalls.pk/cdn/shop/products/ScreenShot2022-10-28at4.36.46PM.png?v=1674143252&width=533",
  "https://pyariwalls.pk/cdn/shop/products/WhatsApp-Image-2020-08-30-at-8.53.07-PM-1-2_50b8a524-2bb5-45d6-9e3e-363edab9730e.jpg?v=1755758748&width=533",
  "https://pyariwalls.pk/cdn/shop/products/WhatsApp-Image-2020-10-11-at-6.08.38-PM_d387628c-59fb-4593-9f88-3201b7205328.jpg?v=1613750313&width=533",
  "https://pyariwalls.pk/cdn/shop/products/mainimage23D-DIY-Wall-Mirror-Stickers-Reflective-Surface-Oval-Square-Acrylic-Stickers-Home-Bathroom-Decals-Living-Room_1000x_5e3efe47-38b7-4861-909b-b3511f4c6293.jpg?v=1675849394&width=533",
  "https://pyariwalls.pk/cdn/shop/products/zzmirror2.jpg?v=1670326705&width=533",
  "https://pyariwalls.pk/cdn/shop/products/IMG_0371.jpg?v=1670590356&width=533",
  "https://pyariwalls.pk/cdn/shop/products/166236023329ef1870a4d66aa850f4b03a5ad5570c_thumbnail_900x_4a8a4adf-da3d-4a45-bd9a-c4f1dd69f099.webp?v=1672743849&width=533",
  "https://pyariwalls.pk/cdn/shop/products/WhatsAppImage2022-04-10at6.22.07PM.jpg?v=1649615778&width=533",
  "https://pyariwalls.pk/cdn/shop/products/premiumromangolden.jpg?v=1679316602&width=533",
  "https://pyariwalls.pk/cdn/shop/products/6ec23a351808ec93db4c46b23a934e60.jpg?v=1679479248&width=533",
  "https://pyariwalls.pk/cdn/shop/files/FullSizeRender2.jpg?v=1682513103&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsAppImage2024-02-28at19.50.45_2.jpg?v=1709131950&width=533",
  "https://pyariwalls.pk/cdn/shop/products/WhatsApp-Image-2020-08-17-at-12.48.08-PM-5.jpg?v=1663987680&width=533",
  "https://pyariwalls.pk/cdn/shop/products/WhatsApp-Image-2020-11-03-at-3.29.42-PM_a88134d9-3bf8-499b-9e7d-e3f6508ba110.jpg?v=1613750392&width=533",
  "https://pyariwalls.pk/cdn/shop/products/WhatsApp-Image-2020-08-17-at-12.48.08-PM-9-copy_71107990-9143-46fe-a08e-2685423e19cb.jpg?v=1613991283&width=533",
  "https://pyariwalls.pk/cdn/shop/products/WhatsApp-Image-2020-08-17-at-12.48.08-PM-12-1_3b4e8024-0c43-46c0-b03a-b3e47ed4bd57.jpg?v=1613991384&width=533",
  "https://pyariwalls.pk/cdn/shop/products/WhatsApp-Image-2020-11-03-at-11.42.35-PM_020b63ea-559e-473a-8303-c1bc57fe5235.jpg?v=1613750422&width=533",
  "https://pyariwalls.pk/cdn/shop/products/1660535743f0b2c7702631e0c1847e64bc40f8633f.webp?v=1672743428&width=533",
  "https://pyariwalls.pk/cdn/shop/files/grazingdeer.webp?v=1738931552&width=533",
  "https://pyariwalls.pk/cdn/shop/products/Asset65.png?v=1645474583&width=533",
  "https://pyariwalls.pk/cdn/shop/products/WhatsApp-Image-2020-11-03-at-5.21.19-PM.jpg?v=1673357422&width=533",
  "https://pyariwalls.pk/cdn/shop/products/Asset66.png?v=1645474539&width=533",
  "https://pyariwalls.pk/cdn/shop/products/IMG_71392.jpg?v=1660123475&width=533",
  "https://pyariwalls.pk/cdn/shop/files/WhatsApp_Image_2025-08-21_at_15.04.42_50x50.jpg?v=1755774517&width=533",
  "https://pyariwalls.pk/cdn/shop/products/Asset64.png?v=1645474548&width=533",
];

// ── helpers ──────────────────────────────────────────────────────────────────

function localPublicId(filePath: string): string {
  // e.g. /Users/.../public/bareeze/image-5.jpg → dec-walls/bareeze/image-5
  const rel = path.relative(PUBLIC_DIR, filePath);
  const withoutExt = rel.replace(/\.[^.]+$/, "");
  return `dec-walls/${withoutExt.replace(/\\/g, "/")}`;
}

function externalPublicId(url: string): string {
  // e.g. https://pyariwalls.pk/cdn/shop/products/Asset65.png → dec-walls/external/pyariwalls/Asset65
  const parsed = new URL(url);
  const filename = path.basename(parsed.pathname).replace(/\?.*$/, "").replace(/\.[^.]+$/, "");
  const host = parsed.hostname.replace(/\.[^.]+$/, "").replace(/\./g, "-");
  return `dec-walls/external/${host}/${filename}`;
}

function cloudinaryUrl(publicId: string, ext = "jpg"): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}.${ext}`;
}

function getAllImageFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllImageFiles(full));
    else if (/\.(jpe?g|png|webp|gif|svg)$/i.test(entry.name)) results.push(full);
  }
  return results;
}

async function uploadLocal(filePath: string, urlMap: Record<string, string>) {
  const publicId = localPublicId(filePath);
  const localPath = `/${path.relative(PUBLIC_DIR, filePath).replace(/\\/g, "/")}`;

  if (urlMap[localPath]) return; // already mapped

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
    });
    urlMap[localPath] = result.secure_url;
    process.stdout.write(".");
  } catch (err: unknown) {
    // already exists → build the URL manually
    if (err instanceof Error && err.message.includes("already exists")) {
      const ext = path.extname(filePath).slice(1) || "jpg";
      urlMap[localPath] = cloudinaryUrl(publicId, ext);
      process.stdout.write("s");
    } else {
      console.error(`\n  ✗ ${localPath}:`, err instanceof Error ? err.message : err);
    }
  }
}

async function uploadExternal(url: string, urlMap: Record<string, string>) {
  if (urlMap[url]) return;

  const publicId = externalPublicId(url);
  const parsed = new URL(url);
  const ext = path.extname(parsed.pathname).replace(".", "") || "jpg";

  try {
    const result = await cloudinary.uploader.upload(url, {
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
    });
    urlMap[url] = result.secure_url;
    process.stdout.write(".");
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("already exists")) {
      urlMap[url] = cloudinaryUrl(publicId, ext);
      process.stdout.write("s");
    } else {
      console.error(`\n  ✗ ${url}:`, err instanceof Error ? err.message : err);
    }
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const urlMap: Record<string, string> = fs.existsSync(URL_MAP_PATH)
    ? JSON.parse(fs.readFileSync(URL_MAP_PATH, "utf-8"))
    : {};

  // 1. Local images
  const localFiles = getAllImageFiles(PUBLIC_DIR);
  console.log(`\nUploading ${localFiles.length} local images…`);
  for (const file of localFiles) {
    await uploadLocal(file, urlMap);
  }

  // 2. External URLs
  console.log(`\n\nUploading ${EXTERNAL_URLS.length} external URLs…`);
  for (const url of EXTERNAL_URLS) {
    await uploadExternal(url, urlMap);
  }

  // 3. Save map
  fs.writeFileSync(URL_MAP_PATH, JSON.stringify(urlMap, null, 2));
  console.log(`\n\n✅ Done. URL map saved to packages/db/src/cloudinary-url-map.json`);
  console.log(`   ${Object.keys(urlMap).length} entries total`);
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
