import { NextResponse } from "next/server";
import { generateSocialMediaPosts } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, platforms, tone, targetAudience } = body;

    // Validate input
    if (!topic || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Topic and at least one platform are required" },
        { status: 400 }
      );
    }

    // Generate posts
    const result = await generateSocialMediaPosts({
      topic,
      platforms,
      tone: tone || "professional",
      targetAudience: targetAudience || "general audience",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}