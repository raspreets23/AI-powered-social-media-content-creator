"use client";

import { useState } from "react";
import { Send, Loader2, Sparkles, Users, Mic } from "lucide-react";

interface Props {
  onGenerate: (data: {
    topic: string;
    tone: string;
    targetAudience: string;
  }) => void;
  isLoading: boolean;
}

export default function PromptInput({ onGenerate, isLoading }: Props) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate({ topic, tone, targetAudience });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Topic Input */}
      <div className="relative">
        <label className={`absolute -top-2.5 left-3 px-2 text-xs font-medium transition-all z-10 ${
          focused === 'topic' || topic ? 'text-blue-600' : 'text-gray-500'
        }`}>
          <span className="bg-white px-1">What is your topic? *</span>
        </label>
        <div className="relative">
          <Sparkles className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
            focused === 'topic' ? 'text-blue-500' : 'text-gray-400'
          }`} size={18} />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onFocus={() => setFocused('topic')}
            onBlur={() => setFocused(null)}
            placeholder="e.g., The benefits of meditation"
            className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-0 transition-all bg-white/50 backdrop-blur-sm
                     border-gray-200 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            required
          />
        </div>
      </div>

      {/* Target Audience Input */}
      <div className="relative">
        <label className={`absolute -top-2.5 left-3 px-2 text-xs font-medium transition-all z-10 ${
          focused === 'audience' || targetAudience ? 'text-blue-600' : 'text-gray-500'
        }`}>
          <span className="bg-white px-1">Target Audience</span>
        </label>
        <div className="relative">
          <Users className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
            focused === 'audience' ? 'text-blue-500' : 'text-gray-400'
          }`} size={18} />
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            onFocus={() => setFocused('audience')}
            onBlur={() => setFocused(null)}
            placeholder="e.g., Young professionals, Students"
            className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-0 transition-all bg-white/50 backdrop-blur-sm
                     border-gray-200 focus:border-blue-500 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tone Selector */}
      <div className="relative">
        <label className={`absolute -top-2.5 left-3 px-2 text-xs font-medium transition-all z-10 ${
          focused === 'tone' ? 'text-blue-600' : 'text-gray-500'
        }`}>
          <span className="bg-white px-1">Tone</span>
        </label>
        <div className="relative">
          <Mic className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
            focused === 'tone' ? 'text-blue-500' : 'text-gray-400'
          }`} size={18} />
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            onFocus={() => setFocused('tone')}
            onBlur={() => setFocused(null)}
            className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-0 transition-all bg-white/50 backdrop-blur-sm
                     border-gray-200 focus:border-blue-500 text-gray-700 appearance-none cursor-pointer"
          >
            <option value="professional">Professional & Corporate</option>
            <option value="casual">Casual & Friendly</option>
            <option value="humorous">Humorous & Witty</option>
            <option value="inspirational">Inspirational & Motivating</option>
            <option value="educational">Educational & Informative</option>
            <option value="urgent">Urgent & Exciting</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-[2px] hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl px-6 py-4 text-white font-medium overflow-hidden">
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Generating your content...</span>
            </>
          ) : (
            <>
              <Send size={20} className="group-hover:rotate-12 transition-transform" />
              <span>Generate Posts</span>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 px-2 py-1 rounded text-xs">
                ✨ AI
              </div>
            </>
          )}
        </div>
      </button>
    </form>
  );
}