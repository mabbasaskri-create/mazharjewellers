"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getFilteredProducts, getCollection, updateDocument, deleteProductWithImages, getActiveCollections, getActiveCategories } from "@/lib/firestore";
import type { ProductWithNames, Collection, Category } from "@/types";
import { formatPrice, truncate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithNames[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCol, setFilterCol] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [sort, setSort] = useState("displayOrder");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, cols, cats] = await Promise.all([
        getFilteredProducts({
          collectionId: filterCol || undefined,
          categoryId: filterCat || undefined,
          sort: sort as never,
          search: search || undefined,
        }),
        getActiveCollections(),
        getActiveCategories(),
      ]);
      setProducts(data);
      setCollections(cols as unknown as Collection[]);
      setCategories(cats as unknown as Category[]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filterCol, filterCat, sort, search]);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = async (p: ProductWithNames) => {
    const newStatus = p.status === "active" ? "inactive" : "active";
    await updateDocument("products", p.id, { status: newStatus });
    toast.success(`Product ${newStatus === "active" ? "activated" : "deactivated"}`);
    load();
  };

  const handleDelete = async (p: ProductWithNames) => {
    if (!confirm(`Delete "${p.name}"? All images will be permanently deleted from storage.`)) return;
    try {
      await deleteProductWithImages(p);
      toast.success("Product and images deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} product{products.length !== 1 && "s"}</p>
        </div>
        <Link href="/admin/products/new" className="bg-gold text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gold-light transition-colors">+ Add Product</Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..." className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
          />
          <select value={filterCol} onChange={(e) => setFilterCol(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold">
            <option value="">All Collections</option>
            {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold">
            <option value="displayOrder">Display Order</option>
            <option value="createdAt_desc">Newest</option>
            <option value="createdAt_asc">Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
            <option value="name_desc">Name: Z-A</option>
          </select>
          <button onClick={load} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">Refresh</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No products found</p>
            <p className="text-sm">Try different search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Collection</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Stock</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Featured</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f5f0ea] overflow-hidden shrink-0">
                          {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{truncate(p.name, 40)}</p>
                          <p className="text-xs text-gray-400">{p.collectionName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.collectionName}</td>
                    <td className="px-4 py-3 text-gray-500">{p.categoryName || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">{formatPrice(p.price)}</span>
                      {p.oldPrice && <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(p.oldPrice)}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.stockStatus === "available" ? "bg-green-50 text-green-700" :
                        p.stockStatus === "low_stock" ? "bg-yellow-50 text-yellow-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {p.stockQuantity > 0 ? `${p.stockQuantity}` : p.stockStatus === "available" ? "In Stock" : p.stockStatus === "low_stock" ? "Low" : "Out"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.displayOrder}</td>
                    <td className="px-4 py-3">{p.featured ? <span className="text-yellow-500">★</span> : <span className="text-gray-300">★</span>}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(p)} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${p.id}`} className="px-2 py-1 text-xs rounded-md hover:bg-gray-100 transition-colors">✏️</Link>
                        <button onClick={() => handleDelete(p)} className="px-2 py-1 text-xs rounded-md hover:bg-red-50 transition-colors">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
