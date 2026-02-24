'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, User, History, Heart, Settings } from 'lucide-react';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (status === 'loading') {
    return <div className="w-8 h-8 rounded-full bg-purple-500/20 animate-pulse"></div>;
  }

  if (!session) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg p-1 pr-3 hover:bg-white/20 transition"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        )}
        <span className="text-sm text-white hidden md:block">
          {session.user?.name?.split(' ')[0]}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 glass-effect-dark rounded-xl border border-purple-500/30 shadow-2xl z-20">
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-white border-b border-purple-500/20">
                <p className="font-medium">{session.user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/dashboard');
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg flex items-center gap-2"
              >
                <History size={16} /> History
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/favorites');
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg flex items-center gap-2"
              >
                <Heart size={16} /> Favorites
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/settings');
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg flex items-center gap-2"
              >
                <Settings size={16} /> Settings
              </button>

              <div className="border-t border-purple-500/20 my-1"></div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}