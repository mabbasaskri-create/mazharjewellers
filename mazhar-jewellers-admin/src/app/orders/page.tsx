"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOrdersByEmail } from "@/lib/firestore";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.email) {
      getOrdersByEmail(user.email)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    } else if (!loading) {
      setLoadingOrders(false);
    }
  }, [user, loading]);

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const statusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-50 text-green-700";
      case "shipped": return "bg-blue-50 text-blue-700";
      case "confirmed": return "bg-purple-50 text-purple-700";
      case "pending": return "bg-yellow-50 text-yellow-700";
      case "cancelled": return "bg-red-50 text-red-700";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1000px] mx-auto px-6 py-12">
        <h1 className="font-serif text-[clamp(28px,3vw,36px)] font-light mb-2">My Orders</h1>
        <p className="text-sm text-gray-500 mb-8">
          {orders.length === 0
            ? "You haven't placed any orders yet."
            : `${orders.length} order${orders.length !== 1 ? "s" : ""} found`
          }
        </p>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500 mb-6">No orders to show</p>
            <Link href="/" className="btn-gold inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Order #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">{formatPrice(order.total)}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-4">
                  <div className="space-y-3">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.image && (
                          <div className="w-12 h-12 rounded-lg bg-[#f5f0ea] overflow-hidden shrink-0">
                            <img src={item.image} alt="" className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm text-gray-700">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-3 mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {order.customer?.name} · {order.customer?.phone}
                  </p>
                  <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
