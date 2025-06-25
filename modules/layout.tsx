import React from 'react';

const Layout = ({ children }: {children: React.ReactNode}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-green-100">
      <header className="p-4 bg-white shadow-md">
        <h1 className="text-4xl font-bold text-center drop-shadow-lg">FooZam</h1>
      </header>
      <main className="flex flex-col items-center justify-center p-4">
        {children}
      </main>
      <footer className="p-4 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Shazam for Food. All rights reserved.<br />
        <span className="inline-flex items-center gap-1 mt-1">
          Made with <span role="img" aria-label="love">❤️</span> by Auspicious
        </span>
      </footer>
    </div>
  );
};

export default Layout;