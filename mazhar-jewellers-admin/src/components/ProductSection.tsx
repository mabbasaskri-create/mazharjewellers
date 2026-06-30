import ProductCard from "./ProductCard";
import HorizontalScroll from "./HorizontalScroll";
import type { Product } from "@/types";

interface Props {
  products: Product[];
  title: string;
  subtitle?: string;
  eyebrow?: string;
  viewAllLink?: string;
}

export default function ProductSection({
  products,
  title,
  subtitle,
  eyebrow,
}: Props) {
  return (
    <div className="bg-white">
      <div className="section-container">
        <div className="section-header">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="sec-title">{title}</h2>
          {subtitle && <p className="sec-sub">{subtitle}</p>}
        </div>

        <HorizontalScroll>
          {products.map((p) => (
            <div key={p.id} className="h-scroll-item">
              <ProductCard product={p} />
            </div>
          ))}
        </HorizontalScroll>

        <div className="text-center mt-10">
          <button className="btn-gold !bg-black">VIEW ALL PRODUCTS</button>
        </div>
      </div>
    </div>
  );
}
