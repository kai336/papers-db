import Link from 'next/link';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="font-semibold text-lg">Papers DB</Link>
          <nav className="space-x-4 text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/add" className="hover:underline">Add</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto p-6">{children}</main>
    </div>
  );
}
