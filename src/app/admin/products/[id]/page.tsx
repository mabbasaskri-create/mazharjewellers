"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDocument, updateDocument, uploadFileWithPath, deleteFile, getActiveCategories, getActiveCollections } from "@/lib/firestore";
import { generateSlug } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Product, Collection, Category } from "@/types";

const MAX_IMAGES = 5;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [badge, setBadge] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [status, setStatus] = useState("active");
  const [featured, setFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [stockQuantity, setStockQuantity] = useState("0");
  const [stockStatus, setStockStatus] = useState("available");
  const [displayOrder, setDisplayOrder] = useState("1");

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingPaths, setExistingPaths] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      getDocument("products", id),
      getActiveCollections(),
      getActiveCategories(),
    ]).then(([doc, cols, cats]) => {
      if (!doc) { toast.error("Product not found"); router.push("/admin/products"); return; }
      const p = doc as unknown as Product;
      setName(p.name);
      setShortDescription(p.shortDescription || "");
      setFullDescription(p.fullDescription || "");
      setCollectionId(p.collectionId || "");
      setCategoryId(p.categoryId || "");
      setPrice(String(p.price));
      setOldPrice(p.oldPrice ? String(p.oldPrice) : "");
      setBadge(p.badge || "");
      setBadgeText(p.badgeText || "");
      setStatus(p.status);
      setFeatured(p.featured);
      setIsNewArrival(p.isNewArrival || false);
      setStockQuantity(String(p.stockQuantity ?? 0));
      setStockStatus(p.stockStatus || "available");
      setDisplayOrder(String(p.displayOrder || 1));
      setExistingImages(p.images || []);
      setExistingPaths(p.imageStoragePaths || []);
      setCollections(cols as unknown as Collection[]);
      setCategories(cats as unknown as Category[]);
      setLoading(false);
    }).catch(() => { toast.error("Failed to load product"); router.push("/admin/products"); });
  }, [id, router]);

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalExisting = existingImages.length - imagesToDelete.length;
    const remaining = MAX_IMAGES - totalExisting - newImageFiles.length;
    const toAdd = files.slice(0, remaining);
    setNewImageFiles((prev) => [...prev, ...toAdd]);
    setNewImagePreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    const removedPath = existingPaths[index] || "";
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setExistingPaths((prev) => prev.filter((_, i) => i !== index));
    if (removedPath) setImagesToDelete((prev) => [...prev, removedPath]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) { toast.error("Name and price are required"); return; }
    setSaving(true);

    try {
      if (imagesToDelete.length > 0) {
        await Promise.all(imagesToDelete.map((p) => deleteFile(p).catch(() => {})));
      }
      const uploaded = await Promise.all(
        newImageFiles.map((f) => uploadFileWithPath(`products/${Date.now()}_${f.name}`, f))
      );
      const finalImages = [...existingImages, ...uploaded.map((u) => u.url)];
      const finalPaths = [...existingPaths, ...uploaded.map((u) => u.path)];
      const priceNum = parseFloat(price);
      const oldPriceNum = oldPrice ? parseFloat(oldPrice) : 0;
      const discount = oldPriceNum > 0 ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100) : 0;

      await updateDocument("products", id, {
        name: name.trim(),
        slug: generateSlug(name),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        description: shortDescription.trim(),
        collectionId,
        categoryId: categoryId || null,
        price: priceNum,
        oldPrice: oldPriceNum || null,
        discount: discount || null,
        badge: badge || null,
        badgeText: badgeText || null,
        images: finalImages,
        imageStoragePaths: finalPaths,
        displayOrder: parseInt(displayOrder) || 1,
        featured,
        isNewArrival,
        stockQuantity: parseInt(stockQuantity) || 0,
        stockStatus,
        status,
      });

      toast.success("Product updated!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">Update product details.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
          <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
          <textarea value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Collection *</label>
            <select value={collectionId} onChange={(e) => setCollectionId(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
              <option value="">Select collection</option>
              {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR) *</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
            <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
            <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
              <option value="available">Available</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
            <select value={badge} onChange={(e) => setBadge(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
              <option value="">None</option>
              <option value="best">Best Seller</option>
              <option value="new">New In</option>
              <option value="sale">Sale</option>
              <option value="gift">Gift Pick</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
            <input type="text" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end gap-4 pb-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded" />
              <span className="text-sm text-gray-700">New Arrival</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (up to {MAX_IMAGES})</label>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((url, i) => (
              <div key={`e-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-[#f5f0ea] border border-gray-200">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            ))}
            {newImagePreviews.map((preview, i) => (
              <div key={`n-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-[#f5f0ea] border border-green-300">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            ))}
            {(existingImages.length + newImageFiles.length) < MAX_IMAGES && (
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors">
                <span className="text-2xl text-gray-400">+</span>
                <input type="file" accept="image/*" multiple onChange={handleNewImages} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">{existingImages.length + newImageFiles.length}/{MAX_IMAGES} images</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50">{saving ? "Saving..." : "Update Product"}</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}
