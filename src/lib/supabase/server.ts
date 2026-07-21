import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component
            // if a `Response` is not already committed. For example, if you're
            // in an event handler or `action` that's not part of a page load,
            // it's possible that the response has already been sent.
            // We suppress this error as per requirement.
            // console.warn('Failed to set cookie in Server Component context:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Similar to `set`, suppress the error if response is already committed.
            // console.warn('Failed to remove cookie in Server Component context:', error);
          }
        },
      },
    }
  )
}