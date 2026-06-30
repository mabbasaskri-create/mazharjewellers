"use client";

import { useEffect, useState } from "react";
import { getCollection, addDocument, updateDocument, deleteDocument } from "@/lib/firestore";
import toast from "react-hot-toast";
import type { Review } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState("5");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await getCollection("reviews");
    setReviews(data as unknown as Review[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setAuthor(""); setCity(""); setText(""); setStars("5");
    setEditing(null); setShowForm(false);
  };

  const openEdit = (r: Review) => {
    setEditing(r); setAuthor(r.author); setCity(r.city);
    setText(r.text); setStars(String(r.stars)); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return toast.error("Author and review text are required");
    setSaving(true);
    try {
      const data = {
        author: author.trim(), city: city.trim(), text: text.trim(),
        stars: parseInt(stars) || 5, displayOrder: editing?.displayOrder || reviews.length + 1,
        status: "active", slug: `review-${Date.now()}`, createdBy: "admin",
      };
      if (editing) {
        await updateDocument("reviews", editing.id, data);
        toast.success("Review updated");
      } else {
        await addDocument("reviews", data);
        toast.success("Review created");
      }
      resetForm(); load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await deleteDocument("reviews", id);
    toast.success("Review deleted"); load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-gold text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gold-light">+ Add Review</button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">{editing ? "Edit" : "New"} Review</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="SANA M." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="LAHORE" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stars</label>
              <select value={stars} onChange={(e) => setStars(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Text *</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="Bought a necklace set..." />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="bg-gold text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gold-light disabled:opacity-50">{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No reviews yet</p>
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium text-gray-900">{r.author}</p>
                  <span className="text-xs text-gray-400">{r.city}</span>
                  <span className="text-yellow-500 text-sm">{'★'.repeat(r.stars)}</span>
                </div>
                <p className="text-sm text-gray-600 italic">&ldquo;{r.text}&rdquo;</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs rounded-md hover:bg-gray-100">✏️</button>
                <button onClick={() => handleDelete(r.id)} className="px-2 py-1 text-xs rounded-md hover:bg-red-50">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
