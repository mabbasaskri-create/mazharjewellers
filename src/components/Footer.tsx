import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "CUSTOMER CARE",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "Shipping & Delivery", href: "#" },
      { label: "Returns & Exchanges", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Track Order", href: "#" },
    ],
  },
  {
    title: "QUICK LINKS",
    links: [
      { label: "Necklaces", href: "/necklaces" },
      { label: "Earrings", href: "/earrings" },
      { label: "Rings", href: "/rings" },
      { label: "Bracelets", href: "/bracelets" },
      { label: "Gemstones", href: "/gemstones" },
    ],
  },
  {
    title: "ABOUT",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Craftsmanship", href: "#" },
      { label: "Authenticity", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#080808] text-white/45 px-6 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="font-serif text-[22px] font-semibold tracking-[3px] text-white mb-3 block">
              MAZHAR <em className="text-gold not-italic">JEWELLERS</em>
            </Link>
            <p className="text-[11px] leading-relaxed text-white/35 font-light mb-5">
              Premium quality crystal jewellery with exquisite craftsmanship. Every piece tells a story of elegance and beauty.
            </p>
            <div className="flex gap-2.5">
              {["📘", "📷", "🐦", "🎵"].map((icon, i) => (
                <span
                  key={i}
                  className="w-[34px] h-[34px] border border-white/12 flex items-center justify-center text-xs cursor-pointer transition-colors text-white/40 hover:border-gold hover:text-gold"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] tracking-[3px] uppercase text-white mb-4 font-normal">
                {col.title}
              </h4>
              <ul className="list-none">
                {col.links.map((l) => (
                  <li key={l.label} className="mb-2">
                    <Link
                      href={l.href}
                      className="text-[11px] text-white/35 transition-colors font-light hover:text-gold-light"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/7 pt-7 flex flex-wrap justify-between items-center gap-4">
          <p className="text-[10px] text-white/25">
            © {new Date().getFullYear()} Mazhar Jewellers. All rights reserved.
          </p>
          <div className="flex gap-1.5 items-center flex-wrap">
            {["VISA", "Mastercard", "PayPak", "COD", "HBL", "Meezan"].map(
              (p) => (
                <span
                  key={p}
                  className="bg-white/7 px-2 py-1 text-[9px] tracking-[1.5px] rounded text-white/35"
                >
                  {p}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
