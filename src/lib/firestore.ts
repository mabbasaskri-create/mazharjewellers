import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult,
} from "firebase/storage";
import { db, storage } from "./firebase";
import { nowISO, generateId } from "./utils";
import type {
  Collection,
  Product,
  ProductWithNames,
  Review,
  HeroBanner,
  SiteSettings,
  Order,
  Category,
} from "@/types";

function toDoc<T>(id: string, data: DocumentData): T {
  const d = data as Record<string, unknown>;
  const createdAt = d.createdAt
    ? d.createdAt instanceof Timestamp
      ? d.createdAt.toDate().toISOString()
      : String(d.createdAt)
    : nowISO();
  const updatedAt = d.updatedAt
    ? d.updatedAt instanceof Timestamp
      ? d.updatedAt.toDate().toISOString()
      : String(d.updatedAt)
    : nowISO();
  return { id, createdAt, updatedAt, ...data } as T;
}

export async function getCollection(name: string) {
  const q = query(collection(db, name), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toDoc<DocumentData>(d.id, d.data()));
}

export async function getDocument(name: string, id: string) {
  const snap = await getDoc(doc(db, name, id));
  if (!snap.exists()) return null;
  return toDoc<DocumentData>(snap.id, snap.data());
}

export async function addDocument(name: string, data: DocumentData) {
  const id = generateId();
  await setDoc(doc(db, name, id), {
    ...data,
    id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function updateDocument(name: string, id: string, data: DocumentData) {
  await updateDoc(doc(db, name, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(name: string, id: string) {
  await deleteDoc(doc(db, name, id));
}

export async function queryDocuments(
  name: string,
  constraints: QueryConstraint[] = []
) {
  const q = query(collection(db, name), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => toDoc<DocumentData>(d.id, d.data()));
}

export async function uploadFile(
  path: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, path);
  const result: UploadResult = await uploadBytes(storageRef, file);
  return await getDownloadURL(result.ref);
}

export async function uploadFileWithPath(
  path: string,
  file: File
): Promise<{ url: string; path: string }> {
  const storageRef = ref(storage, path);
  const result: UploadResult = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(result.ref);
  return { url, path };
}

export async function deleteFile(urlOrPath: string) {
  try {
    const storageRef = ref(storage, urlOrPath);
    await deleteObject(storageRef);
  } catch {}
}

export async function deleteFiles(urlsOrPaths: string[]) {
  await Promise.all(urlsOrPaths.map((u) => deleteFile(u)));
}

async function resolveProductNames(products: Product[]): Promise<ProductWithNames[]> {
  const colIds = [...new Set(products.map((p) => p.collectionId).filter(Boolean))];
  const catIds = [...new Set(products.map((p) => p.categoryId).filter(Boolean))];

  const [colSnap, catSnap] = await Promise.all([
    Promise.all(colIds.map((id) => getDoc(doc(db, "collections", id)).catch(() => null))),
    Promise.all(catIds.map((id) => getDoc(doc(db, "categories", id)).catch(() => null))),
  ]);

  const colMap = new Map<string, { name: string; slug: string }>();
  colSnap.forEach((s) => {
    if (s?.exists()) {
      const d = s.data();
      colMap.set(s.id, { name: d.name || "", slug: d.slug || "" });
    }
  });

  const catMap = new Map<string, string>();
  catSnap.forEach((s) => {
    if (s?.exists()) catMap.set(s.id, s.data().name || "");
  });

  return products.map((p) => ({
    ...p,
    collectionName: colMap.get(p.collectionId)?.name || "",
    collectionSlug: colMap.get(p.collectionId)?.slug || "",
    categoryName: catMap.get(p.categoryId) || "",
  }));
}

export async function getActiveProducts(): Promise<ProductWithNames[]> {
  const q = query(
    collection(db, "products"),
    where("status", "==", "active"),
    orderBy("displayOrder", "asc"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  const products = snap.docs.map((d) => toDoc<Product>(d.id, d.data()));
  return resolveProductNames(products);
}

export async function getProductsByCollectionSlug(slug: string): Promise<ProductWithNames[]> {
  const colSnap = await getDocs(
    query(collection(db, "collections"), where("slug", "==", slug), limit(1))
  );
  if (colSnap.empty) return [];
  const collectionId = colSnap.docs[0].id;

  const q = query(
    collection(db, "products"),
    where("collectionId", "==", collectionId),
    where("status", "==", "active"),
    orderBy("displayOrder", "asc")
  );
  const snap = await getDocs(q);
  const products = snap.docs.map((d) => toDoc<Product>(d.id, d.data()));
  return resolveProductNames(products);
}

export async function getProductBySlug(slug: string): Promise<ProductWithNames | null> {
  const q = query(
    collection(db, "products"),
    where("slug", "==", slug),
    where("status", "==", "active"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const product = toDoc<Product>(snap.docs[0].id, snap.docs[0].data());
  const resolved = await resolveProductNames([product]);
  return resolved[0] || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return toDoc<Product>(snap.id, snap.data());
}

export async function getFeaturedProducts(): Promise<ProductWithNames[]> {
  const q = query(
    collection(db, "products"),
    where("featured", "==", true),
    where("status", "==", "active"),
    orderBy("displayOrder", "asc"),
    limit(20)
  );
  const snap = await getDocs(q);
  const products = snap.docs.map((d) => toDoc<Product>(d.id, d.data()));
  return resolveProductNames(products);
}

export async function getActiveCollections(): Promise<Collection[]> {
  const q = query(
    collection(db, "collections"),
    where("status", "==", "active"),
    orderBy("displayOrder", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toDoc<Collection>(d.id, d.data()));
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const q = query(
    collection(db, "collections"),
    where("slug", "==", slug),
    where("status", "==", "active"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return toDoc<Collection>(snap.docs[0].id, snap.docs[0].data());
}

export async function getActiveReviews(): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("status", "==", "active"),
    orderBy("displayOrder", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toDoc<Review>(d.id, d.data()));
}

export async function getActiveHeroBanner(): Promise<HeroBanner | null> {
  const q = query(
    collection(db, "heroBanner"),
    where("active", "==", true),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return toDoc<HeroBanner>(snap.docs[0].id, snap.docs[0].data());
}

export async function getActiveCategories(): Promise<Category[]> {
  const q = query(
    collection(db, "categories"),
    where("status", "==", "active"),
    orderBy("displayOrder", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toDoc<Category>(d.id, d.data()));
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const snap = await getDoc(doc(db, "settings", "site"));
  if (!snap.exists()) return null;
  return toDoc<SiteSettings>(snap.id, snap.data());
}

export async function getOrders(): Promise<Order[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toDoc<Order>(d.id, d.data()));
}

export async function getOrdersByUserId(uid: string): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toDoc<Order>(d.id, d.data()));
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  await updateDocument("orders", orderId, { status });
}

export async function searchOrders(params: {
  search?: string;
  statusFilter?: string;
}): Promise<Order[]> {
  let constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
  if (params.statusFilter && params.statusFilter !== "all") {
    constraints.push(where("status", "==", params.statusFilter));
  }
  constraints.push(limit(100));
  const q = query(collection(db, "orders"), ...constraints);
  const snap = await getDocs(q);
  let orders = snap.docs.map((d) => toDoc<Order>(d.id, d.data()));
  if (params.search) {
    const term = params.search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(term) ||
        o.customer?.name?.toLowerCase().includes(term) ||
        o.customer?.email?.toLowerCase().includes(term) ||
        o.customer?.phone?.toLowerCase().includes(term)
    );
  }
  return orders;
}

export async function searchProducts(searchTerm: string): Promise<ProductWithNames[]> {
  const q = query(
    collection(db, "products"),
    where("status", "==", "active"),
    orderBy("displayOrder", "asc"),
    limit(50)
  );
  const snap = await getDocs(q);
  const products = snap.docs.map((d) => toDoc<Product>(d.id, d.data()));
  const resolved = await resolveProductNames(products);
  const term = searchTerm.toLowerCase();
  return resolved.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.collectionName.toLowerCase().includes(term) ||
      p.categoryName?.toLowerCase().includes(term) ||
      p.shortDescription?.toLowerCase().includes(term)
  );
}

export async function searchCollections(searchTerm: string): Promise<Collection[]> {
  const snap = await getDocs(collection(db, "collections"));
  const all = snap.docs.map((d) => toDoc<Collection>(d.id, d.data()));
  const term = searchTerm.toLowerCase();
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(term) ||
      c.slug.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term)
  );
}

export async function searchCategories(searchTerm: string): Promise<Category[]> {
  const snap = await getDocs(collection(db, "categories"));
  const all = snap.docs.map((d) => toDoc<Category>(d.id, d.data()));
  const term = searchTerm.toLowerCase();
  return all.filter(
    (c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term)
  );
}

export async function getFilteredProducts(params: {
  categoryId?: string;
  collectionId?: string;
  sort?: "displayOrder" | "createdAt_desc" | "createdAt_asc" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
  search?: string;
}): Promise<ProductWithNames[]> {
  const constraints: QueryConstraint[] = [];
  if (params.collectionId) constraints.push(where("collectionId", "==", params.collectionId));
  if (params.categoryId) constraints.push(where("categoryId", "==", params.categoryId));

  const sortField = params.sort || "displayOrder";
  if (sortField === "displayOrder") constraints.push(orderBy("displayOrder", "asc"));
  else if (sortField === "createdAt_desc") constraints.push(orderBy("createdAt", "desc"));
  else if (sortField === "createdAt_asc") constraints.push(orderBy("createdAt", "asc"));
  else if (sortField === "price_asc") constraints.push(orderBy("price", "asc"));
  else if (sortField === "price_desc") constraints.push(orderBy("price", "desc"));
  else if (sortField === "name_asc") constraints.push(orderBy("name", "asc"));
  else if (sortField === "name_desc") constraints.push(orderBy("name", "desc"));

  constraints.push(limit(100));
  const q = query(collection(db, "products"), ...constraints);
  const snap = await getDocs(q);
  const products = snap.docs.map((d) => toDoc<Product>(d.id, d.data()));
  let resolved = await resolveProductNames(products);

  if (params.search) {
    const term = params.search.toLowerCase();
    resolved = resolved.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.collectionName.toLowerCase().includes(term) ||
        p.categoryName?.toLowerCase().includes(term) ||
        p.shortDescription?.toLowerCase().includes(term)
    );
  }

  return resolved;
}

export async function deleteProductWithImages(product: Product) {
  if (product.imageStoragePaths && product.imageStoragePaths.length > 0) {
    await deleteFiles(product.imageStoragePaths);
  }
  await deleteDocument("products", product.id);
}

export async function deleteCollectionWithImage(collection: Collection) {
  if (collection.imageStoragePath) {
    await deleteFile(collection.imageStoragePath);
  }
  await deleteDocument("collections", collection.id);
}

export async function getDashboardStats() {
  const products = await getCollection("products");
  const orders = await getCollection("orders");
  const collections = await getCollection("collections");
  const reviews = await getCollection("reviews");
  const categories = await getCollection("categories");

  return {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === "active").length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    revenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total || 0), 0),
    totalCollections: collections.length,
    totalReviews: reviews.length,
    totalCategories: categories.length,
    recentOrders: orders.slice(0, 5),
  };
}
