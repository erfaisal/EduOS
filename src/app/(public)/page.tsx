import Link from "next/link";
import { getSettingsServer } from "@/services/settings";
import { getActiveNotices } from "@/services/notices";

export default async function HomePage() {
  const [settings, notices] = await Promise.all([
    getSettingsServer(),
    getActiveNotices(),
  ]);

  const topNotices = notices ? notices.slice(0, 3) : [];

  const quickLinks = [
    {
      title: "Academics",
      href: "/academics",
      description: "Explore our academic programs and curriculum.",
    },
    {
      title: "Admissions",
      href: "/admissions",
      description: "Learn how to apply and join our institution.",
    },
    {
      title: "Campus Life",
      href: "/campus-life",
      description: "Discover student activities, housing, and facilities.",
    },
    {
      title: "Research",
      href: "/research",
      description: "Explore ground-breaking research and innovation.",
    },
  ];

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center bg-gray-50 px-4 py-12">
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tight mb-4">
          {settings?.site_name || "EduOS"}
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mb-8">
          {settings?.tagline || "Empowering the future through education"}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/admissions"
            className="px-6 py-3 rounded-md bg-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            Apply Now
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Explore Campus
          </Link>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Explore EduOS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-primary transition-all group"
              >
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
                  {link.title}
                </h3>
                <p className="text-gray-600 text-sm">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Notices Section */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Latest Announcements
          </h2>
          {topNotices.length > 0 ? (
            <div className="space-y-4">
              {topNotices.map((notice: any) => (
                <div
                  key={notice.id || notice.title}
                  className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:border-gray-300 transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {notice.title}
                  </h3>
                  {notice.date || notice.created_at ? (
                    <span className="text-sm text-gray-500 shrink-0">
                      {new Date(notice.date || notice.created_at).toLocaleDateString()}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No recent announcements
            </p>
          )}
        </div>
      </section>
    </main>
  );
}