import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export interface LibraryResourceData {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  resource_type: 'Physical Book' | 'E-Book' | 'Journal';
  availability_status: boolean;
  created_at: string;
}

export async function getLibraryResources(): Promise<LibraryResourceData[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('library_resources')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch library resources: ${error.message}`);
    }

    return (data as LibraryResourceData[]) || [];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred while fetching library resources.';
    throw new Error(message);
  }
}

export async function createLibraryResource(
  data: Omit<LibraryResourceData, 'id' | 'created_at'>
): Promise<LibraryResourceData> {
  try {
    const supabase = createBrowserClient();
    const { data: result, error } = await supabase
      .from('library_resources')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create library resource: ${error.message}`);
    }

    return result as LibraryResourceData;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred while creating the library resource.';
    throw new Error(message);
  }
}

export async function updateLibraryResource(
  id: string,
  updates: Partial<LibraryResourceData>
): Promise<LibraryResourceData> {
  try {
    const supabase = createBrowserClient();
    const { data: result, error } = await supabase
      .from('library_resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update library resource: ${error.message}`);
    }

    return result as LibraryResourceData;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred while updating the library resource.';
    throw new Error(message);
  }
}

export async function deleteLibraryResource(id: string): Promise<void> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('library_resources')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete library resource: ${error.message}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred while deleting the library resource.';
    throw new Error(message);
  }
}