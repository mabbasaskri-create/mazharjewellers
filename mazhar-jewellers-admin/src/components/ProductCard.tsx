import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: Product;
  showAdd?: boolean;
}

const BADGE_STYLES: Record<string, string> = {
  best: "bg-gold text-white",
  new: "bg-black text-white",
  sale: "bg-red text-white",
  gift: "bg-gold text-white",
};

export default function ProductCard({ product, showAdd = true }: Props) {
  const badgeClass = BADGE_STYLES[product.badge || ""] || "bg-black text-white";

  return (
    <Link href={`/products/${product.slug}`} className="prod-card block cursor-pointer group">
      <div className="prod-img relative aspect-[3/4] overflow-hidden bg-[#f5f0ea] mb-3">
        {product.badge && product.badgeText && (
          <span className={`prod-badge absolute top-2.5 left-2.5 text-[9px] tracking-[2px] px-2 py-1 uppercase z-10 ${badgeClass}`}>
            {product.badgeText}
          </span>
        )}
        <button
          className="prod-wish absolute top-2.5 right-2.5 bg-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[15px] cursor-pointer border-none z-10"
          onClick={(e) => e.preventDefault()}
        >
          ♡
        </button>
        <img
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-contain bg-[#f5f0ea] transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            if (!t.dataset.fallback) {
              t.dataset.fallback = "1";
              t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' fill='%23f5f0ea'%3E%3Crect width='400' height='500'/%3E%3Ctext x='200' y='250' text-anchor='middle' fill='%23b8965a' font-size='24'%3E💎%3C/text%3E%3C/svg%3E";
              t.className = "w-full h-full object-contain bg-[#f5f0ea]";
            }
          }}
        />
        {showAdd && (
          <button
            className="prod-add absolute bottom-0 left-0 right-0 bg-black text-white text-center py-2.5 text-[9px] tracking-[2.5px] uppercase translate-y-full group-hover:translate-y-0 transition-transform cursor-pointer border-none font-sans w-full"
            onClick={(e) => e.preventDefault()}
          >
            ADD TO CART
          </button>
        )}
      </div>
      <p className="prod-coll text-[10px] text-muted tracking-[1.5px] uppercase mb-1">
        {product.collectionName}
      </p>
      <p className="prod-name font-serif text-[15px] font-normal text-black mb-1 leading-tight">
        {product.name}
      </p>
      <div className="prod-price flex items-center gap-2 flex-wrap">
        <span className="p-now text-[14px] font-medium text-black">
          {formatPrice(product.price)}
        </span>
        {product.oldPrice && (
          <>
            <span className="p-old text-[12px] text-muted line-through">
              {formatPrice(product.oldPrice)}
            </span>
            <span className="p-off text-[10px] text-red">
              {product.discount}% OFF
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
