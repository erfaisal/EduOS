import { createClient } from "@/lib/supabase/server";
import { getActiveNotices } from "@/services/notices";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const notices = await getActiveNotices();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome back, {user?.email}
      </h1>
      <PortalWidgets recentNotices={notices ? notices.slice(0, 3) : []} />
    </div>
  );
}

export function PortalWidgets({ recentNotices }: { recentNotices: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Today&apos;s Schedule
          </h2>
          <ul className="space-y-3">
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  CS101: Introduction to Computer Science
                </p>
                <p className="text-sm text-gray-500">Room 302 • Prof. Smith</p>
              </div>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                09:00 AM
              </span>
            </li>
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  MATH201: Multivariable Calculus
                </p>
                <p className="text-sm text-gray-500">Hall B • Prof. Johnson</p>
              </div>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                11:30 AM
              </span>
            </li>
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  PHYS102: General Physics Lab
                </p>
                <p className="text-sm text-gray-500">Lab 105 • Dr. Davis</p>
              </div>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                02:00 PM
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Grades
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-2 rounded-l-lg">Subject</th>
                  <th className="px-4 py-2">Assignment</th>
                  <th className="px-4 py-2 rounded-r-lg text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">CS101</td>
                  <td className="px-4 py-3">Midterm Exam</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    A (94%)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    MATH201
                  </td>
                  <td className="px-4 py-3">Problem Set 3</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    A- (90%)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    PHYS102
                  </td>
                  <td className="px-4 py-3">Lab Report 2</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-600">
                    B+ (87%)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Campus Alerts
          </h2>
          {recentNotices && recentNotices.length > 0 ? (
            <div className="space-y-4">
              {recentNotices.map((notice, idx) => (
                <div
                  key={notice.id || idx}
                  className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <h3 className="font-medium text-gray-900 text-sm">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {notice.created_at
                      ? new Date(notice.created_at).toLocaleDateString()
                      : notice.date || "Recent"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No new alerts.</p>
          )}
        </div>
      </div>
    </div>
  );
}