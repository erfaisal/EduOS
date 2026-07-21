import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

// Infer database types from the client
type SupabaseClient = ReturnType<typeof createServerClient>;
type Database = SupabaseClient['database'];

export type PageData = Database['public']['Tables']['pages']['Row'];
export type PageInsertData = Database['public']['Tables']['pages']['Insert'];
export type PageUpdateData = Database['public']['Tables']['pages']['Update'];

/**
 * Retrieves a single published page by its slug.
 * @param slug The slug of the page to retrieve.
 * @returns The page data or null if not found.
 */
export async function getPageBySlug(slug: string): Promise<PageData | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("Error fetching page by slug:", error);
    return null;
  }

  return data;
}

/**
 * Retrieves a list of all pages, optionally including drafts.
 * @param includeDrafts If true, unpublished pages are included. Defaults to false.
 * @returns An array of page summary data.
 */
export async function getAllPages(
  includeDrafts: boolean = false
): Promise<Array<Pick<PageData, "id" | "title" | "slug" | "is_published" | "updated_at">>> {
  const supabase = createServerClient();
  let query = supabase
    .from("pages")
    .select("id, title, slug, is_published, updated_at");

  if (!includeDrafts) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query.order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching all pages:", error);
    return [];
  }

  return data;
}

/**
 * Creates a new page.
 * @param data The page data to insert.
 * @returns The ID of the newly created page.
 * @throws An error if the slug is not unique or another database error occurs.
 */
export async function createPage(data: {
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  meta_description: string;
}): Promise<string> {
  const supabase = createBrowserClient();
  const { data: insertedData, error } = await supabase
    .from("pages")
    .insert(data)
    .select("id")
    .single();

  if (error) {
    // Check for unique constraint violation on the 'slug' column
    if (error.code === '23505' && error.constraint === 'pages_slug_key') {
        throw new Error("A page with this slug already exists. Please choose a unique slug.");
    }
    console.error("Error creating page:", error);
    throw new Error(`Failed to create page: ${error.message}`);
  }

  return insertedData.id;
}

/**
 * Updates an existing page.
 * @param id The ID of the page to update.
 * @param updates The partial page data to update.
 * @throws An error if the update fails.
 */
export async function updatePage(id: string, updates: Partial<PageData>): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from("pages")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating page:", error);
    throw new Error(`Failed to update page: ${error.message}`);
  }
}

/**
 * Deletes a page.
 * @param id The ID of the page to delete.
 * @throws An error if the deletion fails.
 */
export async function deletePage(id: string): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from("pages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting page:", error);
    throw new Error(`Failed to delete page: ${error.message}`);
  }
}