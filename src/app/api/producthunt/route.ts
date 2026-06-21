import { NextRequest, NextResponse } from "next/server";
import { checkOrigin } from "@/lib/api-guard";

export async function POST(req: NextRequest) {
  try {
    const blocked = checkOrigin(req);
    if (blocked) return blocked;

    const { slug } = await req.json();

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Slug parameter required" }, { status: 400 });
    }

    const apiKey = process.env.PRODUCTHUNT_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Product Hunt API key not configured" }, { status: 500 });
    }

    // Try to fetch from Product Hunt API
    // Note: This uses the unofficial/public Product Hunt API
    const query = `
      query($slug: String!) {
        post(slug: $slug) {
          id
          name
          tagline
          votesCount
          rating
          description
          thumbnail {
            url
          }
          url
        }
      }
    `;

    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        variables: { slug },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Product Hunt API error:", data.errors);
      return NextResponse.json({ error: "Failed to fetch Product Hunt data" }, { status: 500 });
    }

    const post = data.data?.post;
    if (!post) {
      return NextResponse.json({ error: "Product not found on Product Hunt" }, { status: 404 });
    }

    return NextResponse.json({
      upvotes: post.votesCount || 0,
      rating: post.rating || 0,
      tagline: post.tagline || "",
      name: post.name,
      url: post.url,
      thumbnail: post.thumbnail?.url,
    });
  } catch (error) {
    console.error("Product Hunt route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
