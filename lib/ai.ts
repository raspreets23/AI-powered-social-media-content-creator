import { GoogleGenAI } from "@google/genai";

// Initialize Gemini with new SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface GeneratePostParams {
  topic: string;
  platforms: string[];
  tone: string;
  targetAudience: string;
}

export async function generateSocialMediaPosts(params: GeneratePostParams) {
  const { topic, platforms, tone, targetAudience } = params;

  const prompt = `Create engaging social media posts about "${topic}".

Target Audience: ${targetAudience}
Tone: ${tone}

Create posts for these platforms: ${platforms.join(', ')}

For each platform, provide:
1. Platform name
2. The post content
3. 3-5 relevant hashtags
4. Best time to post (general suggestion)

Make the posts engaging, platform-appropriate, and optimized for engagement.

Format the response as JSON like this:
{
  "posts": [
    {
      "platform": "Twitter/X",
      "content": "post text here",
      "hashtags": ["tag1", "tag2"],
      "bestTime": "9 AM - 11 AM EST"
    }
  ]
}`;

  try {
    // NEW SDK syntax - this is the only part that changed!
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",  // or "gemini-1.5-flash" if you prefer
      contents: prompt,
    });
    
    const text = response.text;
    
    // Parse JSON from response (this part stays the same)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { posts: [] };
  } catch (error) {
    console.error("AI generation error:", error);
    throw new Error("Failed to generate content");
  }
}