import Link from "next/link";
import HorizontalScroll from "./HorizontalScroll";
import type { Collection } from "@/types";

interface Props {
  collections: Collection[];
}

export default function CollectionGrid({ collections }: Props) {
  if (collections.length === 0) return null;

  return (
    <div className="section-container !pt-8 !pb-4">
      <div className="section-header !mb-8">
        <p className="eyebrow">✦ Shop by Category</p>
        <h2 className="sec-title">Our Collections</h2>
        <p className="sec-sub">For every occasion, for every style</p>
      </div>

      <HorizontalScroll>
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/${col.slug}`}
            className="cat-card2 h-scroll-item relative overflow-hidden aspect-square cursor-pointer block rounded-xl overflow-hidden"
          >
            <img
              src={col.image}
              alt={col.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute bottom-0 left-0 right-0 p-3 text-white font-serif text-[15px] font-normal text-center">
              {col.name}
            </span>
            <span className="absolute top-2 right-2 bg-gold text-white text-[8px] tracking-[1px] px-1.5 py-0.5 rounded font-medium">
              {col.count}+
            </span>
          </Link>
        ))}
      </HorizontalScroll>
    </div>
  );
}
