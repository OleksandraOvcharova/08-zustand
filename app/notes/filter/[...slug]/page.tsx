import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: NotesProps) {
  const { slug } = await params;
  const tag = slug?.[0] ?? "All";
  const title = `${tag} Notes | NoteHub`;
  const description =
    tag === "All"
      ? "Browse all saved notes."
      : `Browse notes tagged with "${tag}"`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const imageUrl = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/notes/filter/${tag}`,
      siteName: "NoteHub",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const queryClient = new QueryClient();

  const { slug } = await params;
  const tag = slug[0] === "All" ? undefined : slug[0];

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes("", 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
