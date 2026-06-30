"use client";

import { useEffect, useState } from "react";
import { getCollection, addDocument, updateDocument, uploadFileWithPath, deleteCollectionWithImage, searchCollections } from "@/lib/firestore";
import { generateSlug } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Collection } from "@/types";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [count, setCount] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageStoragePath, setImageStoragePath] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await getCollection("collections");
    setCollections(data as unknown as Collection[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = async () => {
    if (!search.trim()) { load(); return; }
    setLoading(true);
    const results = await searchCollections(search);
    setCollections(results);
    setLoading(false);
  };

  const resetForm = () => {
    setName(""); setDescription(""); setCount(""); setDisplayOrder(""); setStatus("active");
    setImageFile(null); setImagePreview(null); setImageStoragePath("");
    setEditing(null); setShowForm(false);
  };

  const openEdit = (col: Collection) => {
    setEditing(col); setName(col.name); setDescription(col.description || "");
    setCount(String(col.count || 0)); setDisplayOrder(String(col.displayOrder || 0));
    setStatus(col.status as "active" | "inactive");
    setImagePreview(col.image || null); setImageStoragePath(col.imageStoragePath || "");
    setShowForm(true);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      let imageUrl = imagePreview || "";
      let newStoragePath = imageStoragePath;
      if (imageFile) {
        const result = await uploadFileWithPath(`collections/${Date.now()}_${imageFile.name}`, imageFile);
        imageUrl = result.url; newStoragePath = result.path;
      }
      const data = {
        name: name.trim(), slug: generateSlug(name), description: description.trim(),
        count: parseInt(count) || 0, displayOrder: parseInt(displayOrder) || (editing?.displayOrder || collections.length + 1),
        image: imageUrl, imageStoragePath: newStoragePath, status, createdBy: "admin",
      };
      if (editing) { await updateDocument("collections", editing.id, data); toast.success("Collection updated"); }
      else { await addDocument("collections", data); toast.success("Collection created"); }
      resetForm(); load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (col: Collection) => {
    if (!confirm(`Delete collection "${col.name}"? Image will also be deleted.`)) return;
    try { await deleteCollectionWithImage(col); toast.success("Collection deleted"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  const toggleStatus = async (col: Collection) => {
    await updateDocument("collections", col.id, { status: col.status === "active" ? "inactive" : "active" });
    toast.success("Status toggled"); load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="text-sm text-gray-500 mt-1">{collections.length} collections</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-gold text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gold-light">+ Add Collection</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search collections..." className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
          <button onClick={handleSearch} className="px-4 py-2 bg-gold text-white rounded-lg text-sm hover:bg-gold-light">Search</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">{editing ? "Edit" : "New"} Collection</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
                <input type="number" value={count} onChange={(e) => setCount(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Choose Image
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
                {imagePreview && <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#f5f0ea]"><img src={imagePreview} alt="" className="w-full h-full object-cover" /></div>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as "active" | "inactive")} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="bg-gold text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gold-light disabled:opacity-50">{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {collections.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><p className="text-lg mb-2">No collections yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Collection</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Slug</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((col) => (
                  <tr key={col.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f5f0ea] overflow-hidden shrink-0">
                          {col.image && <img src={col.image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{col.name}</span>
                          {col.description && <p className="text-xs text-gray-400 truncate max-w-[200px]">{col.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{col.slug}</td>
                    <td className="px-4 py-3 text-gray-500">{col.displayOrder}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(col)} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${col.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{col.status}</button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(col)} className="px-2 py-1 text-xs rounded-md hover:bg-gray-100">✏️</button>
                      <button onClick={() => handleDelete(col)} className="px-2 py-1 text-xs rounded-md hover:bg-red-50">🗑️</button>
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
