import { createClient } from '@/lib/supabase/server';
import { FileText, Users, Inbox, Bell } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: pageCount },
    { count: facultyCount },
    { count: pendingAdmissions },
    { count: activeNotices },
  ] = await Promise.all([
    supabase.from('pages').select('*', { count: 'exact', head: true }),
    supabase.from('faculty').select('*', { count: 'exact', head: true }),
    supabase.from('admissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('notices').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ]);

  return (
    <DashboardMetrics
      pageCount={pageCount ?? 0}
      facultyCount={facultyCount ?? 0}
      pendingAdmissions={pendingAdmissions ?? 0}
      activeNotices={activeNotices ?? 0}
    />
  );
}

export function DashboardMetrics({
  pageCount,
  facultyCount,
  pendingAdmissions,
  activeNotices,
}: any) {
  const cards = [
    {
      label: 'Total Pages',
      count: pageCount,
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Faculty',
      count: facultyCount,
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Pending Applications',
      count: pendingAdmissions,
      icon: Inbox,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Active Notices',
      count: activeNotices,
      icon: Bell,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome to the EduOS Dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.count}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor} ${card.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}