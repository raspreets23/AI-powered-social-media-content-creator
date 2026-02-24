import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { topic, tone, targetAudience, platforms, generatedPosts } = body;

    await connectToDatabase();

    const post = await Post.create({
      userId: session.user.id,
      topic,
      tone,
      targetAudience,
      platforms,
      generatedPosts,
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const favorite = searchParams.get('favorite') === 'true';

    await connectToDatabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId: session.user.id };
    if (favorite) {
      query.isFavorite = true;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}