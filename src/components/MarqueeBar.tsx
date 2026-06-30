interface Props {
  items?: string[];
}

const DEFAULT_ITEMS = [
  "FREE DELIVERY ACROSS PAKISTAN",
  "EASY INSTALLMENTS ON HBL & MEEZAN",
  "COD AVAILABLE",
  "30-DAY RETURN POLICY",
  "AUTHENTICITY GUARANTEE",
  "LAHORE · KARACHI · ISLAMABAD · PESHAWAR",
];

export default function MarqueeBar({ items }: Props) {
  const marqueeItems = items && items.length > 0 ? items : DEFAULT_ITEMS;

  const track = (
    <>
      {marqueeItems.map((item, i) => (
        <span key={i} className="text-[11px] tracking-[2.5px] text-mid uppercase shrink-0">
          {item}
        </span>
      ))}
      <span className="dot text-gold text-[8px]">✦</span>
    </>
  );

  return (
    <div className="bg-gold-pale border-t border-border border-b border-border overflow-hidden py-3">
      <div className="flex gap-12 whitespace-nowrap" style={{ animation: "marquee 25s linear infinite" }}>
        {track}
        {track}
      </div>
    </div>
  );
}
