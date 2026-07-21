-- EduOS/supabase/setup.sql - Part 1: Core Database Schema
-- Senior PostgreSQL Database Architect Section

-- Ensure pgcrypto extension is available for password hashing later
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. institution_settings table
CREATE TABLE IF NOT EXISTS public.institution_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name TEXT NOT NULL DEFAULT 'EduOS University',
    tagline TEXT NOT NULL DEFAULT 'Knowledge is the Future',
    primary_color TEXT NOT NULL DEFAULT '#0f172a',
    secondary_color TEXT NOT NULL DEFAULT '#f59e0b',
    logo_url TEXT NOT NULL DEFAULT 'https://example.com/eduos_logo.png',
    favicon_url TEXT NOT NULL DEFAULT 'https://example.com/eduos_favicon.ico',
    contact_email TEXT NOT NULL DEFAULT 'info@eduos.com',
    contact_phone TEXT NOT NULL DEFAULT '+1 (555) 123-4567',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Trigger for institution_settings
DROP TRIGGER IF EXISTS set_updated_at_institution_settings ON public.institution_settings;
CREATE TRIGGER set_updated_at_institution_settings
BEFORE UPDATE ON public.institution_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. pages table
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Storing HTML/text content
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Trigger for pages
DROP TRIGGER IF EXISTS set_updated_at_pages ON public.pages;
CREATE TRIGGER set_updated_at_pages
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 3. faculty table
CREATE TABLE IF NOT EXISTS public.faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Trigger for faculty
DROP TRIGGER IF EXISTS set_updated_at_faculty ON public.faculty;
CREATE TRIGGER set_updated_at_faculty
BEFORE UPDATE ON public.faculty
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. admissions table
-- Define ENUM type for admission status
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admission_status') THEN
        CREATE TYPE public.admission_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    program_of_interest TEXT NOT NULL,
    status public.admission_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Trigger for admissions
DROP TRIGGER IF EXISTS set_updated_at_admissions ON public.admissions;
CREATE TRIGGER set_updated_at_admissions
BEFORE UPDATE ON public.admissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- EduOS/supabase/setup.sql - Part 2: Row Level Security (RLS)
-- Supabase Security Expert Section

-- Function to check if a user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = user_id
    AND raw_user_meta_data->>'is_admin' = 'true'
);
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.institution_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- 1. Policies for institution_settings
-- Public Read Access
DROP POLICY IF EXISTS "Public can view institution settings" ON public.institution_settings;
CREATE POLICY "Public can view institution settings" ON public.institution_settings
FOR SELECT USING (TRUE);

-- Admin Write Access
DROP POLICY IF EXISTS "Admins can manage institution settings" ON public.institution_settings;
CREATE POLICY "Admins can manage institution settings" ON public.institution_settings
FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- 2. Policies for pages
-- Public Read Access (published pages)
DROP POLICY IF EXISTS "Public can view published pages" ON public.pages;
CREATE POLICY "Public can view published pages" ON public.pages
FOR SELECT USING (is_published = TRUE);

-- Admin Write Access
DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
CREATE POLICY "Admins can manage pages" ON public.pages
FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- 3. Policies for faculty
-- Public Read Access
DROP POLICY IF EXISTS "Public can view faculty profiles" ON public.faculty;
CREATE POLICY "Public can view faculty profiles" ON public.faculty
FOR SELECT USING (TRUE);

-- Admin Write Access
DROP POLICY IF EXISTS "Admins can manage faculty profiles" ON public.faculty;
CREATE POLICY "Admins can manage faculty profiles" ON public.faculty
FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- 4. Policies for admissions
-- Public can INSERT
DROP POLICY IF EXISTS "Public can submit admission applications" ON public.admissions;
CREATE POLICY "Public can submit admission applications" ON public.admissions
FOR INSERT WITH CHECK (TRUE); -- Allow anonymous users to submit applications

-- Admins can SELECT, UPDATE, DELETE
DROP POLICY IF EXISTS "Admins can manage admission applications" ON public.admissions;
CREATE POLICY "Admins can manage admission applications" ON public.admissions
FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- EduOS/supabase/setup.sql - Part 3: Storage, Seed Data & Admin User
-- Supabase Operations Engineer Section

-- 1. Storage Buckets
-- Enable RLS on storage.objects for general security
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they interfere
DROP POLICY IF EXISTS "Public access to logos" ON storage.objects;
DROP POLICY IF EXISTS "Public access to faculty images" ON storage.objects;
DROP POLICY IF EXISTS "Public access to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload/delete storage" ON storage.objects;

-- Create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
    ('logos', 'logos', TRUE),
    ('faculty-images', 'faculty-images', TRUE),
    ('gallery', 'gallery', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Public read access for specific buckets
CREATE POLICY "Public access to logos" ON storage.objects
FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Public access to faculty images" ON storage.objects
FOR SELECT USING (bucket_id = 'faculty-images');

CREATE POLICY "Public access to gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

-- Admin upload/delete for all created buckets
CREATE POLICY "Admins can upload/delete storage" ON storage.objects
FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- 2. Seed Admin User
INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at
) VALUES (
    'b2c8c7f0-0a2b-4d7e-8c3f-9a1b0c7d6e5a', -- Use a fixed UUID for a predictable admin
    'authenticated',
    'authenticated',
    'admin@eduos.com',
    crypt('admin_password_123', gen_salt('bf')), -- Default password, please change immediately
    NOW(),
    '{"is_admin": true}',
    TRUE,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    is_super_admin = EXCLUDED.is_super_admin,
    updated_at = NOW()
WHERE auth.users.email = 'admin@eduos.com';

-- 3. Seed Settings
INSERT INTO public.institution_settings (
    site_name, tagline, primary_color, secondary_color,
    logo_url, favicon_url, contact_email, contact_phone
) VALUES (
    'EduOS University',
    'Igniting Minds, Shaping Futures',
    '#0f172a',
    '#f59e0b',
    'https://example.com/eduos_logo.png',
    'https://example.com/eduos_favicon.ico',
    'info@eduos.com',
    '+1 (555) 123-4567'
)
ON CONFLICT (id) DO NOTHING; -- Assuming the first insert will default to id uuid_generate_v4(). If you want to explicitly update
                              -- if it already exists, you'd need to add a WHERE clause here or pick a fixed ID.
                              -- For simplicity, assuming this is for initial setup and will insert only once.