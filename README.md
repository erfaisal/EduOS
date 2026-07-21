# EduOS - Institutional CMS Starter

EduOS is a robust, single-tenant Content Management System (CMS) tailored specifically for schools, colleges, and hospitals. Built on the modern Next.js 14 App Router and powered by Supabase, it provides a fast, secure, and easily customizable foundation to manage public-facing content, institutional announcements, department directories, and administrative operations.

## Architecture

The project is structured with a clean separation of concerns:
* **`(public)` routes**: Fast, SEO-optimized, and fully accessible public pages for visitors, students, patients, and the community.
* **`admin` dashboard**: A comprehensive management panel to control all aspects of the institution's digital presence.

Security is enforced at multiple layers. Access to the admin dashboard is protected at the edge using **Next.js Edge Middleware** for instant authentication checks, while the underlying database is hardened with strict **Supabase Row Level Security (RLS)** policies to ensure your data remains secure.

## Quick Start

Follow these 10 steps to deploy your instance of EduOS:

1. **Clone**: Clone the EduOS repository to your local machine or import it directly to your GitHub account.
2. **Create Supabase**: Sign in to Supabase and create a new project.
3. **Run setup.sql**: Navigate to the SQL Editor in your Supabase dashboard and execute the `setup.sql` script to configure the database schema, tables, and relationships.
4. **Run seed.sql**: Execute the `seed.sql` script in the Supabase SQL Editor to populate the initial system configuration and create the default admin account.
5. **Storage Buckets**: Set up your required storage buckets (such as `media` and `documents`) within the Supabase Storage panel, ensuring appropriate public/private access policies are configured.
6. **Add Vercel Env Vars**: Configure your Vercel project environment variables, ensuring you include `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
7. **Deploy**: Connect your repository to Vercel and trigger your initial production build.
8. **Login**: Navigate to your deployed site's `/admin` path and log in.
9. **Customize**: Head to the Settings tab in the Admin panel to update your institution's name, brand colors, logo, and contact details.
10. **Live**: Your high-performance, secure institutional website and CMS are now fully operational and live!

## Default Credentials

The `seed.sql` script provisions a default administrator account for your initial deployment:

* **Email**: `admin@eduos.com`
* **Password**: `Admin123!`

> ⚠️ **CRITICAL SECURITY WARNING**: You must change these credentials immediately after your first login. Navigate to the Admin Profile section to update your email address and choose a strong, unique password to secure your portal.