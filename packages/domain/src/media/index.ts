import type { MediaAssetDto } from "@dec-walls/types";
import type { StaffSession } from "@dec-walls/auth";
import { requirePermission } from "@dec-walls/auth";

const assets: MediaAssetDto[] = [
  {
    id: "m-hero",
    url: "/placeholders/hero.jpg",
    alt: "Dec Walls hero",
    mimeType: "image/jpeg",
    width: 1600,
    height: 900,
  },
  {
    id: "m-banner",
    url: "/placeholders/banner.jpg",
    alt: "Living room banner",
    mimeType: "image/jpeg",
    width: 1400,
    height: 700,
  },
];

export async function listMedia(
  session: StaffSession | null,
): Promise<MediaAssetDto[]> {
  requirePermission(session, "media.read");
  return assets;
}

export async function registerMediaAsset(
  session: StaffSession | null,
  input: Omit<MediaAssetDto, "id">,
): Promise<MediaAssetDto> {
  requirePermission(session, "media.write");
  const asset: MediaAssetDto = { id: crypto.randomUUID(), ...input };
  assets.push(asset);
  return asset;
}
