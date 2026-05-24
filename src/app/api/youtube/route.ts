import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 });
    }

    // Search YouTube for "{query} review 2024"
    const searchQuery = `${query} review 2024`;
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.append("part", "snippet");
    searchUrl.searchParams.append("q", searchQuery);
    searchUrl.searchParams.append("maxResults", "4");
    searchUrl.searchParams.append("type", "video");
    searchUrl.searchParams.append("key", apiKey);

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("YouTube API error:", data);
      return NextResponse.json({ error: "Failed to fetch YouTube videos" }, { status: 500 });
    }

    // Extract and format video data
    const videos = (data.items || []).map((item: any) => ({
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      videoId: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("YouTube route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
