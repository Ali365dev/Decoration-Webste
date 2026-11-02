import { listPagesAdmin } from "@dec-walls/domain/cms";
import { getDevStaffSession, requirePermission } from "@dec-walls/auth";

export default async function CmsPagesPage() {
  const session = getDevStaffSession();
  requirePermission(session, "cms.read");
  const pages = await listPagesAdmin();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-medium">CMS pages</h1>
      <div className="space-y-3">
        {pages.map((page) => (
          <article
            key={page.id}
            className="border border-line-soft bg-paper px-4 py-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-medium text-ink">{page.title}</h2>
                <p className="text-sm text-body">/{page.slug}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-body">
                {page.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-body">
              {page.blocks.length} blocks · SEO: {page.seoTitle ?? "—"}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
