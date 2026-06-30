import type { TrustItem } from "@/types";

interface Props {
  items?: TrustItem[];
}

const DEFAULT_ITEMS: TrustItem[] = [
  { icon: "🚚", label: "Free Delivery", sub: "Free on orders PKR 5,000+\nacross Pakistan" },
  { icon: "💳", label: "Easy Installments", sub: "HBL, Meezan, JazzCash\n3–12 months" },
  { icon: "🔄", label: "30-Day Returns", sub: "Easy returns & exchanges\nhassle-free" },
  { icon: "✅", label: "100% Authentic", sub: "Genuine crystals &\nquality assured" },
];

export default function TrustBar({ items }: Props) {
  const trustItems = items && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <div className="bg-gold-pale border-t border-border border-b border-border">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4">
        {trustItems.map((item, i) => (
          <div
            key={i}
            className="text-center px-4 py-7 border-r border-border last:border-r-0"
          >
            <div className="text-[26px] mb-2">{item.icon}</div>
            <p className="text-[11px] font-medium tracking-[1.5px] uppercase mb-1">
              {item.label}
            </p>
            <p className="text-[11px] text-muted leading-relaxed whitespace-pre-line">
              {item.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
