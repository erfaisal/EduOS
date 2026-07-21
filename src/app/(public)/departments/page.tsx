import Link from "next/link";
import { getDepartments } from "@/services/departments";

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Academic Departments
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our academic departments, modern research facilities, and dedicated faculty members fostering educational excellence.
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-12 max-w-7xl mx-auto">
        {departments.map((dept: any) => (
          <div
            key={dept.id || dept.slug}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900">{dept.name}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {dept.head_of_department ? `Head: ${dept.head_of_department}` : ""}
              </p>
              <p className="line-clamp-3 text-gray-600 mb-6">
                {dept.description}
              </p>
            </div>
            <div>
              <Link
                href={`/departments/${dept.slug}`}
                className="text-primary hover:underline font-medium"
              >
                View Department &rarr;
              </Link>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}