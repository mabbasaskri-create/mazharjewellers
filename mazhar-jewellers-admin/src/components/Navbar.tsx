"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "NECKLACES", href: "/necklaces" },
  { label: "EARRINGS", href: "/earrings" },
  { label: "RINGS", href: "/rings" },
  { label: "BRACELETS", href: "/bracelets" },
  { label: "GEMSTONES", href: "/gemstones" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();

  return (
    <>
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="font-serif text-[26px] font-semibold tracking-[3px] whitespace-nowrap">
            MAZHAR <em className="text-gold not-italic">JEWELLERS</em>
          </Link>

          <ul className="hidden lg:flex gap-5 list-none">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[11px] tracking-[2px] text-mid uppercase transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 items-center">
            <button
              onClick={async () => {
                if (user) {
                  if (isAdmin) {
                    window.location.href = "/admin/dashboard";
                  }
                } else {
                  const res = await signInWithGoogle();
                  if (res.success) {
                    window.location.href = "/admin/dashboard";
                  }
                }
              }}
              className="nav-icon-btn text-xl text-mid transition-colors hover:text-gold bg-none border-none cursor-pointer p-1 leading-none"
              aria-label="Account"
            >
              👤
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hidden max-lg:flex flex-col gap-[5px] cursor-pointer p-1 bg-none border-none"
              aria-label="Menu"
            >
              <span className="block w-[22px] h-[1.5px] bg-black transition-all" />
              <span className="block w-[22px] h-[1.5px] bg-black transition-all" />
              <span className="block w-[22px] h-[1.5px] bg-black transition-all" />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col gap-0 px-8 pt-20 pb-8">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 bg-none border-none text-[28px] cursor-pointer text-black"
          >
            ✕
          </button>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-serif text-black py-4 border-b border-border block"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
