"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function HorizontalScroll({ children, className = "" }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const getGap = () => {
      const s = getComputedStyle(track).gap;
      return s.includes("rem") ? parseFloat(s) * 16 : s.includes("px") ? parseFloat(s) : 24;
    };

    const scrollBy = (dir: number) => {
      const item = track.querySelector(".h-scroll-item");
      if (!item) return;
      const amt = (item as HTMLElement).offsetWidth + getGap();
      track.scrollBy({ left: dir * amt, behavior: "smooth" });
    };

    const onDown = (e: MouseEvent) => {
      isDragging = true;
      track.classList.add("dragging");
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.2;
    };
    const onUp = () => {
      isDragging = false;
      track.classList.remove("dragging");
    };

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      startX = e.touches[0].pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.2;
    };
    const onTouchEnd = () => { isDragging = false; };

    track.addEventListener("mousedown", onDown);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: true });
    track.addEventListener("touchend", onTouchEnd);
    track.setAttribute("tabindex", "0");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { scrollBy(-1); e.preventDefault(); }
      if (e.key === "ArrowRight") { scrollBy(1); e.preventDefault(); }
    };
    track.addEventListener("keydown", onKey);

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        track.scrollLeft += e.deltaX;
      }
    };
    track.addEventListener("wheel", onWheel, { passive: false });

    // Update button states
    const updateBtns = () => {
      const prev = track.parentElement?.querySelector(".h-scroll-btn.prev") as HTMLButtonElement | null;
      const next = track.parentElement?.querySelector(".h-scroll-btn.next") as HTMLButtonElement | null;
      if (!prev || !next) return;
      const ms = track.scrollWidth - track.clientWidth;
      prev.classList.toggle("disabled", track.scrollLeft <= 5);
      next.classList.toggle("disabled", track.scrollLeft >= ms - 5);
    };
    track.addEventListener("scroll", updateBtns);

    // Prev/Next buttons
    const prevBtn = track.parentElement?.querySelector(".h-scroll-btn.prev");
    const nextBtn = track.parentElement?.querySelector(".h-scroll-btn.next");
    prevBtn?.addEventListener("click", () => scrollBy(-1));
    nextBtn?.addEventListener("click", () => scrollBy(1));

    return () => {
      track.removeEventListener("mousedown", onDown);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
      track.removeEventListener("keydown", onKey);
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("scroll", updateBtns);
      prevBtn?.removeEventListener("click", () => scrollBy(-1));
      nextBtn?.removeEventListener("click", () => scrollBy(1));
    };
  }, []);

  return (
    <div className={`h-scroll-wrap relative ${className}`}>
      <div ref={trackRef} className="h-scroll">
        {children}
      </div>
      <button className="h-scroll-btn prev" aria-label="Previous">‹</button>
      <button className="h-scroll-btn next" aria-label="Next">›</button>
    </div>
  );
}
