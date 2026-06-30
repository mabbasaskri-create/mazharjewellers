import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { getProductBySlug } = await import("@/lib/firestore");

  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      return Response.json(null, { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    console.error(`API /product/${slug} error:`, error);
    return Response.json(null, { status: 500 });
  }
}
