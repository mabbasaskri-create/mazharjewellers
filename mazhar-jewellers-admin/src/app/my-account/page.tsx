"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOrdersByUserId } from "@/lib/firestore";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export default function MyAccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getOrdersByUserId(user.uid)
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
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-5">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "Profile"}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gold/30"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/10 flex items-center justify-center text-3xl text-gold">
                {user.displayName?.charAt(0) || "?"}
              </div>
            )}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-light text-gray-900">
                {user.displayName || "Customer"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold mt-2">
                Customer
              </span>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl font-light text-gray-900">Order History</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {orders.length === 0
                ? "No orders placed yet"
                : `${orders.length} order${orders.length !== 1 ? "s" : ""}`
              }
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link href="/" className="btn-gold inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow"
              >
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full text-left p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-300 mt-0.5">
                        Order #{(order.id || "").slice(0, 8)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium">{formatPrice(order.total)}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="border-t border-gray-50 px-6 pb-6 pt-4">
                    <div className="space-y-3 mb-4">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.image && (
                            <div className="w-14 h-14 rounded-lg bg-[#f5f0ea] overflow-hidden shrink-0">
                              <img src={item.image} alt="" className="w-full h-full object-contain" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-50 pt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
                        <p className="text-gray-700">{order.customer?.name}</p>
                        <p className="text-gray-500 text-xs">{order.customer?.address}, {order.customer?.city}, {order.customer?.province}</p>
                        <p className="text-gray-500 text-xs">{order.customer?.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Payment</p>
                        <p className="text-gray-700">{order.paymentMethod}</p>
                        <span className={`text-xs font-medium ${
                          order.paymentStatus === "paid" ? "text-green-600" : order.paymentStatus === "failed" ? "text-red-600" : "text-yellow-600"
                        }`}>
                          {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
