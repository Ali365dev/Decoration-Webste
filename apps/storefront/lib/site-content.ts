/**
 * Static content for the standalone footer pages (about, policies, FAQs,
 * stores, blog). Kept in one place so copy stays consistent and the page
 * components stay about layout, not prose.
 */

export const COMPANY = {
  name: "Dec Walls",
  city: "Lahore, Pakistan",
  email: "info@decwalls.com",
  phone: "+92 300 0606662",
  phoneHref: "+923000606662",
  hours: "Mon–Sat, 10am–7pm PKT",
  foundedYear: 2019,
};

export type PolicySection = { heading: string; body: string[] };

export type PolicyPage = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  updated: string;
  image: string;
  sections: PolicySection[];
};

export const ABOUT = {
  eyebrow: "Our story",
  title: "Textiles made to live with, not just look at",
  image: "/home/banner-a2.jpg",
  lead:
    "Dec Walls began in a small Lahore workshop with a simple idea: a home feels finished when its fabrics feel right underfoot and against the skin. We make bedding, bath, dining and living textiles that earn their place through daily use.",
  paragraphs: [
    "Every collection starts with the cloth. We weave with long-staple cotton and linen, wash it so it softens the way a favourite sheet does, and finish it in small batches we can actually inspect. Nothing leaves the workshop that we would not put on our own beds.",
    "We work directly with the mills and the hands that cut, stitch and press, which keeps the chain short and the quality honest. It also means we can keep prices fair without thinning the thread count or cutting the corners you would only notice months later.",
  ],
  values: [
    {
      title: "Woven, then washed",
      body: "Long-staple cotton and linen, garment-washed so pieces feel broken-in from the first night.",
    },
    {
      title: "Made in small batches",
      body: "Short runs we can inspect by hand, so a flaw is caught before it reaches you.",
    },
    {
      title: "Priced to be used",
      body: "A short supply chain keeps everyday textiles affordable without thinning the cloth.",
    },
  ],
  stats: [
    { figure: "2019", label: "Founded in Lahore" },
    { figure: "40,000+", label: "Homes furnished" },
    { figure: "6", label: "Rooms we dress" },
  ],
};

export const POLICIES: Record<string, PolicyPage> = {
  privacy: {
    slug: "privacy",
    title: "Privacy policy",
    eyebrow: "Legal",
    updated: "Updated 1 November 2026",
    image: "/home/banner-a4.jpg",
    intro:
      "This policy explains what we collect when you shop with Dec Walls, why we hold it and the choices you have over it.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you place an order we collect your name, delivery address, phone number and email so we can fulfil and update you on it.",
          "When you pay, your card details go straight to our payment provider. We never see or store full card numbers on our own servers.",
          "We also keep a record of what you browse and buy so we can show you relevant pieces and sort out returns quickly.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To process orders, arrange delivery, handle returns and answer your questions.",
          "To send order updates by SMS and email. Marketing messages are separate, and you only get them if you opt in.",
          "To improve the store, spot fraud and meet our legal obligations.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "Courier partners, to deliver your order, and payment providers, to take payment securely.",
          "We do not sell your personal data. We share it only with partners who help us run the store, under agreements that limit what they can do with it.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "You can ask for a copy of your data, correct it, or ask us to delete it, by writing to our support team.",
          "You can unsubscribe from marketing at any time using the link in any email, or by replying stop to an SMS.",
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms & conditions",
    eyebrow: "Legal",
    updated: "Updated 1 November 2026",
    image: "/home/banner-a5.jpg",
    intro:
      "These terms set out the agreement between you and Dec Walls when you use this site or place an order.",
    sections: [
      {
        heading: "Using this site",
        body: [
          "By browsing or ordering you agree to these terms. If you do not agree with them, please do not use the site.",
          "You must be at least 18, or have permission from a parent or guardian, to place an order.",
        ],
      },
      {
        heading: "Orders and pricing",
        body: [
          "An order is confirmed only once we send you an order confirmation. Until then we may decline it, for example if an item is out of stock or a price was listed in error.",
          "Prices are shown in Pakistani rupees and include applicable taxes unless stated otherwise. Delivery charges, where they apply, are shown at checkout.",
        ],
      },
      {
        heading: "Payment",
        body: [
          "We accept the payment methods shown at checkout, including cash on delivery where available.",
          "Payments are handled by our payment provider over a secure connection.",
        ],
      },
      {
        heading: "Products",
        body: [
          "We photograph our textiles as faithfully as we can, but colour can shift between screens and natural fibres vary slightly batch to batch. Small variation is part of the material, not a fault.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "We stand behind our products, but to the extent the law allows, our liability for any order is limited to the amount you paid for it.",
        ],
      },
    ],
  },
  returns: {
    slug: "returns",
    title: "Return & exchange policy",
    eyebrow: "Customer care",
    updated: "Updated 1 November 2026",
    image: "/home/cat-3.jpg",
    intro:
      "If something is not right, you have 14 days from delivery to return or exchange it. Here is how it works.",
    sections: [
      {
        heading: "The window",
        body: [
          "You can return or exchange most items within 14 days of delivery, as long as they are unused, unwashed and in their original packaging with tags attached.",
          "For hygiene reasons we cannot accept returns on used bath towels or opened bedding sets unless they arrived faulty.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          "Write to us at the support email with your order number and what you would like to do. We will reply with a return address and the next steps within one working day.",
          "Pack the item the way it arrived and include the order slip so we can match it to your order.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Once we receive and check the item, we refund the original payment method within 7 to 10 working days.",
          "Original delivery charges are refunded only when the return is because of a fault on our side.",
        ],
      },
      {
        heading: "Exchanges",
        body: [
          "Want a different size or colour? Tell us when you start the return and we will reserve the replacement so it does not sell out while your parcel is in transit.",
        ],
      },
    ],
  },
};

export const FAQS: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "Orders & delivery",
    items: [
      {
        q: "How long will my order take to arrive?",
        a: "Orders within Pakistan are delivered in 2 to 5 working days. You get an SMS with a tracking number the moment your parcel leaves our workshop.",
      },
      {
        q: "Do you offer cash on delivery?",
        a: "Yes, cash on delivery is available across most of the country. You will see it as an option at checkout if your address qualifies.",
      },
      {
        q: "Can I change my delivery address after ordering?",
        a: "If your order has not shipped yet, write to us with your order number and we will update it. Once it is with the courier we can no longer change the address.",
      },
    ],
  },
  {
    category: "Products & care",
    items: [
      {
        q: "Will the colour match the photos exactly?",
        a: "We photograph our textiles in natural light and keep editing minimal, but screens vary and natural fibres shift slightly between batches. Small variation is part of the cloth.",
      },
      {
        q: "How should I wash my bedding?",
        a: "Machine wash cold on a gentle cycle, tumble dry low and skip the fabric softener. Each piece ships with a care card that spells out the details.",
      },
    ],
  },
  {
    category: "Returns & refunds",
    items: [
      {
        q: "What is your return window?",
        a: "You have 14 days from delivery to return or exchange unused items in their original packaging. See the return and exchange policy for the full details.",
      },
      {
        q: "When will I get my refund?",
        a: "Once we receive and check your return, refunds reach your original payment method within 7 to 10 working days.",
      },
    ],
  },
];

export type Store = {
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
};

export const STORES: Store[] = [
  {
    name: "Dec Walls Gulberg",
    city: "Lahore",
    address: "Main Boulevard, Gulberg III, Lahore",
    phone: "+92 300 0606662",
    hours: "Mon–Sat, 11am–9pm",
  },
  {
    name: "Dec Walls DHA",
    city: "Lahore",
    address: "Commercial Broadway, Phase 8, DHA, Lahore",
    phone: "+92 300 0606663",
    hours: "Mon–Sat, 11am–9pm",
  },
  {
    name: "Dec Walls Clifton",
    city: "Karachi",
    address: "Zamzama Boulevard, Clifton, Karachi",
    phone: "+92 300 0606664",
    hours: "Mon–Sat, 11am–9pm",
  },
  {
    name: "Dec Walls F-7",
    city: "Islamabad",
    address: "Jinnah Super Market, F-7 Markaz, Islamabad",
    phone: "+92 300 0606665",
    hours: "Mon–Sat, 11am–9pm",
  },
];

export type Catalogue = {
  title: string;
  season: string;
  pages: number;
  image: string;
};

export const CATALOGUES: Catalogue[] = [
  { title: "Bedding & bath", season: "Autumn / Winter 2026", pages: 48, image: "/home/cat-1.jpg" },
  { title: "Living & décor", season: "Autumn / Winter 2026", pages: 36, image: "/home/cat-4.jpg" },
  { title: "Dining & table", season: "Autumn / Winter 2026", pages: 28, image: "/home/cat-5.jpg" },
  { title: "Wall art", season: "New collection", pages: 24, image: "/home/hero-3.jpg" },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  image: string;
  body: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-layer-a-bed",
    title: "How to layer a bed that actually invites you in",
    excerpt:
      "Sheets, a quilt, a throw and the right number of pillows — the order and weight that makes a bed look made and feel soft.",
    category: "Styling",
    date: "12 November 2026",
    readMinutes: 5,
    image: "/home/hero-bedding.jpg",
    body: [
      "A well-made bed is built in layers, each doing one job. Start with a fitted sheet in a colour close to your mattress so it disappears, then a flat sheet you can fold back to show its hem.",
      "The quilt is the weight that holds the whole thing together. Choose one that drapes past the mattress edge by a hand's width on each side, so the bed reads generous rather than skimpy.",
      "Finish with pillows in odd numbers and a single throw folded in thirds across the foot. Resist the urge to add more — restraint is what makes a bed look considered instead of cluttered.",
    ],
  },
  {
    slug: "choosing-bath-towels",
    title: "Choosing bath towels that stay soft past the first month",
    excerpt:
      "Grams per square metre, the fibre and the wash all decide whether a towel stays plush or turns scratchy. A short guide.",
    category: "Care",
    date: "28 October 2026",
    readMinutes: 4,
    image: "/home/cat-2.jpg",
    body: [
      "Towel softness comes down to three things: the fibre, the weight and how you wash it. Long-staple cotton holds its loft far longer than the short-staple cotton in cheaper towels.",
      "Weight is measured in grams per square metre. Around 600 gsm is the sweet spot — plush enough to feel generous, light enough to dry quickly between uses.",
      "The quickest way to ruin a good towel is fabric softener, which coats the loops and leaves them slick. Wash warm, skip the softener, and a vinegar rinse now and then keeps them drinking up water.",
    ],
  },
  {
    slug: "setting-a-table-for-guests",
    title: "Setting a table that makes guests want to linger",
    excerpt:
      "A pressed runner, cloth napkins and one low arrangement — the small moves that turn a meal into an occasion.",
    category: "Entertaining",
    date: "9 October 2026",
    readMinutes: 6,
    image: "/home/cat-5.jpg",
    body: [
      "You do not need a full dinner service to set a table that feels cared for. A pressed linen runner down the centre does most of the work, grounding the plates and giving the eye a line to follow.",
      "Cloth napkins are the detail guests notice without knowing why. Fold them simply and lay one at each place — paper never reads the same way.",
      "Keep arrangements low so people can see each other across the table, and let the textiles, not the centrepiece, carry the warmth.",
    ],
  },
];
