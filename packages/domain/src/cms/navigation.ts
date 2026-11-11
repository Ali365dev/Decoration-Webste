import type { NavItemDto } from "@dec-walls/types";

function item(
  id: string,
  label: string,
  children: NavItemDto[] = [],
  href = `/collections/${id}`,
): NavItemDto {
  return { id, label, href, children };
}

function section(
  id: string,
  label: string,
  links: Array<[id: string, label: string]>,
): NavItemDto {
  return item(id, label, links.map(([linkId, linkLabel]) => item(linkId, linkLabel)));
}

export const mainNav: NavItemDto[] = [
  item("new-in", "NEW IN", [
    item("new-in-shop", "SHOP NEW IN", [
      item("new-in-bedding", "BEDDING", [], "/collections/bedding"),
      item("new-in-home-decor", "HOME DECOR", [], "/collections/home-decor"),
      item("new-in-baby", "BABY & NURSERY", [], "/collections/baby-and-nursery"),
      item("new-in-wall-art", "CANVAS & WALL ART", [], "/collections/canvas-and-wall-art"),
      item("new-in-curtains", "CURTAINS & BLINDS", [], "/collections/curtains-and-blinds"),
    ], "/collections/new-in"),
  ], "/collections/new-in"),
  item("home", "HOME", [], "/"),
  item("home-decor", "HOME DECOR", [
    section("home-decor-luxury", "LUXURY HOME DECOR", [
      ["decorative-showpieces", "Decorative Showpieces"],
      ["table-decor", "Table Decor"],
      ["planters", "Planters"],
      ["cushion-covers", "Cushion Covers"],
      ["accessories", "Accessories"],
      ["led-lamps", "LED Lamps"],
      ["shelves", "Shelves & Storage"],
      ["decorative-frames", "Decorative Frames"],
    ]),
    section("home-decor-curtains", "CURTAINS AND BLINDS", [
      ["luxury-velvet-curtains", "Luxury Velvet Curtains"],
      ["jacquard-curtains", "Jacquard Curtains"],
      ["premium-curtains", "Premium Curtains"],
      ["gradient-double-shaded-curtains", "Gradient Double Shaded"],
      ["laser-cutwork-curtains", "Laser Cutwork"],
      ["curtain-accessories", "Accessories & Railings"],
    ]),
    section("home-decor-furniture", "FURNITURE", [
      ["tables-consoles", "Tables & Consoles"],
      ["ottoman-stools", "Ottoman Stools"],
      ["serving-trolleys", "Serving Trolleys"],
    ]),
    section("home-decor-blinds", "PREMIUM BLINDS", [
      ["premium-blinds", "Premium Blinds"],
      ["roller-blinds", "Roller Blinds"],
      ["roman-blinds", "Roman Blinds"],
      ["zebra-blinds", "Zebra Blinds"],
    ]),
  ]),
  item("baby-and-nursery", "BABY & NURSERY", [
    section("baby-sleep-comfort", "SLEEP & COMFORT", [
      ["baby-bassinets", "Baby Bassinets"],
      ["carry-nests", "Carry Nests"],
      ["baby-cot-sets", "Baby Cot Sets"],
      ["snuggle-beds", "Snuggle Beds"],
      ["baby-comforter-sets", "Baby Comforter Sets"],
    ]),
    section("baby-nursery-essentials", "NURSERY ESSENTIALS", [
      ["kids-nursery-sets", "Kids Nursery Sets"],
      ["baby-support-seats", "Baby Support Seats"],
      ["storage-baskets", "Storage Baskets"],
      ["cot-accessories", "Cot Accessories"],
      ["nursery-bedding", "Nursery Bedding"],
      ["kids-learning-tools", "Kids Learning Tools"],
    ]),
    section("baby-shop-services", "SHOP & SERVICES", [
      ["new-arrivals", "New Arrivals"],
      ["best-sellers", "Best Sellers"],
      ["custom-made-sets", "Custom-Made Sets"],
      ["wholesale-enquiries", "Wholesale Enquiries"],
    ]),
  ]),
  item("bedding", "BEDDING", [
    section("bedding-bed-linen", "BED LINEN", [
      ["bedsheets", "Bedsheets"],
      ["velvet-bedsheets", "Velvet Bedsheets"],
      ["designer-bedsheets", "Designer Bedsheets"],
      ["pillow-covers", "Pillow Covers"],
      ["bed-runners", "Bed Runners"],
      ["bedspreads", "Bedspreads"],
    ]),
    section("bedding-essentials", "BEDDING ESSENTIALS", [
      ["mattress-protectors", "Mattress Protectors"],
      ["mattress-toppers", "Mattress Toppers"],
      ["bedding-cushion-fillings", "Bedding & Cushion Fillings"],
      ["blankets-throws", "Blankets & Throws"],
    ]),
    section("bedding-comfort-luxury", "COMFORT & LUXURY", [
      ["luxury-bridal-bedding", "Luxury Bridal Bedding"],
      ["comforter-sets", "Comforter Sets"],
      ["duvet-sets", "Duvet Sets"],
      ["quilts", "Quilts"],
      ["custom-made-bedding", "Custom-Made Bedding"],
    ]),
    section("bedding-kitchen-linen", "KITCHEN LINEN", [
      ["table-runners", "Table Runners"],
      ["table-mats", "Table Mats"],
      ["table-covers", "Table Covers"],
      ["cloth-napkins", "Cloth Napkins"],
      ["kitchen-aprons", "Kitchen Aprons"],
    ]),
    section("bedding-islamic-essentials", "ISLAMIC ESSENTIALS", [
      ["prayer-mats", "Prayer Mats"],
      ["personalized-prayer-mats", "Personalized Prayer Mats"],
      ["couple-prayer-mat-sets", "Couple Prayer Mat Sets"],
      ["quran-covers", "Quran Covers"],
      ["personalized-quran-covers", "Personalized Quran Covers"],
      ["kids-prayer-mats", "Kids Prayer Mats"],
      ["bridal-islamic-gift-sets", "Bridal Islamic Gift Sets"],
      ["islamic-gift-sets", "Islamic Gift Sets"],
    ]),
    section("bedding-bath-linen", "BATH LINEN", [
      ["bath-towels", "Bath Towels"],
      ["bathrobes", "Bathrobes"],
      ["bath-mats", "Bath Mats"],
      ["laundry-bags", "Laundry Bags"],
    ]),
  ]),
  item("canvas-and-wall-art", "CANVAS & WALL ART", [
    section("wooden-wall-art", "WOODEN WALL ART", [
      ["islamic-wall-art", "Islamic Wall Art"],
      ["modern-wall-art", "Modern Wall Art"],
      ["wall-clocks", "Wall Clocks"],
      ["business-signs-logos", "Business Signs & Logos"],
      ["kids-decorative-wall-art", "Kids & Decorative Wall Art"],
      ["tea-coaster", "Tea Coaster"],
      ["quotes-wall-art", "Quotes Wall Art"],
      ["couple-wall-art", "Couple Wall Art"],
    ]),
    section("acrylic-wall-art", "ACRYLIC WALL ART", [
      ["premium-islamic-decor", "Premium Islamic Decor"],
      ["acrylic-wall-art-decor", "Acrylic Wall Art Decor"],
      ["acrylic-wall-clocks", "Acrylic Wall Clocks"],
      ["mirror-wall-art", "Mirror Wall Art"],
      ["modern-house-name-plates", "Modern House Name Plates"],
    ]),
    section("wall-art-custom", "CUSTOM & PERSONALIZED", [
      ["personalized-name-plates", "Personalized Name Plates"],
      ["kids-name-signs", "Kids Name Signs"],
      ["custom-business-signs", "Business Signs & Logos"],
      ["custom-wall-art", "Custom Wall Art"],
      ["custom-design-orders", "Custom Design Orders"],
    ]),
    section("canvas-wall-art", "CANVAS WALL ART", [
      ["islamic-canvas-art", "Islamic Canvas Art"],
      ["abstract-canvas-art", "Abstract Canvas Art"],
      ["signature-canvas-art", "Signature Canvas Art"],
      ["nature-landscape-art", "Nature & Landscape Art"],
      ["floral-canvas-art", "Floral Canvas Art"],
      ["modern-canvas-art", "Modern Canvas Art"],
      ["motivational-quote-art", "Motivational Quote Art"],
      ["kids-canvas-art", "Kids Canvas Art"],
      ["legends-personalities-art", "Legends & Personalities Art"],
      ["laser-cutwork-frame", "Laser Cutwork Frame"],
    ]),
    section("canvas-custom", "CUSTOM & PERSONALIZED", [
      ["custom-photo-canvas", "Custom Photo Canvas"],
      ["hand-painted-canvas-art", "Hand-Painted Canvas Art"],
    ]),
  ]),
  item("curtains-and-blinds", "CURTAINS & BLINDS", [
    section("curtains-by-fabric", "CURTAINS BY FABRIC", [
      ["velvet-curtains", "Velvet Curtains"],
      ["jacquard-curtains", "Jacquard Curtains"],
      ["sheer-net-curtains", "Sheer / Net Curtains"],
      ["silk-curtains", "Silk Curtains"],
      ["jute-curtains", "Jute Curtains"],
    ]),
    section("curtains-by-design", "CURTAINS BY DESIGN", [
      ["digitally-printed-curtains", "Digitally Printed Curtains"],
      ["gradient-double-shade-curtains", "Gradient & Double-Shade Curtains"],
      ["laser-cut-velvet-curtains", "Laser-Cut Velvet Curtains"],
      ["kids-printed-curtains", "Kids Printed Curtains"],
      ["premium-curtains", "Premium Curtains"],
    ]),
    section("curtain-accessories", "CURTAIN ACCESSORIES", [
      ["curtain-rods-pipes", "Curtain Rods & Pipes"],
      ["ceiling-tracks-railing", "Ceiling Tracks & Railings"],
      ["end-caps-finials", "End Caps & Finials"],
      ["tassels-trimmings", "Tassels & Trimmings"],
      ["tie-belts-holdbacks", "Tie Belts & Holdbacks"],
    ]),
    section("blinds-track-systems", "BLINDS & TRACK SYSTEMS", [
      ["premium-blinds", "Premium Blinds"],
      ["roller-blinds", "Roller Blinds"],
      ["roman-blinds", "Roman Blinds"],
      ["zebra-blinds", "Zebra Blinds"],
    ]),
    section("curtains-special-collections", "SPECIAL COLLECTIONS", [
      ["custom-made-curtains", "Custom-Made Curtains"],
      ["kids-curtains", "Kids’ Curtains"],
      ["luxury-curtain-collection", "Luxury Curtain Collection"],
      ["curtain-installation-service", "Curtain Installation Service"],
    ]),
    section("curtains-shop-services", "SHOP & SERVICES", [
      ["curtain-new-arrivals", "New Arrivals"],
      ["curtain-best-sellers", "Best Sellers"],
      ["custom-curtain-orders", "Custom Curtain Orders"],
      ["wholesale-enquiries", "Wholesale Enquiries"],
    ]),
  ]),
  item("sale", "SALE", [], "/collections/sale"),
];
