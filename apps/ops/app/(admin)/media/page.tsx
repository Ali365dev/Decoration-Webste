import { getDevStaffSession } from "@dec-walls/auth";
import { listMedia } from "@dec-walls/domain/media";

export default async function MediaAdminPage() {
  const session = getDevStaffSession();
  const media = await listMedia(session);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-medium">Media</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((asset) => (
          <li key={asset.id} className="border border-line-soft bg-paper p-4 text-sm">
            <p className="font-medium text-ink">{asset.alt ?? asset.id}</p>
            <p className="mt-2 break-all text-body">{asset.url}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
