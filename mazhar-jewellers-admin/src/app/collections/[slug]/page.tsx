import CollectionTemplate from "@/components/CollectionTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  return <CollectionTemplate slug={slug} />;
}
