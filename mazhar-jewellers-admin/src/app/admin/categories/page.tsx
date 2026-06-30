"use client";

import { useEffect, useState } from "react";
import { getCollection, addDocument, updateDocument, deleteDocument, searchCategories } from "@/lib/firestore";
import { generateSlug } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await getCollection("categories");
    setCategories(data as unknown as Category[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = async () => {
    if (!search.trim()) { load(); return; }
    setLoading(true);
    const results = await searchCategories(search);
    setCategories(results);
    setLoading(false);
  };

  const resetForm = () => {
    setName(""); setDisplayOrder(""); setEditing(null); setShowForm(false);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat); setName(cat.name); setDisplayOrder(String(cat.displayOrder || 0)); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      const data = {
        name: name.trim(), slug: generateSlug(name), count: 0, image: "",
        displayOrder: parseInt(displayOrder) || (editing?.displayOrder || categories.length + 1),
        status: "active", createdBy: "admin",
      };
      if (editing) { await updateDocument("categories", editing.id, data); toast.success("Category updated"); }
      else { await addDocument("categories", data); toast.success("Category created"); }
      resetForm(); load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    await deleteDocument("categories", id);
    toast.success("Category deleted"); load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-gold text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gold-light">+ Add Category</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search categories..." className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
          <button onClick={handleSearch} className="px-4 py-2 bg-gold text-white rounded-lg text-sm hover:bg-gold-light">Search</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">{editing ? "Edit" : "New"} Category</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="bg-gold text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gold-light disabled:opacity-50">{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><p className="text-lg mb-2">No categories yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Slug</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Order</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.displayOrder}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(cat)} className="px-2 py-1 text-xs rounded-md hover:bg-gray-100">✏️</button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="px-2 py-1 text-xs rounded-md hover:bg-red-50">🗑️</button>
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
