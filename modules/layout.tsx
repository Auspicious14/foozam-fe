import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "./auth/context";
import Image from "next/image";

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
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-green-100 font-poppins flex flex-col">
      <header className="p-4 bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-700 drop-shadow-sm cursor-pointer tracking-tight">
              FooZam
            </h1>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link
              href="/"
              className={`font-bold transition-all hover:scale-105 ${
                router.pathname === "/"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              Recognize
            </Link>
            <Link
              href="/history"
              className={`font-bold transition-all hover:scale-105 ${
                router.pathname === "/history"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-orange-500"
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
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-all border-2 border-transparent hover:border-orange-200"
                >
                  <div className="relative w-10 h-10">
                    <Image
                      src={user.picture}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover border border-gray-200"
                    />
                  </div>
                  <span className="hidden sm:block font-bold text-gray-700">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/history"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 font-semibold transition-colors"
                    >
                      My History
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all border border-gray-200 active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center">{children}</main>
      <footer className="p-8 text-center text-gray-600 mt-auto bg-white/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <p className="font-bold">
            &copy; {new Date().getFullYear()} FooZam - Shazam for Food
          </p>
          <span className="inline-flex items-center gap-1 mt-2 text-sm">
            Made with{" "}
            <span role="img" aria-label="love">
              ❤️
            </span>{" "}
            by Auspicious
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
