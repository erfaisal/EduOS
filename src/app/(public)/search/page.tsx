import { globalSearch } from "@/services/search";
import { SearchInterface } from "./search-interface";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const results = query ? await globalSearch(query) : [];

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <SearchInterface initialQuery={query} results={results} />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export function SearchInterface({
  initialQuery,
  results,
}: {
  initialQuery: string;
  results: any[];
}) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("q") as string;
    if (value !== undefined) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="flex gap-3 w-full">
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder="Search the portal..."
          className="flex-1 px-5 py-3.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
        <button
          type="submit"
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg shadow-sm transition-colors"
        >
          Search
        </button>
      </form>

      <div className="mt-8">
        {initialQuery === "" ? (
          <p className="text-gray-500 text-lg">
            Enter a keyword to search the institution portal.
          </p>
        ) : results.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No results found for &apos;{initialQuery}&apos;
          </p>
        ) : (
          <div className="space-y-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="border-b border-gray-100 pb-6 last:border-0"
              >
                <Link href={result.url} className="group block">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold text-blue-600 group-hover:underline">
                      {result.title}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded">
                      {result.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {result.snippet}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}