import { NextRequest, NextResponse } from "next/server";
import { checkOrigin } from "@/lib/api-guard";

export async function POST(req: NextRequest) {
  try {
    const blocked = checkOrigin(req);
    if (blocked) return blocked;

    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 });
    }

    // Reddit public JSON API - no authentication required
    const redditUrl = new URL("https://www.reddit.com/search.json");
    redditUrl.searchParams.append("q", query);
    redditUrl.searchParams.append("limit", "5");
    redditUrl.searchParams.append("sort", "top");

    const response = await fetch(redditUrl.toString(), {
      headers: {
        "User-Agent": "SoftwareOS (https://softwareos.dev)",
      },
    });

    if (!response.ok) {
      console.error("Reddit API error:", response.statusText);
      return NextResponse.json({ error: "Failed to fetch Reddit posts" }, { status: 500 });
    }

    const data = await response.json();
    const posts = (data.data?.children || [])
      .map((child: any) => {
        const post = child.data;
        return {
          title: post.title,
          subreddit: post.subreddit,
          upvotes: post.ups,
          comments: post.num_comments,
          url: `https://reddit.com${post.permalink}`,
          score: post.score,
          thumbnail: post.thumbnail !== "self" ? post.thumbnail : null,
          created: new Date(post.created_utc * 1000).toISOString(),
        };
      })
      .filter((p: any) => p.title && p.url); // Filter out invalid posts

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Reddit route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
