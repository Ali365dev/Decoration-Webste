import { listProducts } from "@dec-walls/domain/catalog";
import { getFooterLinks } from "@dec-walls/domain/cms";
import { StoreFooter } from "@/components/layout/store-footer";
import { CartClient } from "./cart-client";

export default async function CartPage() {
  const [{ items: products }, footer] = await Promise.all([
    listProducts({ page: 1, pageSize: 4 }),
    getFooterLinks(),
  ]);

  return (
    <>
      <CartClient recommendations={products} />
      <StoreFooter links={footer} />
    </>
  );
}
