"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface SidebarProps {
  userEmail: string;
}

const navigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Pages", href: "/admin/pages" },
  { name: "Faculty", href: "/admin/faculty" },
  { name: "Admissions", href: "/admin/admissions" },
  { name: "Settings", href: "/admin/settings" },
];

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <h1 className="text-2xl font-semibold text-white">EduOS Admin</h1>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-md
                ${
                  isActive
                    ? "bg-primary/20 border-l-4 border-primary text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4 text-sm">
        <p className="text-gray-400 mb-2 truncate" title={userEmail}>
          {userEmail}
        </p>
        <button
          onClick={handleLogout}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}