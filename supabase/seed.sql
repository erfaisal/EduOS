INSERT INTO auth.users
(
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES
(
  '00000000-0000-0000-0000-000000000000', -- Supabase default instance_id for new users
  gen_random_uuid(), -- Generate a new UUID for the admin user
  'authenticated',
  'authenticated',
  'admin@eduos.com',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"is_admin":true}',
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('Admin123!', gen_salt('bf')),
  updated_at = now();

INSERT INTO auth.identities
(
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  id,
  id, -- provider_id is user_id for email provider
  'email',
  format('{"sub":"%s","email":"%s"}', id, email)::jsonb,
  now(),
  now()
FROM auth.users
WHERE email = 'admin@eduos.com'
ON CONFLICT (provider, provider_id) DO NOTHING;

INSERT INTO public.institution_settings
(
  id,
  site_name,
  tagline,
  primary_color,
  secondary_color,
  contact_email,
  contact_phone,
  created_at,
  updated_at
)
VALUES
(
  '00000000-0000-0000-0000-000000000001', -- Fixed UUID for consistency
  'EduOS Institution',
  'Empowering the future of education',
  '#0f172a',
  '#3b82f6',
  'contact@eduos.com',
  '+1 234 567 8900',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  tagline = EXCLUDED.tagline,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  updated_at = now();

INSERT INTO public.pages
(
  id,
  slug,
  title,
  content,
  is_published,
  created_at,
  updated_at
)
VALUES
(
  gen_random_uuid(),
  'home',
  'Welcome to EduOS',
  '<h1>Welcome</h1><p>Edit this page in the admin panel.</p>',
  true,
  now(),
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();