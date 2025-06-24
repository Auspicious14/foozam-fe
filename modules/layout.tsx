import React from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-green-100">
      <header className="p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-center">Shazam for Food</h1>
      </header>
      <main className="flex flex-col items-center justify-center p-4">
        {children}
      </main>
      <footer className="p-4 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Shazam for Food. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;