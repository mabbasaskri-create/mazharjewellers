"use client";

import { useEffect, useState } from "react";
import { getDocument, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadFileWithPath } from "@/lib/firestore";
import toast from "react-hot-toast";
import type { SiteSettings } from "@/types";

const DEFAULT_SETTINGS: SiteSettings = {
  id: "site",
  storeName: "Mazhar Jewellers",
  contactNumber: "",
  email: "",
  address: "",
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
  footerDescription: "Premium quality crystal jewellery with exquisite craftsmanship.",
  footerEmail: "",
  footerPhone: "",
  footerAddress: "",
  socialLinks: [],
  updatedAt: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocument("settings", "site");
      if (snap) setSettings({ ...DEFAULT_SETTINGS, ...(snap as unknown as SiteSettings) });
      if ((snap as unknown as SiteSettings)?.logoUrl) setLogoPreview((snap as unknown as SiteSettings).logoUrl);
      setLoading(false);
    };
    load();
  }, []);

  const update = (key: keyof SiteSettings, value: unknown) => setSettings((prev) => ({ ...prev, [key]: value }));

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
  };

  const updateMarquee = (index: number, value: string) => {
    const items = [...settings.marqueeItems]; items[index] = value; update("marqueeItems", items);
  };

  const addMarquee = () => update("marqueeItems", [...settings.marqueeItems, ""]);
  const removeMarquee = (index: number) => update("marqueeItems", settings.marqueeItems.filter((_, i) => i !== index));

  const updateTrust = (index: number, key: keyof typeof settings.trustBar[0], value: string) => {
    const items = [...settings.trustBar]; items[index] = { ...items[index], [key]: value }; update("trustBar", items);
  };

  const addSocial = () => update("socialLinks", [...settings.socialLinks, { platform: "", url: "", icon: "" }]);
  const updateSocial = (index: number, key: keyof typeof settings.socialLinks[0], value: string) => {
    const items = [...settings.socialLinks]; items[index] = { ...items[index], [key]: value }; update("socialLinks", items);
  };
  const removeSocial = (index: number) => update("socialLinks", settings.socialLinks.filter((_, i) => i !== index));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let logoUrl = settings.logoUrl;
      if (logoFile) {
        const result = await uploadFileWithPath(`settings/logo_${Date.now()}_${logoFile.name}`, logoFile);
        logoUrl = result.url;
      }
      await setDoc(doc(db, "settings", "site"), { ...settings, logoUrl, updatedAt: new Date().toISOString() }, { merge: true });
      toast.success("Settings saved!");
    } catch { toast.error("Failed to save settings"); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500 mt-1">Manage global site settings.</p></div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Store Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input type="text" value={settings.storeName} onChange={(e) => update("storeName", e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input type="text" value={settings.contactNumber} onChange={(e) => update("contactNumber", e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={settings.email} onChange={(e) => update("email", e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={settings.address} onChange={(e) => update("address", e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Choose Image
                <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
              </label>
              {logoPreview && <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#f5f0ea]"><img src={logoPreview} alt="" className="w-full h-full object-contain" /></div>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Announcement Bar</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
              <input type="text" value={settings.announcementBar} onChange={(e) => update("announcementBar", e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Highlight</label>
              <input type="text" value={settings.announcementHighlight} onChange={(e) => update("announcementHighlight", e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Marquee Items</h3>
            <button type="button" onClick={addMarquee} className="text-sm text-gold font-medium hover:underline">+ Add</button>
          </div>
          {settings.marqueeItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={item} onChange={(e) => updateMarquee(i, e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
              <button type="button" onClick={() => removeMarquee(i)} className="px-2 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg">✕</button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Trust Bar</h3>
          {settings.trustBar.map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                <input type="text" value={item.icon} onChange={(e) => updateTrust(i, "icon", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                <input type="text" value={item.label} onChange={(e) => updateTrust(i, "label", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
                <input type="text" value={item.sub} onChange={(e) => updateTrust(i, "sub", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Newsletter Section</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={settings.newsletterTitle} onChange={(e) => update("newsletterTitle", e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea value={settings.newsletterSubtitle} onChange={(e) => update("newsletterSubtitle", e.target.value)} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Footer</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={settings.footerDescription} onChange={(e) => update("footerDescription", e.target.value)} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="text" value={settings.footerEmail} onChange={(e) => update("footerEmail", e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" value={settings.footerPhone} onChange={(e) => update("footerPhone", e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={settings.footerAddress} onChange={(e) => update("footerAddress", e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Social Links</h3>
            <button type="button" onClick={addSocial} className="text-sm text-gold font-medium hover:underline">+ Add</button>
          </div>
          {settings.socialLinks.map((link, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Platform</label>
                <input type="text" value={link.platform} onChange={(e) => updateSocial(i, "platform", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Facebook" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                <input type="text" value={link.url} onChange={(e) => updateSocial(i, "url", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="flex items-end gap-1">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                  <input type="text" value={link.icon} onChange={(e) => updateSocial(i, "icon", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <button type="button" onClick={() => removeSocial(i)} className="px-2 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg mb-0.5">✕</button>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gold-light disabled:opacity-50">
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
}
