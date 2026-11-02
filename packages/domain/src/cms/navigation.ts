import type { NavItemDto } from "@dec-walls/types";

function item(
  id: string,
  label: string,
  children: NavItemDto[] = [],
): NavItemDto {
  return {
    id,
    label,
    href: `/collections/${id}`,
    children,
  };
}

function group(
  id: string,
  label: string,
  children: Array<[id: string, label: string]>,
): NavItemDto {
  return item(
    id,
    label,
    children.map(([childId, childLabel]) => item(childId, childLabel)),
  );
}

export const mainNav: NavItemDto[] = [
  item("new-in", "NEW IN", [
    group("new-in-bedding", "BEDDING", [
      ["new-in-bedding-cotton-classics", "COTTON CLASSICS"],
      ["new-in-bedding-festive", "FESTIVE"],
      ["new-in-bedding-printed", "PRINTED"],
    ]),
    group("new-in-bath", "BATH", [["new-in-bath-towel-set", "TOWEL SET"]]),
    group("new-in-dining", "DINING", [
      ["new-in-dining-table-linen", "TABLE LINEN"],
    ]),
    group("new-in-living", "LIVING", [
      ["new-in-living-cushions", "CUSHIONS"],
      ["new-in-living-prayer-mat", "PRAYER MAT"],
      ["new-in-living-quran-cover", "QURAN COVER"],
    ]),
    group("new-in-coverlets", "COVERLETS", [
      ["new-in-coverlets-khaise", "KHAISE"],
    ]),
    group("new-in-accessories", "ACCESSORIES", [
      ["new-in-accessories-pouch", "POUCH"],
      ["new-in-accessories-pouf", "POUF"],
      ["new-in-accessories-bed-throw", "BED THROW"],
    ]),
  ]),
  item("bedding", "BEDDING", [
    group("bedding-festive", "FESTIVE", [
      ["bedding-festive-bed-spread-set", "BED SPREAD SET"],
      ["bedding-festive-silk-bed-sheet-set", "SILK BED SHEET SET"],
      ["bedding-festive-quilt-cover-set", "QUILT COVER SET"],
    ]),
    group("bedding-cotton-classics", "COTTON CLASSICS", [
      ["bedding-cotton-classics-quilts-sheet-sets", "QUILTS & SHEET SETS"],
      ["bedding-cotton-classics-bed-in-a-bag", "BED IN A BAG"],
    ]),
    group("bedding-printed", "PRINTED", [
      ["bedding-printed-quilts-sheet-sets", "QUILTS & SHEET SETS"],
      ["bedding-printed-comforter-set", "COMFORTER SET"],
    ]),
  ]),
  item("bath", "BATH", [item("bath-towel-sets", "TOWEL SETS")]),
  item("dining", "DINING", [
    item("dining-table-linen", "TABLE LINEN"),
    item("tea-cozy-set", "TEA COZY SET"),
  ]),
  item("living", "LIVING", [
    item("living-cushions", "CUSHIONS"),
    item("living-prayer-mat", "PRAYER MAT"),
    item("living-quran-cover", "QURAN COVER"),
    item("living-quran-box", "QURAN BOX"),
    item("living-tasbeeh-box", "TASBEEH BOX"),
    item("living-tasbeeh", "TASBEEH"),
  ]),
  item("coverlets", "COVERLETS", [item("coverlets-khaise", "KHAISE")]),
  item("accessories", "ACCESSORIES", [
    item("accessories-ring-tray-set", "RING TRAY SET"),
    item("accessories-pouch", "POUCH"),
    item("pouf", "POUF"),
    item("bed-throw", "BED THROW"),
    item("room-diffuser", "ROOM DIFFUSER"),
  ]),
  item("fillings", "FILLINGS", [
    item("fillings-pillow-filling", "PILLOW FILLING"),
    item("fillings-quilt-filling", "QUILT FILLING"),
  ]),
  item("furniture", "FURNITURE", [
    item("furniture-ottoman", "WOODEN STOOL/OTTOMAN"),
    item("furniture-wooden-round-table", "WOODEN ROUND TABLE"),
    item("furniture-wooden-chair", "WOODEN CHAIR"),
    item("furniture-wooden-dining-set", "WOODEN DINING SET"),
    item("wooden-sethi-sofa", "WOODEN SETHI SOFA"),
  ]),
  item("sale", "SALE"),
  item("lookbook", "LOOKBOOK"),
];
