export interface StoreLocation {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
  postalCode?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: {
    opens: string;
    closes: string;
    days: string;
  };
  phone: string;
  email: string;
  image: {
    url: string;
    alt: string;
  };
  amenities: string[];
  badge?: string;
  inStoreOffer?: string;
  description: string;
}

/**
 * Flagship locations and Global Trade Desks for Bakana Farms.
 *
 * Supports global direct sales and wholesale fulfillment across:
 * - North America & United States (Houston, Texas Distribution Hub)
 * - Pan-African Trade Corridor (Accra, Ghana AfCFTA Hub)
 * - Nigerian Flagships (Victoria Island Lagos, Abuja Maitama, Bakana Origin Estate)
 */
export const STORES: StoreLocation[] = [
  {
    id: "store-houston-texas",
    slug: "houston-texas-hub",
    name: "Americas Distribution & Trade Desk",
    city: "Houston",
    state: "Texas",
    country: "United States",
    address: "5065 Westheimer Road, Galleria Financial District, Houston, TX 77056",
    coordinates: {
      lat: 29.7397,
      lng: -95.4646,
    },
    hours: {
      opens: "08:30 AM",
      closes: "06:00 PM",
      days: "Monday – Friday (CST)",
    },
    phone: "+1 (713) 555-0182",
    email: "americas@bakanafarms.com",
    image: {
      url: "/images/bakana-open-box-honey-8k.webp",
      alt: "Bakana Farms Americas Distribution Hub in Houston, Texas",
    },
    amenities: [
      "USA Direct Express Fulfillment",
      "FDA Prior Notice Clearance Hub",
      "North America Wholesale Sampling",
      "Corporate Wellness Accounts",
    ],
    badge: "USA Hub",
    inStoreOffer: "Free 2-day priority ground shipping across Texas and continental USA on orders over $50.",
    description:
      "Our North American trade and distribution partner hub in Houston, Texas. Serving commercial retailers, luxury hospitality partners, and direct wellness subscribers across the United States.",
  },
  {
    id: "store-lagos-vi",
    slug: "victoria-island-experience-center",
    name: "Victoria Island Experience Center",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    address: "Plot 14B, Adeola Hopewell Street, Victoria Island, Lagos",
    coordinates: {
      lat: 6.4281,
      lng: 3.4219,
    },
    hours: {
      opens: "08:30 AM",
      closes: "07:00 PM",
      days: "Monday – Saturday",
    },
    phone: "+234 1 234 5678",
    email: "lagos@bakanafarms.com",
    image: {
      url: "/images/bakana-hero-product-8k.webp",
      alt: "Bakana Farms Victoria Island Experience Center storefront",
    },
    amenities: [
      "In-Store Tea Tasting Bar",
      "Retail & Gift Box Collection",
      "Wholesale Order Pick-up",
      "Agronomist Consultations",
    ],
    badge: "Flagship",
    inStoreOffer: "Receive a complimentary tasting sachet and brewing guide with every in-store visit.",
    description:
      "Our premier commercial flagship in the heart of Victoria Island. Experience our botanical Moringa, Honey and Ginger blend brewed fresh by certified tea masters.",
  },
  {
    id: "store-bakana-estate",
    slug: "estate-packhouse-farm-office",
    name: "Estate Packhouse & Tasting Pavilion",
    city: "Bakana",
    state: "Rivers State",
    country: "Nigeria",
    address: "Bakana Agricultural Corridor, Degema LGA, Rivers State",
    coordinates: {
      lat: 4.7431,
      lng: 6.9744,
    },
    hours: {
      opens: "08:00 AM",
      closes: "05:00 PM",
      days: "Monday – Friday",
    },
    phone: "+234 84 987 654",
    email: "estate@bakanafarms.com",
    image: {
      url: "/images/bakana-moringa-honey-ginger-hero-8k.webp",
      alt: "Bakana Farms Estate Packhouse and Moringa Grove",
    },
    amenities: [
      "Farm-to-Cup Tasting Pavilion",
      "Direct Estate Batch Purchases",
      "Commercial Buyer Audits",
      "Phytosanitary Inspection Hub",
    ],
    badge: "Origin Estate",
    inStoreOffer: "Commercial buyers and partners are invited for farm walk-throughs and fresh batch cupping.",
    description:
      "Situated directly beside our hand-tended Moringa groves and honey filtration facility. Tour the drying house and pick up newly harvested lots directly from the source.",
  },
  {
    id: "store-abuja-maitama",
    slug: "maitama-flagship-abuja",
    name: "Maitama Flagship Boutique",
    city: "Abuja",
    state: "Federal Capital Territory",
    country: "Nigeria",
    address: "24 Gana Street, Maitama, Abuja, FCT",
    coordinates: {
      lat: 9.0882,
      lng: 7.4985,
    },
    hours: {
      opens: "09:00 AM",
      closes: "08:00 PM",
      days: "Monday – Saturday",
    },
    phone: "+234 9 876 5432",
    email: "abuja@bakanafarms.com",
    image: {
      url: "/images/bakana-open-box-8k.webp",
      alt: "Bakana Farms Abuja Boutique in Maitama",
    },
    amenities: [
      "Express Retail Counter",
      "Corporate Gifting Consultation",
      "Diplomatic & Export Orders",
      "Curated Herbal Pairings",
    ],
    badge: "Capital Boutique",
    inStoreOffer: "Enjoy custom corporate gift wrapping and same-day courier dispatch across Abuja.",
    description:
      "Our serene boutique in Maitama caters to wellness enthusiasts, corporate buyers, and diplomatic partners seeking Nigeria's finest exported botanicals.",
  },
  {
    id: "store-accra-ghana",
    slug: "accra-ghana-hub",
    name: "West Africa AfCFTA Commercial Hub",
    city: "Accra",
    state: "Greater Accra",
    country: "Ghana",
    address: "Liberation Road, Airport City Commercial Corridor, Accra, Ghana",
    coordinates: {
      lat: 5.6037,
      lng: -0.187,
    },
    hours: {
      opens: "08:30 AM",
      closes: "06:00 PM",
      days: "Monday – Friday",
    },
    phone: "+233 30 234 5678",
    email: "ghana@bakanafarms.com",
    image: {
      url: "/images/bakana-hero-product-8k.webp",
      alt: "Bakana Farms West Africa Hub in Accra",
    },
    amenities: [
      "AfCFTA Tariff-Free Clearance",
      "ECOWAS Distribution Center",
      "Commercial Tasting Lounge",
      "Cross-Border Logistics Desk",
    ],
    badge: "AfCFTA Hub",
    inStoreOffer: "Zero customs tariffs across ECOWAS partner states under AfCFTA documentation.",
    description:
      "Our regional West African hub located in Airport City, Accra. Facilitating duty-free cross-border trade, supermarket distribution, and export logistics across the continent.",
  },
];

export function getAllStores(): StoreLocation[] {
  return STORES;
}

export function getStoreBySlug(slug: string): StoreLocation | undefined {
  return STORES.find((store) => store.slug === slug);
}

export function getStoreSlugs(): string[] {
  return STORES.map((store) => store.slug);
}
