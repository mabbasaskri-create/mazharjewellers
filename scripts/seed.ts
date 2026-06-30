// Seed script: Populate Firestore with initial data.
// Usage: npx ts-node --compiler-options '{"module":"commonjs","moduleResolution":"node"}' scripts/seed.ts

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const now = Timestamp.now();

const categoryIds = {
  pendants: "cat-pendants",
  chokers: "cat-chokers",
  studs: "cat-studs",
  drops: "cat-drops",
  solitaire: "cat-solitaire",
  bangles: "cat-bangles",
  tennis: "cat-tennis",
};

const collectionIds = {
  necklaces: "col-necklaces",
  earrings: "col-earrings",
  rings: "col-rings",
  bracelets: "col-bracelets",
  gemstones: "col-gemstones",
};

const seedData = {
  categories: [
    { id: categoryIds.pendants, name: "Pendants", slug: "pendants", image: "", count: 12, displayOrder: 1, status: "active" },
    { id: categoryIds.chokers, name: "Chokers", slug: "chokers", image: "", count: 8, displayOrder: 2, status: "active" },
    { id: categoryIds.studs, name: "Studs", slug: "studs", image: "", count: 15, displayOrder: 3, status: "active" },
    { id: categoryIds.drops, name: "Drops", slug: "drops", image: "", count: 10, displayOrder: 4, status: "active" },
    { id: categoryIds.solitaire, name: "Solitaire", slug: "solitaire", image: "", count: 6, displayOrder: 5, status: "active" },
    { id: categoryIds.bangles, name: "Bangles", slug: "bangles", image: "", count: 9, displayOrder: 6, status: "active" },
    { id: categoryIds.tennis, name: "Tennis", slug: "tennis", image: "", count: 7, displayOrder: 7, status: "active" },
  ],

  collections: [
    { id: collectionIds.necklaces, name: "Necklaces", slug: "necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", imageStoragePath: "", description: "Exquisite necklaces for every occasion.", count: 142, displayOrder: 1, status: "active" },
    { id: collectionIds.earrings, name: "Earrings", slug: "earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80", imageStoragePath: "", description: "Stunning earrings to frame your face.", count: 98, displayOrder: 2, status: "active" },
    { id: collectionIds.rings, name: "Rings", slug: "rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80", imageStoragePath: "", description: "Beautiful rings for every finger.", count: 76, displayOrder: 3, status: "active" },
    { id: collectionIds.bracelets, name: "Bracelets", slug: "bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80", imageStoragePath: "", description: "Elegant bracelets and bangles.", count: 65, displayOrder: 4, status: "active" },
    { id: collectionIds.gemstones, name: "Gemstones", slug: "gemstones", image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=500&q=80", imageStoragePath: "", description: "Natural gemstone jewellery.", count: 50, displayOrder: 5, status: "active" },
  ],

  products: [
    { name: "Swan Pendant Necklace, Rhodium Plated", slug: "swan-pendant-necklace", collectionId: collectionIds.necklaces, categoryId: categoryIds.pendants, price: 12500, images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80"], imageStoragePaths: [], badge: "best", badgeText: "BEST SELLER", displayOrder: 1, featured: true, isNewArrival: false, stockQuantity: 15, stockStatus: "available", status: "active" },
    { name: "Star Choker Necklace, Rhodium Plated", slug: "star-choker-necklace", collectionId: collectionIds.necklaces, categoryId: categoryIds.chokers, price: 15200, images: ["https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=600&q=80"], imageStoragePaths: [], badge: "", badgeText: "", displayOrder: 2, featured: true, isNewArrival: false, stockQuantity: 10, stockStatus: "available", status: "active" },
    { name: "Crystal Pearl Necklace, Gold Tone", slug: "crystal-pearl-necklace", collectionId: collectionIds.necklaces, categoryId: categoryIds.pendants, price: 16800, images: ["https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80"], imageStoragePaths: [], badge: "new", badgeText: "NEW IN", displayOrder: 3, featured: true, isNewArrival: true, stockQuantity: 8, stockStatus: "available", status: "active" },
    { name: "Crystal Bib Necklace, Gold Plated", slug: "crystal-bib-necklace", collectionId: collectionIds.necklaces, categoryId: categoryIds.chokers, price: 28500, oldPrice: 35600, discount: 20, images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80"], imageStoragePaths: [], badge: "sale", badgeText: "SALE 20%", displayOrder: 4, featured: true, isNewArrival: false, stockQuantity: 3, stockStatus: "low_stock", status: "active" },
    { name: "Oval Crystal Drop Earrings, Gold Tone", slug: "oval-crystal-drop-earrings", collectionId: collectionIds.earrings, categoryId: categoryIds.drops, price: 8900, images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"], imageStoragePaths: [], badge: "new", badgeText: "NEW IN", displayOrder: 5, featured: true, isNewArrival: true, stockQuantity: 20, stockStatus: "available", status: "active" },
    { name: "Heart Crystal Drop Earrings, Rose Gold", slug: "heart-crystal-drop-earrings", collectionId: collectionIds.earrings, categoryId: categoryIds.drops, price: 9500, images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80"], imageStoragePaths: [], badge: "", badgeText: "", displayOrder: 6, featured: true, isNewArrival: false, stockQuantity: 12, stockStatus: "available", status: "active" },
    { name: "Deep Garnet Drop Earrings, Silver Tone", slug: "deep-garnet-drop-earrings", collectionId: collectionIds.earrings, categoryId: categoryIds.drops, price: 10500, oldPrice: 12350, discount: 15, images: ["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80"], imageStoragePaths: [], badge: "sale", badgeText: "SALE 15%", displayOrder: 7, featured: true, isNewArrival: false, stockQuantity: 5, stockStatus: "available", status: "active" },
    { name: "Crystal Pearl Drop Earrings, Gold Tone", slug: "crystal-pearl-drop-earrings", collectionId: collectionIds.earrings, categoryId: categoryIds.drops, price: 11200, images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"], imageStoragePaths: [], badge: "", badgeText: "", displayOrder: 8, featured: true, isNewArrival: false, stockQuantity: 7, stockStatus: "available", status: "active" },
    { name: "Solitaire Ring, Octagon Cut Crystal", slug: "solitaire-ring", collectionId: collectionIds.rings, categoryId: categoryIds.solitaire, price: 14700, images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80"], imageStoragePaths: [], badge: "best", badgeText: "BEST SELLER", displayOrder: 9, featured: true, isNewArrival: false, stockQuantity: 25, stockStatus: "available", status: "active" },
    { name: "Amethyst Gemstone Ring, Silver Plated", slug: "amethyst-gemstone-ring", collectionId: collectionIds.rings, categoryId: categoryIds.solitaire, price: 11900, images: ["https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=600&q=80"], imageStoragePaths: [], badge: "new", badgeText: "NEW IN", displayOrder: 10, featured: true, isNewArrival: true, stockQuantity: 6, stockStatus: "available", status: "active" },
    { name: "Ruby Crystal Ring, Rose Gold Plated", slug: "ruby-crystal-ring", collectionId: collectionIds.rings, categoryId: categoryIds.solitaire, price: 18900, images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80"], imageStoragePaths: [], badge: "", badgeText: "", displayOrder: 11, featured: true, isNewArrival: false, stockQuantity: 4, stockStatus: "low_stock", status: "active" },
    { name: "Emerald Crystal Ring, Gold Tone", slug: "emerald-crystal-ring", collectionId: collectionIds.rings, categoryId: categoryIds.solitaire, price: 21500, oldPrice: 23900, discount: 10, images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80"], imageStoragePaths: [], badge: "sale", badgeText: "SALE 10%", displayOrder: 12, featured: true, isNewArrival: false, stockQuantity: 0, stockStatus: "out_of_stock", status: "active" },
    { name: "Crystal Tennis Bracelet, Rose Gold Plated", slug: "crystal-tennis-bracelet", collectionId: collectionIds.bracelets, categoryId: categoryIds.tennis, price: 18500, images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80"], imageStoragePaths: [], badge: "best", badgeText: "BEST SELLER", displayOrder: 13, featured: true, isNewArrival: false, stockQuantity: 18, stockStatus: "available", status: "active" },
    { name: "Crystal Pearl Bracelet, Gold Tone", slug: "crystal-pearl-bracelet", collectionId: collectionIds.bracelets, categoryId: categoryIds.bangles, price: 13500, images: ["https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80"], imageStoragePaths: [], badge: "new", badgeText: "NEW IN", displayOrder: 14, featured: true, isNewArrival: true, stockQuantity: 9, stockStatus: "available", status: "active" },
    { name: "Star Charm Bracelet, Rhodium Plated", slug: "star-charm-bracelet", collectionId: collectionIds.bracelets, categoryId: categoryIds.tennis, price: 14200, images: ["https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=600&q=80"], imageStoragePaths: [], badge: "", badgeText: "", displayOrder: 15, featured: true, isNewArrival: false, stockQuantity: 11, stockStatus: "available", status: "active" },
    { name: "Crystal Link Bracelet, Silver Tone", slug: "crystal-link-bracelet", collectionId: collectionIds.bracelets, categoryId: categoryIds.bangles, price: 16800, oldPrice: 21000, discount: 20, images: ["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80"], imageStoragePaths: [], badge: "sale", badgeText: "SALE 20%", displayOrder: 16, featured: true, isNewArrival: false, stockQuantity: 2, stockStatus: "low_stock", status: "active" },
    { name: "Natural Amethyst Pendant, Silver Plated", slug: "natural-amethyst-pendant", collectionId: collectionIds.gemstones, categoryId: categoryIds.pendants, price: 14900, images: ["https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=600&q=80"], imageStoragePaths: [], badge: "best", badgeText: "BEST SELLER", displayOrder: 17, featured: true, isNewArrival: false, stockQuantity: 14, stockStatus: "available", status: "active" },
    { name: "Green Emerald Stud Earrings, Gold Tone", slug: "green-emerald-stud-earrings", collectionId: collectionIds.gemstones, categoryId: categoryIds.studs, price: 18500, images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80"], imageStoragePaths: [], badge: "new", badgeText: "NEW IN", displayOrder: 18, featured: true, isNewArrival: true, stockQuantity: 6, stockStatus: "available", status: "active" },
    { name: "Natural Ruby Gemstone Ring, Rose Gold", slug: "natural-ruby-gemstone-ring", collectionId: collectionIds.gemstones, categoryId: categoryIds.solitaire, price: 22400, oldPrice: 29900, discount: 25, images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80"], imageStoragePaths: [], badge: "sale", badgeText: "SALE 25%", displayOrder: 19, featured: true, isNewArrival: false, stockQuantity: 1, stockStatus: "low_stock", status: "active" },
    { name: "Blue Sapphire Crystal Bracelet, Silver Tone", slug: "blue-sapphire-crystal-bracelet", collectionId: collectionIds.gemstones, categoryId: categoryIds.bangles, price: 16700, images: ["https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80"], imageStoragePaths: [], badge: "", badgeText: "", displayOrder: 20, featured: true, isNewArrival: false, stockQuantity: 0, stockStatus: "out_of_stock", status: "active" },
    { name: "Flower Crystal Stud Earrings, Silver Tone", slug: "flower-crystal-stud-earrings", collectionId: collectionIds.earrings, categoryId: categoryIds.studs, price: 6500, images: ["https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80"], imageStoragePaths: [], badge: "new", badgeText: "NEW IN", displayOrder: 21, featured: true, isNewArrival: true, stockQuantity: 30, stockStatus: "available", status: "active" },
  ],

  reviews: [
    { author: "SANA M.", city: "LAHORE", text: "Bought a necklace set for my wedding — it looked exactly like the photo. Quality and packaging were outstanding. Thank you Mazhar Jewellers!", stars: 5, displayOrder: 1, status: "active" },
    { author: "AYESHA K.", city: "KARACHI", text: "Gifted earrings to my sister for Eid — she loved them! The packaging was so beautiful we didn't even need gift wrap!", stars: 5, displayOrder: 2, status: "active" },
    { author: "HASSAN R.", city: "ISLAMABAD", text: "Got a crystal set — feels no different from imported brands. Great price and excellent quality. Next day delivery in Islamabad!", stars: 5, displayOrder: 3, status: "active" },
  ],
};

async function seed() {
  console.log("Starting seed to Firestore...\n");

  // Hero Banner
  const bannerId = "hero-main";
  await setDoc(doc(db, "heroBanner", bannerId), {
    title: "Sparkle &<br>Beauty",
    subtitle: "Premium quality jewellery with exquisite craftsmanship and beautiful design.",
    eyebrow: "✦ &nbsp; New Collection 2025 &nbsp; ✦",
    ctaText: "SHOP NOW",
    ctaLink: "#",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80",
    desktopImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80",
    mobileImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    desktopStoragePath: "",
    mobileStoragePath: "",
    active: true,
    status: "active",
    slug: "hero-banner",
    id: bannerId,
    displayOrder: 1,
    createdAt: now,
    updatedAt: now,
    createdBy: "seed",
  });
  console.log(`✓ Hero banner seeded (${bannerId})`);

  // Categories
  for (const cat of seedData.categories) {
    await setDoc(doc(db, "categories", cat.id), {
      ...cat, id: cat.id, createdAt: now, updatedAt: now, createdBy: "seed",
    });
    console.log(`✓ Category: ${cat.name} (${cat.id})`);
  }

  // Collections
  for (const col of seedData.collections) {
    await setDoc(doc(db, "collections", col.id), {
      ...col, id: col.id, createdAt: now, updatedAt: now, createdBy: "seed",
    });
    console.log(`✓ Collection: ${col.name} (${col.id})`);
  }

  // Products
  for (const prod of seedData.products) {
    const id = `prod-${prod.slug}`;
    await setDoc(doc(db, "products", id), {
      ...prod,
      id,
      shortDescription: "",
      fullDescription: "",
      description: "",
      features: [],
      material: "",
      createdAt: now,
      updatedAt: now,
      createdBy: "seed",
    });
    console.log(`✓ Product: ${prod.name.substring(0, 40)}... (${id})`);
  }

  // Reviews
  for (const rev of seedData.reviews) {
    const id = `rev-${rev.displayOrder}`;
    await setDoc(doc(db, "reviews", id), {
      ...rev, id, slug: `review-${rev.displayOrder}`, createdAt: now, updatedAt: now, createdBy: "seed",
    });
    console.log(`✓ Review: ${rev.author} (${id})`);
  }

  // Settings
  await setDoc(doc(db, "settings", "site"), {
    id: "site",
    storeName: "Mazhar Jewellers",
    contactNumber: "+92 300 1234567",
    email: "info@mazharjewellers.com",
    address: "Lahore, Pakistan",
    logoUrl: "",
    announcementBar: "RAMADAN SALE",
    announcementHighlight: "UP TO 40% OFF",
    marqueeItems: [
      "FREE DELIVERY ACROSS PAKISTAN",
      "EASY INSTALLMENTS ON HBL & MEEZAN",
      "COD AVAILABLE",
      "30-DAY RETURN POLICY",
      "AUTHENTICITY GUARANTEE",
      "LAHORE · KARACHI · ISLAMABAD · PESHAWAR",
    ],
    trustBar: [
      { icon: "🚚", label: "Free Delivery", sub: "Free on orders PKR 5,000+\nacross Pakistan" },
      { icon: "💳", label: "Easy Installments", sub: "HBL, Meezan, JazzCash\n3–12 months" },
      { icon: "🔄", label: "30-Day Returns", sub: "Easy returns & exchanges\nhassle-free" },
      { icon: "✅", label: "100% Authentic", sub: "Genuine crystals &\nquality assured" },
    ],
    newsletterTitle: "Join Our Inner Circle",
    newsletterSubtitle: "Be the first to know about new collections, exclusive offers, and behind-the-scenes stories.",
    footerDescription: "Premium quality crystal jewellery with exquisite craftsmanship. Every piece tells a story of elegance and beauty.",
    footerEmail: "",
    footerPhone: "",
    footerAddress: "",
    socialLinks: [],
    updatedAt: now.toDate().toISOString(),
  });
  console.log("✓ Site settings seeded");

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

const email = process.env.FIREBASE_ADMIN_EMAIL || "";
const password = process.env.FIREBASE_ADMIN_PASSWORD || "";

if (!email || !password) {
  console.log("⚠️  Set FIREBASE_ADMIN_EMAIL and FIREBASE_ADMIN_PASSWORD env vars");
  process.exit(1);
}

signInWithEmailAndPassword(auth, email, password)
  .then(() => seed())
  .catch((err) => {
    console.error("Auth failed:", err.message);
    process.exit(1);
  });
