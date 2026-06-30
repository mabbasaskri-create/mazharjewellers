import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { getCollectionBySlug } = await import("@/lib/firestore");

  try {
    const collection = await getCollectionBySlug(slug);
    if (!collection) {
      return Response.json(null, { status: 404 });
    }
    return Response.json(collection);
  } catch (error) {
    console.error(`API /collection/${slug} error:`, error);
    return Response.json(null, { status: 500 });
  }
}
