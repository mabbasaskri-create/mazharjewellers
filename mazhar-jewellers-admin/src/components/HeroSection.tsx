"use client";

import { useState, useEffect } from "react";
import type { HeroBanner } from "@/types";

interface Props {
  banner: HeroBanner | null;
}

const FALLBACK_DESKTOP = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80";
const FALLBACK_MOBILE = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80";

export default function HeroSection({ banner }: Props) {
  const title = banner?.title || "Sparkle &<br>Beauty";
  const subtitle = banner?.subtitle || "Premium quality jewellery with exquisite craftsmanship and beautiful design.";
  const eyebrow = banner?.eyebrow || "✦ &nbsp; New Collection 2025 &nbsp; ✦";
  const ctaText = banner?.ctaText || "SHOP NOW";
  const ctaLink = banner?.ctaLink || "#";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const desktopImage = banner?.desktopImage || banner?.image || FALLBACK_DESKTOP;
  const mobileImage = banner?.mobileImage || banner?.desktopImage || banner?.image || FALLBACK_MOBILE;
  const activeImage = isMobile ? mobileImage : desktopImage;

  return (
    <div className="hero h-screen min-h-[500px] relative overflow-hidden flex items-end">
      <div className="absolute inset-0 bg-black">
        <picture>
          <source media="(max-width: 767px)" srcSet={mobileImage} />
          <source media="(min-width: 768px)" srcSet={desktopImage} />
          <img
            src={activeImage}
            alt="Hero"
            className="w-full h-full object-cover object-center opacity-70"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              if (!t.dataset.fallback) {
                t.dataset.fallback = "1";
                t.src = FALLBACK_DESKTOP;
              }
            }}
          />
        </picture>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
      <div className="relative z-10 text-white px-8 pb-16 pt-12 max-w-[1400px] mx-auto w-full">
        <p className="text-[10px] tracking-[5px] text-gold uppercase mb-4">
          {eyebrow}
        </p>
        <h1
          className="font-serif text-[clamp(44px,8vw,96px)] font-light leading-none tracking-[-1px] mb-4"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-[13px] text-white/65 tracking-[0.5px] leading-relaxed mb-8 font-light max-w-[480px]">
          {subtitle}
        </p>
        <div className="flex gap-3 flex-wrap">
          <a href={ctaLink} className="btn-gold inline-block">{ctaText}</a>
          <a href="/collections" className="btn-ghost inline-block">VIEW COLLECTIONS</a>
        </div>
      </div>
    </div>
  );
}
