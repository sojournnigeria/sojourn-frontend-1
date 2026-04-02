import { Metadata } from "next";

interface Props {
  params: { propertyId: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(
      `https://sojourn-backend-gczm.onrender.com/api/v1/properties/${params.propertyId}/seo`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Failed to fetch SEO data");

    const seo = await res.json();

    return {
      title: seo.title,
      description: seo.description,
      alternates: { canonical: seo.canonical },
      openGraph: {
        title: seo.openGraph.title,
        description: seo.openGraph.description,
        url: seo.openGraph.url,
        siteName: seo.openGraph.siteName,
        images: seo.openGraph.images,
        locale: seo.openGraph.locale,
        type: "website",
      },
      other: {
        "script:ld+json": JSON.stringify(seo.jsonLd),
      },
    };
  } catch {
    return {
      title: "Shortlet in Nigeria | Sojourn",
      description: "Book unique shortlet apartments across Nigeria on Sojourn.",
    };
  }
}

export default function PropertyLayout({ children }: Props) {
  return <>{children}</>;
}
