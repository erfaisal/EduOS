import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, User, Calendar, GraduationCap, Bell } from 'lucide-react';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const userEmail = session.user.email ?? '';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Grades', href: '/grades', icon: GraduationCap },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Slim Left Sidebar */}
      <aside className="w-20 md:w-64 bg-primary text-white flex-shrink-0 flex flex-col">
        <div className="p-4 md:p-6 text-lg font-bold border-b border-white/10">
          <span className="hidden md:inline">EduOS</span>
          <span className="md:hidden">EO</span>
        </div>
        <nav className="flex-1 p-3 md:p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:inline font-medium text-sm">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 overflow-y-auto flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="text-sm font-medium text-gray-700">
            {userEmail}
          </div>
          <button
            aria-label="Notifications"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}