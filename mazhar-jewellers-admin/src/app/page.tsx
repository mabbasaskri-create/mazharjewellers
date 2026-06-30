import HeroSection from "@/components/HeroSection";
import MarqueeBar from "@/components/MarqueeBar";
import CollectionGrid from "@/components/CollectionGrid";
import ProductSection from "@/components/ProductSection";
import ReviewSection from "@/components/ReviewSection";
import TrustBar from "@/components/TrustBar";
import Newsletter from "@/components/Newsletter";
import SaleBanner from "@/components/SaleBanner";
import Lookbook from "@/components/Lookbook";

export default async function HomePage() {
  const fetchData = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${base}/api/data`, { next: { revalidate: 60 } });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  };

  const data = await fetchData();

  const banner = data?.banner || null;
  const collections = data?.collections || [];
  const featuredProducts = data?.featuredProducts || [];
  const reviews = data?.reviews || [];
  const settings = data?.settings || null;

  return (
    <>
      <HeroSection banner={banner} />
      <MarqueeBar items={settings?.marqueeItems} />
      <CollectionGrid collections={collections} />
      <ProductSection
        products={featuredProducts}
        title="Most Loved Jewellery"
        subtitle="The most loved pieces across Pakistan"
        eyebrow="✦ Best Sellers"
        viewAllLink="#"
      />
      <TrustBar items={settings?.trustBar} />
      <SaleBanner />
      <ReviewSection reviews={reviews} />
      <Lookbook />
      <Newsletter />
    </>
  );
}
