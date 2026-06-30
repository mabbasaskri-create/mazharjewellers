"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/firestore";

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  totalCollections: number;
  totalReviews: number;
  recentOrders: unknown[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      sub: `${stats?.activeProducts ?? 0} active`,
      icon: "💎",
      color: "bg-blue-50 text-blue-600",
      href: "/admin/products",
    },
    {
      label: "Collections",
      value: stats?.totalCollections ?? 0,
      sub: "Manage collections",
      icon: "📁",
      color: "bg-purple-50 text-purple-600",
      href: "/admin/collections",
    },
    {
      label: "Reviews",
      value: stats?.totalReviews ?? 0,
      sub: "Customer testimonials",
      icon: "⭐",
      color: "bg-yellow-50 text-yellow-600",
      href: "/admin/reviews",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      sub: `${stats?.pendingOrders ?? 0} pending`,
      icon: "📦",
      color: "bg-green-50 text-green-600",
      href: "#",
    },
    {
      label: "Revenue",
      value: `PKR ${(stats?.revenue ?? 0).toLocaleString()}`,
      sub: "Lifetime revenue",
      icon: "💰",
      color: "bg-emerald-50 text-emerald-600",
      href: "#",
    },
  ];

  const quickActions = [
    { label: "Add New Product", href: "/admin/products/new", icon: "➕" },
    { label: "Manage Collections", href: "/admin/collections", icon: "📁" },
    { label: "Edit Hero Banner", href: "/admin/banner", icon: "🖼️" },
    { label: "Manage Reviews", href: "/admin/reviews", icon: "⭐" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome to your admin panel. Manage your store from here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center text-lg mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-100 hover:border-gold/30 hover:bg-gold/5 transition-colors"
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <span className="text-xs text-gray-400">Coming soon</span>
        </div>
        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="text-sm text-gray-500">
            {stats.recentOrders.length} recent orders found.
          </div>
        ) : (
          <div className="text-sm text-gray-400 py-8 text-center">
            No orders yet. Orders will appear here once customers start purchasing.
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-xl border border-gold/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Latest Uploads
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Recently added products and updates
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-sm text-gold font-medium hover:underline"
          >
            View all products →
          </Link>
        </div>
      </div>
    </div>
  );
}
