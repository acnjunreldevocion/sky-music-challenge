'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-neutral-900 text-white py-6">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Link href="/" className="text-lg font-semibold text-white hover:opacity-90">
              Sky Music
            </Link>
            <span className="hidden sm:inline-block text-sm text-gray-400 mx-2">•</span>
            <p className="text-sm text-gray-400 max-w-md">
              A demo app showing the iTunes Top 100 albums. Built for the Sky Germany coding challenge — clean, responsive and accessible.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <nav aria-label="Footer navigation" className="flex gap-3 flex-wrap">
              <a
                href="https://itunes.apple.com/us/rss/topalbums/limit=100/json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-white inline-flex items-center gap-1"
              >
                iTunes Feed
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                href="https://github.com/your-username/your-repo"
                className="text-sm text-gray-300 hover:text-white inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
                <Github className="w-4 h-4" />
              </Link>

              <Link
                href="/section/favorites"
                className="text-sm text-gray-300 hover:text-white inline-flex items-center gap-1"
              >
                Favorites
              </Link>
            </nav>

            <div className="text-sm text-gray-400">
              © {year} Sky Music
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Built with Next.js • Styled for responsive UX • Graceful degradation for older browsers
        </div>
      </div>
    </footer>
  );
}