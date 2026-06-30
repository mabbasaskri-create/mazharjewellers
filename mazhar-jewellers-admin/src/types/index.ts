export interface BaseDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: "active" | "inactive" | "archived";
  slug: string;
  displayOrder: number;
}

export interface Collection extends BaseDocument {
  name: string;
  image: string;
  imageStoragePath: string;
  count: number;
  description: string;
}

export interface Category extends BaseDocument {
  name: string;
  image: string;
  count: number;
}

export interface Product extends BaseDocument {
  name: string;
  shortDescription: string;
  fullDescription: string;
  description: string;
  collectionId: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  badge?: "best" | "new" | "sale" | "gift";
  badgeText?: string;
  images: string[];
  imageStoragePaths: string[];
  material?: string;
  features: string[];
  featured: boolean;
  isNewArrival: boolean;
  stockQuantity: number;
  stockStatus: "available" | "out_of_stock" | "low_stock";
}

export interface Review extends BaseDocument {
  author: string;
  city: string;
  text: string;
  stars: number;
}

export interface HeroBanner extends BaseDocument {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  desktopImage: string;
  mobileImage: string;
  desktopStoragePath: string;
  mobileStoragePath: string;
  eyebrow: string;
  active: boolean;
}

export interface SiteSettings {
  id: string;
  storeName: string;
  contactNumber: string;
  email: string;
  address: string;
  logoUrl: string;
  announcementBar: string;
  announcementHighlight: string;
  marqueeItems: string[];
  trustBar: TrustItem[];
  newsletterTitle: string;
  newsletterSubtitle: string;
  footerDescription: string;
  footerEmail: string;
  footerPhone: string;
  footerAddress: string;
  socialLinks: SocialLink[];
  updatedAt: string;
}

export interface TrustItem {
  icon: string;
  label: string;
  sub: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Order extends BaseDocument {
  userId: string;
  items: OrderItem[];
  customer: CustomerInfo;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
}

export interface Analytics {
  id: string;
  type: "pageview" | "click" | "purchase" | "search" | "add_to_cart";
  data: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface ProductWithNames extends Product {
  collectionName: string;
  collectionSlug: string;
  categoryName: string;
}
