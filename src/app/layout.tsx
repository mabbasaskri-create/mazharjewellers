import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Mazhar Jewellers | Premium Crystal Jewellery",
  description:
    "Premium quality crystal jewellery with exquisite craftsmanship. Discover necklaces, earrings, rings, bracelets, and gemstones.",
  keywords: [
    "jewellery",
    "crystal jewellery",
    "Pakistan jewellery",
    "Mazhar Jewellers",
    "necklaces",
    "earrings",
    "rings",
    "bracelets",
    "gemstones",
  ],
  openGraph: {
    title: "Mazhar Jewellers | Premium Crystal Jewellery",
    description: "Premium quality crystal jewellery with exquisite craftsmanship.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontSize: "14px",
                borderRadius: "12px",
                padding: "12px 16px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
