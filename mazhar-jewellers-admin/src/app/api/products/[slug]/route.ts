import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { getProductsByCollection } = await import("@/lib/firestore");

  try {
    const products = await getProductsByCollection(slug);
    return Response.json(products);
  } catch (error) {
    console.error(`API /products/${slug} error:`, error);
    return Response.json([], { status: 200 });
  }
}
