import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "./auth/context";
import Image from "next/image";
import CookieConsent from "../components/CookieConsent";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogin = () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-outfit flex flex-col selection:bg-brand-orange/30">
      <header className="p-4 bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl premium-shadow">
              <Image
                src="/logo.png"
                alt="FooZam Logo"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tighter group-hover:text-brand-orange transition-colors">
              FooZam
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200/50">
            <Link
              href="/"
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                router.pathname === "/"
                  ? "bg-white text-brand-orange shadow-sm"
                  : "text-gray-500 hover:text-brand-dark hover:bg-white/50"
              }`}
            >
              Analyze
            </Link>
            <Link
              href="/history"
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                router.pathname === "/history"
                  ? "bg-white text-brand-orange shadow-sm"
                  : "text-gray-500 hover:text-brand-dark hover:bg-white/50"
              }`}
            >
              History
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-50 border border-gray-200 hover:border-brand-orange/30 transition-all active:scale-95"
                >
                  <div className="relative w-9 h-9">
                    <Image
                      src={user.picture}
                      alt={user.name}
                      fill
                      className="rounded-xl object-cover"
                    />
                  </div>
                  <span className="hidden sm:block font-bold text-gray-700 pr-2">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-2 border border-gray-100 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                        Acount
                      </p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/history"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-orange-50 font-semibold transition-colors"
                    >
                      <span>🕒</span> History
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin/analytics"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-brand-orange hover:bg-orange-50 font-bold transition-colors"
                      >
                        <span>📊</span> Dashboard
                      </Link>
                    )}
                    <div className="px-2 pt-2">
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                      >
                         Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2.5 bg-brand-dark text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-brand-dark/20 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="p-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-3">
               <div className="relative w-8 h-8 overflow-hidden rounded-lg premium-shadow">
                  <Image
                    src="/logo.png"
                    alt="FooZam Logo"
                    fill
                    className="object-cover"
                  />
               </div>
               <span className="text-xl font-black tracking-tighter">FooZam</span>
            </Link>
            <p className="text-sm text-gray-400 font-medium">The Shazam for your delicious discoveries.</p>
          </div>
          
          <div className="flex gap-8">
            <Link href="/" className="text-sm font-bold text-gray-500 hover:text-brand-orange transition-colors">Analyzer</Link>
            <Link href="/history" className="text-sm font-bold text-gray-500 hover:text-brand-orange transition-colors">History</Link>
            <Link href="#" className="text-sm font-bold text-gray-500 hover:text-brand-orange transition-colors">Privacy</Link>
          </div>

          <div className="text-sm font-bold text-gray-400">
            &copy; {new Date().getFullYear()} FooZam. All rights reserved.
          </div>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
};

export default Layout;
