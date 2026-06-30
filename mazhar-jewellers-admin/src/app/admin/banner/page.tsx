"use client";

import { useEffect, useState } from "react";
import { getCollection, addDocument, updateDocument, deleteDocument, uploadFileWithPath, deleteFile } from "@/lib/firestore";
import toast from "react-hot-toast";
import type { HeroBanner } from "@/types";

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<HeroBanner | null>(null);
  const [title, setTitle] = useState("Sparkle &<br>Beauty");
  const [subtitle, setSubtitle] = useState("Premium quality jewellery with exquisite craftsmanship and beautiful design.");
  const [eyebrow, setEyebrow] = useState("✦ &nbsp; New Collection 2025 &nbsp; ✦");
  const [ctaText, setCtaText] = useState("SHOP NOW");
  const [ctaLink, setCtaLink] = useState("#");
  const [active, setActive] = useState(true);

  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [desktopPath, setDesktopPath] = useState("");

  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [mobilePath, setMobilePath] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    const data = await getCollection("heroBanner");
    setBanners(data as unknown as HeroBanner[]);
    if (data.length > 0) {
      const b = data[0] as unknown as HeroBanner;
      setEditing(b);
      setTitle(b.title);
      setSubtitle(b.subtitle);
      setEyebrow(b.eyebrow);
      setCtaText(b.ctaText);
      setCtaLink(b.ctaLink);
      setActive(b.active);
      setDesktopPreview(b.desktopImage || b.image || null);
      setMobilePreview(b.mobileImage || null);
      setDesktopPath(b.desktopStoragePath || "");
      setMobilePath(b.mobileStoragePath || "");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDesktopImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesktopFile(file);
      setDesktopPreview(URL.createObjectURL(file));
    }
  };

  const handleMobileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMobileFile(file);
      setMobilePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    setSaving(true);

    try {
      let desktopUrl = desktopPreview || "";
      let newDesktopPath = desktopPath;
      if (desktopFile) {
        if (desktopPath) await deleteFile(desktopPath).catch(() => {});
        const result = await uploadFileWithPath(`banners/desktop_${Date.now()}_${desktopFile.name}`, desktopFile);
        desktopUrl = result.url;
        newDesktopPath = result.path;
      }

      let mobileUrl = mobilePreview || "";
      let newMobilePath = mobilePath;
      if (mobileFile) {
        if (mobilePath) await deleteFile(mobilePath).catch(() => {});
        const result = await uploadFileWithPath(`banners/mobile_${Date.now()}_${mobileFile.name}`, mobileFile);
        mobileUrl = result.url;
        newMobilePath = result.path;
      }

      const data = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        eyebrow: eyebrow.trim(),
        ctaText: ctaText.trim(),
        ctaLink: ctaLink.trim(),
        image: desktopUrl,
        desktopImage: desktopUrl,
        mobileImage: mobileUrl,
        desktopStoragePath: newDesktopPath,
        mobileStoragePath: newMobilePath,
        active,
        status: "active",
        slug: "hero-banner",
        createdBy: "admin",
      };

      if (editing) {
        await updateDocument("heroBanner", editing.id, data);
        toast.success("Banner updated");
      } else {
        await addDocument("heroBanner", data);
        toast.success("Banner created");
      }
      load();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const b = banners.find((x) => x.id === id) as unknown as HeroBanner;
      if (b?.desktopStoragePath) await deleteFile(b.desktopStoragePath).catch(() => {});
      if (b?.mobileStoragePath) await deleteFile(b.mobileStoragePath).catch(() => {});
      await deleteDocument("heroBanner", id);
      toast.success("Banner deleted");
      load();
    } catch { toast.error("Failed to delete"); } finally { setDeletingId(null); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hero Banner</h1>
        <p className="text-sm text-gray-500 mt-1">Manage hero banners. Upload separate desktop and mobile images for perfect display on all devices.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
            <p className="text-xs text-gray-400 mt-1">HTML tags allowed (e.g., &lt;br&gt;, &lt;em&gt;)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
            <input type="text" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
            <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
            <input type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desktop Banner Image (1920×1080 recommended)</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Choose Image
                <input type="file" accept="image/*" onChange={handleDesktopImage} className="hidden" />
              </label>
              {desktopPreview && (
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-[#f5f0ea]">
                  <img src={desktopPreview} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Banner Image (750×1334 recommended)</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Choose Image
                <input type="file" accept="image/*" onChange={handleMobileImage} className="hidden" />
              </label>
              {mobilePreview && (
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#f5f0ea]">
                  <img src={mobilePreview} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded" />
          <span className="text-sm text-gray-700">Banner active (visible on website)</span>
        </label>

        <button type="submit" disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gold-light disabled:opacity-50">
          {saving ? "Saving..." : editing ? "Update Banner" : "Create Banner"}
        </button>
      </form>

      {banners.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">All Banners</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {banners.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 rounded bg-[#f5f0ea] overflow-hidden">
                    <img src={b.desktopImage || b.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.title.replace(/<[^>]*>/g, "")}</p>
                    <p className="text-xs text-gray-400">{b.active ? "Active" : "Inactive"}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(b.id)} disabled={deletingId === b.id} className="px-3 py-1.5 text-xs rounded-lg hover:bg-red-50 text-red-500 disabled:opacity-50">
                  {deletingId === b.id ? "..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
