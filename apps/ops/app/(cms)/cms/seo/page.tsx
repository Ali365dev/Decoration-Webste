import { listPagesAdmin } from "@dec-walls/domain/cms";

export default async function CmsSeoPage() {
  const pages = await listPagesAdmin();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-medium">SEO</h1>
      <ul className="space-y-3">
        {pages.map((page) => (
          <li key={page.id} className="border border-line-soft bg-paper p-4 text-sm">
            <p className="font-medium text-ink">{page.seoTitle ?? page.title}</p>
            <p className="mt-1 text-body">{page.seoDescription}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
