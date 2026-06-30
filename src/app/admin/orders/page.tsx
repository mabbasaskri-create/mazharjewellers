"use client";

import { useEffect, useState, useCallback } from "react";
import { getOrders, updateOrderStatus, deleteDocument, searchOrders } from "@/lib/firestore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Order } from "@/types";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await searchOrders({
        search: search || undefined,
        statusFilter,
      });
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as Order["status"]);
      toast.success(`Order ${newStatus}`);
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (order: Order) => {
    if (!confirm(`Delete order #${order.id.slice(0, 8)}? This cannot be undone.`)) return;
    try {
      await deleteDocument("orders", order.id);
      toast.success("Order deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-50 text-green-700 ring-green-600/20";
      case "shipped": return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case "confirmed": return "bg-purple-50 text-purple-700 ring-purple-600/20";
      case "pending": return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
      case "cancelled": return "bg-red-50 text-red-700 ring-red-600/20";
      default: return "bg-gray-50 text-gray-600 ring-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 && "s"}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, order ID..."
            className="flex-1 min-w-[250px] px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button onClick={load} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">Refresh</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No orders found</p>
            <p className="text-sm">Try different search or filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map((order) => (
              <div key={order.id}>
                <button
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  className="w-full text-left px-4 md:px-6 py-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="shrink-0">
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</p>
                      <p className="text-[10px] text-gray-300">#{order.id.slice(0, 6)}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{order.customer?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-400 truncate">{order.customer?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </button>

                {expandedId === order.id && (
                  <div className="px-4 md:px-6 pb-6 pt-2 border-t border-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Customer</h4>
                        <p className="text-sm text-gray-900">{order.customer?.name}</p>
                        <p className="text-sm text-gray-500">{order.customer?.email}</p>
                        <p className="text-sm text-gray-500">{order.customer?.phone}</p>
                        <p className="text-sm text-gray-500">{order.customer?.address}, {order.customer?.city}, {order.customer?.province}</p>
                      </div>
                      <div className="text-right">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Payment</h4>
                        <p className="text-sm text-gray-900">{order.paymentMethod}</p>
                        <p className="text-sm text-gray-500">Subtotal: {formatPrice(order.subtotal)}</p>
                        {order.shipping > 0 && <p className="text-sm text-gray-500">Shipping: {formatPrice(order.shipping)}</p>}
                        {order.discount > 0 && <p className="text-sm text-green-600">Discount: -{formatPrice(order.discount)}</p>}
                        <p className="text-sm font-medium text-gray-900 mt-1">Total: {formatPrice(order.total)}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          order.paymentStatus === "paid" ? "bg-green-50 text-green-700" :
                          order.paymentStatus === "failed" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                        }`}>
                          {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-50 pt-4 mb-4">
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Items</h4>
                      <div className="space-y-3">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {item.image && (
                              <div className="w-12 h-12 rounded-lg bg-[#f5f0ea] overflow-hidden shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-contain" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 truncate">{item.productName}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                            <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-50 pt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Update Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gold/20"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleDelete(order)}
                        className="px-3 py-1.5 text-xs rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
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
