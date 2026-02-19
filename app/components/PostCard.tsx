"use client";

import { useState } from "react";
import { Copy, Check, Clock, Hash, Share2, Download, Sparkles, Twitter, Instagram, Linkedin, Facebook } from "lucide-react";

interface PostCardProps {
  platform: string;
  content: string;
  hashtags: string[];
  bestTime: string;
}

export default function PostCard({ platform, content, hashtags, bestTime }: PostCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyToClipboard = async () => {
    const fullText = `${content}\n\n${hashtags.map(t => `#${t}`).join(' ')}`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformIcon = () => {
    switch (platform.toLowerCase()) {
      case 'twitter': return <Twitter className="text-blue-400" size={24} />;
      case 'instagram': return <Instagram className="text-pink-500" size={24} />;
      case 'linkedin': return <Linkedin className="text-blue-600" size={24} />;
      case 'facebook': return <Facebook className="text-blue-800" size={24} />;
      default: return <Share2 size={24} />;
    }
  };

  const getPlatformGradient = () => {
    switch (platform.toLowerCase()) {
      case 'twitter': return 'from-blue-400 to-blue-500';
      case 'instagram': return 'from-pink-500 via-red-500 to-yellow-500';
      case 'linkedin': return 'from-blue-600 to-blue-700';
      case 'facebook': return 'from-blue-700 to-blue-800';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPlatformBadgeColor = () => {
    switch (platform.toLowerCase()) {
      case 'twitter': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'instagram': return 'bg-pink-50 text-pink-600 border-pink-200';
      case 'linkedin': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'facebook': return 'bg-blue-50 text-blue-600 border-blue-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="group relative">
      {/* Animated background effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${getPlatformGradient()} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500`}></div>
      
      {/* Main card */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
        {/* Header with platform gradient */}
        <div className={`bg-gradient-to-r ${getPlatformGradient()} px-6 py-4 flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              {getPlatformIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {platform}
                <Sparkles size={16} className="text-white/80" />
              </h3>
              <p className="text-xs text-white/80">AI Generated Content</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              title={expanded ? "Show less" : "Show more"}
            >
              <span className="text-sm font-medium">{expanded ? '−' : '+'}</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white relative"
              title="Copy to clipboard"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={`prose prose-sm max-w-none text-gray-700 mb-4 transition-all ${expanded ? '' : 'max-h-32 overflow-hidden relative'}`}>
            <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
            {!expanded && content.length > 200 && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          
          {content.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-1"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}

          {/* Hashtags */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={16} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hashtags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, i) => (
                <span
                  key={i}
                  className={`${getPlatformBadgeColor()} border px-3 py-1.5 rounded-full text-sm flex items-center gap-1 hover:scale-105 transition-transform cursor-default`}
                >
                  <Hash size={12} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Best time and actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-amber-50 p-2 rounded-lg">
                <Clock size={16} className="text-amber-500" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Best posting time</span>
                <span className="font-medium text-gray-700">{bestTime}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
                <Download size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* AI confidence badge */}
        <div className="absolute bottom-2 right-2 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Sparkles size={10} />
          <span>AI Generated</span>
        </div>
      </div>
    </div>
  );
}