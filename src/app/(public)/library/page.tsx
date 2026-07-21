import { getLibraryResources } from "@/services/library";

interface LibraryResource {
  id: string | number;
  title: string;
  author: string;
  category: string;
  resource_type: string;
  availability_status: boolean;
}

export default async function LibraryPage() {
  const resources: LibraryResource[] = await getLibraryResources();

  const groupedResources = resources.reduce<Record<string, LibraryResource[]>>(
    (acc, resource) => {
      const type = resource.resource_type || "General";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(resource);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Central Library
          </h1>
          <p className="text-lg text-gray-300">
            Welcome to the central knowledge repository. Access physical books, digital e-books, journals, and learning media.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {Object.entries(groupedResources).map(([type, items]) => (
          <section key={type} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">
              {type}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {items.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-xl shadow-sm border p-6 flex flex-col h-full"
                >
                  <div className="flex-1">
                    <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 rounded-md px-2.5 py-1 mb-3">
                      {resource.category}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{resource.author}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 mt-auto flex items-center gap-2">
                    {resource.availability_status ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                        <span className="text-sm font-medium text-green-700">
                          Available
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                        <span className="text-sm font-medium text-red-700">
                          Checked Out
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}