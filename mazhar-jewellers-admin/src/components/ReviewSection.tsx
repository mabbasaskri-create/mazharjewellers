import HorizontalScroll from "./HorizontalScroll";
import type { Review } from "@/types";

interface Props {
  reviews: Review[];
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "r1", author: "SANA M.", city: "LAHORE",
    text: "Bought a necklace set for my wedding — it looked exactly like the photo. Quality and packaging were outstanding. Thank you Mazhar Jewellers!",
    stars: 5, order: 1, status: "active", slug: "review-1",
    createdAt: "", updatedAt: "", createdBy: "",
  },
  {
    id: "r2", author: "AYESHA K.", city: "KARACHI",
    text: "Gifted earrings to my sister for Eid — she loved them! The packaging was so beautiful we didn't even need gift wrap!",
    stars: 5, order: 2, status: "active", slug: "review-2",
    createdAt: "", updatedAt: "", createdBy: "",
  },
  {
    id: "r3", author: "HASSAN R.", city: "ISLAMABAD",
    text: "Got a crystal set — feels no different from imported brands. Great price and excellent quality. Next day delivery in Islamabad!",
    stars: 5, order: 3, status: "active", slug: "review-3",
    createdAt: "", updatedAt: "", createdBy: "",
  },
];

export default function ReviewSection({ reviews }: Props) {
  const items = reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

  return (
    <div className="bg-gold-pale">
      <div className="section-container">
        <div className="section-header">
          <p className="eyebrow">✦ Customer Reviews</p>
          <h2 className="sec-title">Hamare Khush Customers</h2>
          <p className="sec-sub">50,000+ happy customers across Pakistan</p>
        </div>

        <HorizontalScroll>
          {items.map((r) => (
            <div
              key={r.id}
              className="testi-card h-scroll-item border border-border p-7 bg-white rounded-2xl shadow-sm"
            >
              <div className="text-gold text-[13px] tracking-[3px] mb-3">
                {"★".repeat(r.stars)}
              </div>
              <p className="font-serif text-[16px] italic leading-relaxed text-mid mb-5">
                &ldquo;{r.text}&rdquo;
              </p>
              <p className="text-[10px] tracking-[2px] text-muted uppercase">
                — {r.author} <span className="text-gold">{r.city}</span>
              </p>
            </div>
          ))}
        </HorizontalScroll>
      </div>
    </div>
  );
}
