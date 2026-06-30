import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { getActiveHeroBanner, getActiveCollections, getFeaturedProducts, getActiveReviews, getSiteSettings, getActiveCategories } = await import("@/lib/firestore");

  try {
    const [banner, collections, featuredProducts, reviews, settings, categories] =
      await Promise.all([
        getActiveHeroBanner(),
        getActiveCollections(),
        getFeaturedProducts(),
        getActiveReviews(),
        getSiteSettings(),
        getActiveCategories(),
      ]);

    return Response.json({
      banner,
      collections: collections || [],
      featuredProducts: featuredProducts || [],
      reviews: reviews || [],
      settings,
      categories: categories || [],
    });
  } catch (error) {
    console.error("API /data error:", error);
    return Response.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
