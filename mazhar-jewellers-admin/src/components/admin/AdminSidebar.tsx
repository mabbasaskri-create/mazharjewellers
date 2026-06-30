"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { label: "Products", href: "/admin/products", icon: "💎" },
  { label: "Collections", href: "/admin/collections", icon: "📁" },
  { label: "Categories", href: "/admin/categories", icon: "🏷️" },
  { label: "Orders", href: "/admin/orders", icon: "📦" },
  { label: "Reviews", href: "/admin/reviews", icon: "⭐" },
  { label: "Hero Banner", href: "/admin/banner", icon: "🖼️" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-100">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <span className="text-2xl">💍</span>
              <div>
                <p className="font-serif text-lg font-semibold text-black leading-tight">Mazhar</p>
                <p className="text-[10px] tracking-[2px] text-gold uppercase">Admin Panel</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    active ? "bg-gold/10 text-gold font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-gray-100">
            <button onClick={async () => { await logout(); window.location.href = "/admin/login"; }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
            ><span>🚪</span>Logout</button>
            <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors mt-1">
              <span>←</span>Back to Site
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
