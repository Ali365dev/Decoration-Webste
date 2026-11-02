import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

export default function CategoriesAdminPage() {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-medium">Categories</h1>
      <p className="text-body">Manage catalog taxonomy (Bedding, Bath, Dining, Living, …).</p>
    </div>
  );
}
