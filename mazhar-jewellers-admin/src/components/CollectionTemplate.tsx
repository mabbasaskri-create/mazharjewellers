"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import type { Collection, Product } from "@/types";

interface Props {
  slug: string;
}

export default function CollectionTemplate({ slug }: Props) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_URL || "";
        const [colRes, prodRes] = await Promise.all([
          fetch(`${base}/api/collection/${slug}`),
          fetch(`${base}/api/products/${slug}`),
        ]);
        if (colRes.ok) {
          const colData = await colRes.json();
          setCollection(colData);
        }
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  const displayName = collection?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
  const displayDesc = collection?.description || `Explore our ${displayName.toLowerCase()} collection.`;

  return (
    <div className="min-h-screen">
      <div className="relative h-[40vh] min-h-[300px] bg-black overflow-hidden">
        {collection?.image ? (
          <img src={collection.image} alt={displayName} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gold/20 to-black/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-[1400px] mx-auto">
          <p className="text-[10px] tracking-[4px] text-gold uppercase mb-3">Collection</p>
          <h1 className="font-serif text-[clamp(36px,6vw,72px)] font-light text-white leading-tight mb-3">{displayName}</h1>
          {collection?.description && (
            <p className="text-sm text-white/70 max-w-[600px]">{collection.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">💎</p>
            <p className="text-gray-400">No products in this collection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
