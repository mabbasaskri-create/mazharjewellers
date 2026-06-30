import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return Response.json([]);
  }

  const { searchProducts } = await import("@/lib/firestore");

  try {
    const products = await searchProducts(q.trim());
    return Response.json(products);
  } catch (error) {
    console.error("Search error:", error);
    return Response.json([], { status: 200 });
  }
}
