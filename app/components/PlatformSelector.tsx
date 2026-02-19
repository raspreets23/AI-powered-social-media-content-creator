"use client";

import { Twitter, Instagram, Linkedin, Facebook, Check } from "lucide-react";

const platforms = [
  { id: "twitter", name: "Twitter/X", icon: Twitter, gradient: "from-blue-400 to-blue-500", bg: "bg-blue-50", text: "text-blue-500" },
  { id: "instagram", name: "Instagram", icon: Instagram, gradient: "from-pink-500 via-red-500 to-yellow-500", bg: "bg-pink-50", text: "text-pink-500" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, gradient: "from-blue-600 to-blue-700", bg: "bg-blue-50", text: "text-blue-600" },
  { id: "facebook", name: "Facebook", icon: Facebook, gradient: "from-blue-700 to-blue-800", bg: "bg-blue-50", text: "text-blue-700" },
];

interface Props {
  selected: string[];
  onChange: (platforms: string[]) => void;
}

export default function PlatformSelector({ selected, onChange }: Props) {
  const togglePlatform = (platformId: string) => {
    if (selected.includes(platformId)) {
      onChange(selected.filter(p => p !== platformId));
    } else {
      onChange([...selected, platformId]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
        Select Platforms
        {selected.length > 0 && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {selected.length} selected
          </span>
        )}
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isSelected = selected.includes(platform.id);
          
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${
                isSelected 
                  ? 'shadow-xl scale-105 ring-2 ring-offset-2 ring-blue-500' 
                  : 'hover:shadow-md hover:scale-102'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${platform.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className={`relative p-4 flex flex-col items-center gap-2 border-2 rounded-xl transition-all ${
                isSelected 
                  ? `border-transparent bg-gradient-to-r ${platform.gradient} text-white` 
                  : `${platform.bg} border-gray-100 text-gray-600 hover:border-gray-200`
              }`}>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                
                <Icon size={24} className={isSelected ? 'text-white' : platform.text} />
                <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {platform.name}
                </span>
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </button>
          );
        })}
      </div>
      
      {selected.length === 0 && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          Select at least one platform to continue
        </p>
      )}
    </div>
  );
}