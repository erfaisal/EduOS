import React from 'react';

interface SystemLayoutProps {
  children: React.ReactNode;
}

export default function SystemLayout({ children }: SystemLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      {children}
      <p className="mt-12 text-sm text-gray-400">© {new Date().getFullYear()} Institution Portal</p>
    </main>
  );
}