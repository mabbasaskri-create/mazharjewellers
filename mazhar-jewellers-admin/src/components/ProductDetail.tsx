"use client";

import { useEffect, useState } from "react";
import type { ProductWithNames } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  slug: string;
}

export default function ProductDetail({ slug }: Props) {
  const [product, setProduct] = useState<ProductWithNames | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_URL || "";
        const res = await fetch(`${base}/api/product/${slug}`);
        if (!res.ok) { setError(true); return; }
        const data = await res.json();
        setProduct(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">💎</p>
        <p className="text-gray-500">Product not found</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#f5f0ea]">
            <img
              src={product.images[selectedImage] || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-contain bg-[#f5f0ea]"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' fill='%23f5f0ea'%3E%3Crect width='400' height='500'/%3E%3Ctext x='200' y='250' text-anchor='middle' fill='%23b8965a' font-size='24'%3E💎%3C/text%3E%3C/svg%3E"; }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden bg-[#f5f0ea] shrink-0 border-2 transition-colors ${selectedImage === i ? "border-gold" : "border-transparent"}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain bg-[#f5f0ea]"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='%23f5f0ea'%3E%3Crect width='80' height='80'/%3E%3Ctext x='40' y='45' text-anchor='middle' fill='%23b8965a' font-size='16'%3E💎%3C/text%3E%3C/svg%3E"; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 md:pt-8">
          <p className="text-[10px] tracking-[3px] text-gold uppercase mb-2">{product.collectionName}</p>
          <h1 className="font-serif text-[clamp(28px,3.5vw,42px)] font-light leading-tight mb-4">{product.name}</h1>

          {product.shortDescription && (
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.shortDescription}</p>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-medium text-black">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-muted line-through">{formatPrice(product.oldPrice)}</span>
                <span className="text-xs text-red font-medium">{product.discount}% OFF</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              product.stockStatus === "available" ? "bg-green-50 text-green-700" :
              product.stockStatus === "low_stock" ? "bg-yellow-50 text-yellow-700" :
              "bg-red-50 text-red-700"
            }`}>
              {product.stockStatus === "available" ? "In Stock" :
               product.stockStatus === "low_stock" ? `Only ${product.stockQuantity} left` :
               "Out of Stock"}
            </span>
            {product.featured && <span className="text-xs text-yellow-600">★ Featured</span>}
          </div>

          {product.fullDescription && (
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium text-black mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.fullDescription}</p>
            </div>
          )}

          <div className="mt-8">
            <button className="btn-gold w-full md:w-auto">ADD TO CART</button>
          </div>
        </div>
      </div>
    </div>
  );
}
