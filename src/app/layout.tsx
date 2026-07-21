import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { createClient } from '@/lib/supabase/server';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data, error } = await supabase.from('institution_settings').select('institution_name, description, favicon_url').single();

  const defaultTitle = 'EduOS';
  const defaultDescription = 'Your comprehensive education operating system.';
  const defaultFavicon = '/favicon.ico'; // Standard Next.js favicon path if none is provided by the database

  return {
    title: data?.institution_name || defaultTitle,
    description: data?.description || defaultDescription,
    icons: {
      icon: data?.favicon_url || defaultFavicon,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('institution_settings').select('primary_color, secondary_color').single();

  // Fallback generic hex colors if database fetch fails or colors are null
  const primaryColor = data?.primary_color || '#3b82f6'; // A shade of blue, e.g., Tailwind blue-500
  const secondaryColor = data?.secondary_color || '#60a5fa'; // A lighter shade of blue, e.g., Tailwind blue-400

  return (
    <html lang="en">
      <body
        className={inter.className}
        style={
          {
            '--color-primary': primaryColor,
            '--color-secondary': secondaryColor,
          } as React.CSSProperties
        }
      >
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster richColors />
      </body>
    </html>
  );
}