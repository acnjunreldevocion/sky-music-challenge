'use client';

import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="text-gray-900 border-t border-gray-200"
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Brand + Description */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              href="/"
              aria-label="Go to Sky Music homepage"
              className="text-lg text-gray-900 font-semibold hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
            >
              Sky Music
            </Link>

            <span
              className="hidden sm:inline-block text-sm text-gray-400 mx-2"
              aria-hidden="true"
            >
              •
            </span>

            <p className="text-sm text-gray-700 max-w-md">
              A demo app showing the iTunes Top 100 albums. Built for the Sky Germany coding challenge — clean, responsive, and accessible.
            </p>
          </div>

          {/* Navigation + Links */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <nav
              aria-label="Footer navigation"
              className="flex gap-4 flex-wrap items-center"
            >
              <a
                href="https://itunes.apple.com/us/rss/topalbums/limit=100/json"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
                aria-label="View iTunes feed (opens in a new tab)"
              >
                <ExternalLink aria-hidden="true" className="w-4 h-4 text-current" />
                <span>iTunes Feed</span>
              </a>

              <a
                href="https://github.com/your-username/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
                aria-label="View source code on GitHub (opens in a new tab)"
              >
                <Github aria-hidden="true" className="w-4 h-4 text-current" />
                <span>Source</span>
              </a>

              <Link
                href="/section/favorites"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
                aria-label="View your favorite albums"
              >
                <span>Favorites</span>
              </Link>
            </nav>

            {/* Copyright */}
            <div className="text-sm text-gray-600 md:ml-4">
              <span aria-hidden="true">©</span> {year} Sky Music
            </div>
          </div>
        </div>

        {/* Subtext / Tech stack */}
        <p className="mt-4 text-xs text-gray-600">
          Built with Next.js • Styled for responsive UX • Graceful degradation for older browsers
        </p>
      </div>
    </footer>
  );
}