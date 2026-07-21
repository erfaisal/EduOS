import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white border-b py-4">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray">
        {children}
      </main>
      <footer className="text-center text-sm text-gray-500 py-6 border-t mt-12">
        Legal & Compliance Documents
      </footer>
    </div>
  );
}