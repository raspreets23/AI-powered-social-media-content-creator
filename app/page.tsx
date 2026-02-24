"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import PromptInput from "./components/PromptInput";
import PlatformSelector from "./components/PlatformSelector";
import PostCard from "./components/PostCard";
import UserMenu from './components/UserMenu';
import { Sparkles, AlertCircle, Zap, TrendingUp, Clock, Hash } from "lucide-react";

interface Post {
  platform: string;
  content: string;
  hashtags: string[];
  bestTime: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (data: {
  topic: string;
  tone: string;
  targetAudience: string;
}) => {
  if (selectedPlatforms.length === 0) {
    setError("Please select at least one platform");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        platforms: selectedPlatforms,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate posts");
    }

    const result = await response.json();
    setPosts(result.posts || []);

    // Save to database if user is logged in
    if (session) {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: data.topic,
          tone: data.tone,
          targetAudience: data.targetAudience,
          platforms: selectedPlatforms,
          generatedPosts: result.posts,
        }),
      });
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12 max-w-5xl">
        {/* Header with UserMenu */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <Sparkles size={50} className="relative text-blue-600 animate-float" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="text-gradient">AI Social</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Media Creator
              </span>
            </h1>
          </div>
          
          {/* User Menu */}
          <UserMenu />
        </div>

        {/* Stats badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 mb-8">
          <div className="glass-effect px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" />
            <span>Powered by Gemini AI</span>
          </div>
          <div className="glass-effect px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" />
            <span>4+ Platforms</span>
          </div>
          <div className="glass-effect px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            <span>Instant Generation</span>
          </div>
          {session && (
            <div className="bg-green-100 px-4 py-2 rounded-full text-sm font-medium text-green-700 flex items-center gap-2">
              <span>✓ Signed in as {session.user?.name?.split(' ')[0]}</span>
            </div>
          )}
        </div>

        {/* Main Form with glass morphism */}
        <div className="glass-effect rounded-2xl p-8 mb-8 border border-white/50">
          <div className="space-y-6">
            <PlatformSelector
              selected={selectedPlatforms}
              onChange={setSelectedPlatforms}
            />

            <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />

            {error && (
              <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 animate-pulse">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results with enhanced cards */}
        {posts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 w-1 h-8 rounded-full"></span>
              <span className="text-gradient">Generated Posts</span>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </span>
              {session && (
                <span className="text-xs text-gray-500 ml-2">
                  (Saved to your history)
                </span>
              )}
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post, index) => (
                <div key={index} className="transform transition-all duration-500 hover:scale-[1.02]">
                  <PostCard {...post} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced tips section */}
        {!posts.length && !isLoading && (
          <div className="relative mt-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
            <div className="relative glass-effect rounded-2xl p-8 text-center border border-white/50">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
                  <Sparkles size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {session ? 'Ready to create amazing content?' : 'Sign in to save your posts!'}
              </h3>
              <p className="text-gray-600 mb-4">
                {session 
                  ? 'Enter a topic and select platforms to get started' 
                  : 'Create an account to save your generated posts and access history'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600 flex items-center gap-2">
                  <Hash size={14} /> benefits of learning to code
                </span>
                <span className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600 flex items-center gap-2">
                  <Hash size={14} /> new sustainable product launch
                </span>
                <span className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600 flex items-center gap-2">
                  <Hash size={14} /> workplace wellness tips
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}