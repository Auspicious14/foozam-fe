import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout = ({ children }: {children: React.ReactNode}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-green-100 font-poppins">
      <header className="p-4 bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/">
            <h1 className="text-4xl font-bold text-orange-700 drop-shadow-sm cursor-pointer">FooZam</h1>
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className={`font-semibold transition-colors ${router.pathname === '/' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>
              Recognize
            </Link>
            <Link href="/history" className={`font-semibold transition-colors ${router.pathname === '/history' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>
              History
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex flex-col items-center p-4">
        {children}
      </main>
      <footer className="p-8 text-center text-gray-600 mt-auto">
        <div className="max-w-6xl mx-auto">
          <p>&copy; {new Date().getFullYear()} FooZam - Shazam for Food. All rights reserved.</p>
          <span className="inline-flex items-center gap-1 mt-2">
            Made with <span role="img" aria-label="love">❤️</span> by Auspicious
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
