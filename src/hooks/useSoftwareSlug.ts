import { useParams } from "next/navigation";

/**
 * Returns the software slug from the dynamic route parameter (/software/:slug/...).
 * For Next.js App Router.
 */
export function useSoftwareSlug() {
  const params = useParams();
  const slug = (params?.slug ?? params?.software) as string | undefined;
  const basePath = slug ? `/software/${slug}` : "";
  return { slug, basePath, isNew: true };
}
