'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { History, Heart, Clock, Sparkles, Trash2 } from 'lucide-react';
import PostCard from '../components/PostCard';

interface SavedPost {
  _id: string;
  topic: string;
  tone: string;
  targetAudience?: string;
  platforms: string[];
  generatedPosts: Array<{
    platform: string;
    content: string;
    hashtags: string[];
    bestTime: string;
  }>;
  isFavorite: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchPosts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, filter]);

  const fetchPosts = async () => {
    try {
      const url = filter === 'favorites' 
        ? '/api/posts?favorite=true'
        : '/api/posts';
      const response = await fetch(url);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (postId: string, currentFavorite: boolean) => {
    try {
      const response = await fetch(`/api/posts/${postId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentFavorite }),
      });

      if (response.ok) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, isFavorite: !currentFavorite }
            : post
        ));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}/favorite`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <History size={32} className="text-purple-400" />
            Your Post History
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                filter === 'favorites'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Heart size={16} />
              Favorites
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-effect-dark rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <History className="text-purple-400" size={24} />
              <h3 className="text-lg font-medium text-white">Total Posts</h3>
            </div>
            <p className="text-3xl font-bold text-white">{posts.length}</p>
          </div>

          <div className="glass-effect-dark rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="text-pink-400" size={24} />
              <h3 className="text-lg font-medium text-white">Favorites</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {posts.filter(p => p.isFavorite).length}
            </p>
          </div>

          <div className="glass-effect-dark rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-blue-400" size={24} />
              <h3 className="text-lg font-medium text-white">Topics</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {new Set(posts.map(p => p.topic)).size}
            </p>
          </div>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="glass-effect-dark rounded-2xl p-12 text-center border border-purple-500/30">
            <History size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No posts yet</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'favorites' 
                ? "You haven't favorited any posts yet"
                : "Generate your first post to see it here"}
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              Create New Post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="relative">
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <div className="glass-effect-dark rounded-xl p-6 border border-purple-500/30">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{post.topic}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                        <span>Tone: {post.tone}</span>
                        {post.targetAudience && (
                          <>
                            <span>•</span>
                            <span>Audience: {post.targetAudience}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavorite(post._id, post.isFavorite)}
                        className={`p-2 rounded-lg transition ${
                          post.isFavorite
                            ? 'bg-pink-600 text-white'
                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                        }`}
                      >
                        <Heart size={18} fill={post.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => deletePost(post._id)}
                        className="p-2 bg-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {post.generatedPosts.map((genPost, idx) => (
                      <div key={idx} className="border-t border-purple-500/20 pt-4 first:border-0 first:pt-0">
                        <PostCard
                          platform={genPost.platform}
                          content={genPost.content}
                          hashtags={genPost.hashtags}
                          bestTime={genPost.bestTime}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}