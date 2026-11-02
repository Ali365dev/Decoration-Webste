import { getMainNavigation } from "@dec-walls/domain/cms";

export default async function CmsNavigationPage() {
  const nav = await getMainNavigation();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-medium">Navigation</h1>
      <ul className="space-y-4">
        {nav.map((item) => (
          <li key={item.id} className="border border-line-soft bg-paper p-4">
            <p className="font-medium">
              {item.label}{" "}
              <span className="text-sm font-normal text-body">{item.href}</span>
            </p>
            {item.children.length > 0 ? (
              <ul className="mt-3 space-y-2 pl-4 text-sm text-body">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <span className="font-medium text-ink">{child.label}</span>
                    {" — "}
                    {child.href}
                    {child.children.length > 0 ? (
                      <ul className="mt-1 space-y-1 pl-4">
                        {child.children.map((grand) => (
                          <li key={grand.id}>
                            {grand.label} — {grand.href}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
