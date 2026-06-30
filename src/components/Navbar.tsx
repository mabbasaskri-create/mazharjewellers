"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const handlePersonClick = () => {
    if (user) {
      if (isAdmin) {
        window.location.href = "/admin/dashboard";
      } else {
        setUserMenuOpen(!userMenuOpen);
      }
    } else {
      setUserMenuOpen(!userMenuOpen);
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

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

          <div className="flex gap-4 items-center relative">
            <button
              onClick={handlePersonClick}
              className="nav-icon-btn text-xl text-mid transition-colors hover:text-gold bg-none border-none cursor-pointer p-1 leading-none relative"
              aria-label="Account"
            >
              👤
            </button>

            {userMenuOpen && (
              <div ref={userMenuRef} className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                {user && !isAdmin ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/my-account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      👤 My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </>
                ) : (!user ? (
                  <button
                    onClick={() => { setUserMenuOpen(false); signInWithGoogle(); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                  >
                    🔑 Sign In with Google
                  </button>
                ) : null)}
              </div>
            )}

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
          {user && !isAdmin && (
            <>
              <Link
                href="/my-account"
                onClick={() => setMenuOpen(false)}
                className="text-xl font-serif text-black py-4 border-b border-border block"
              >
                👤 My Account
              </Link>
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="text-xl font-serif text-red-500 py-4 text-left border-b border-border block"
              >
                🚪 Sign Out
              </button>
            </>
          )}
          {!user && (
            <button
              onClick={() => {
                setMenuOpen(false);
                signInWithGoogle();
              }}
              className="text-xl font-serif text-gold py-4 text-left border-b border-border block w-full"
            >
              🔑 Sign In
            </button>
          )}
        </div>
      )}
    </>
  );
}
