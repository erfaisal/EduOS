import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export interface DepartmentData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  head_of_department: string | null;
  created_at: string;
}

// --- Part 1: Read Operations ---

export async function getDepartments(): Promise<DepartmentData[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to retrieve departments: ${error.message}`);
    }

    return (data as DepartmentData[]) || [];
  } catch (error: any) {
    throw new Error(error.message || 'An unexpected error occurred while fetching departments.');
  }
}

export async function getDepartmentBySlug(slug: string): Promise<DepartmentData | null> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to retrieve department: ${error.message}`);
    }

    return (data as DepartmentData) || null;
  } catch (error: any) {
    throw new Error(error.message || 'An unexpected error occurred while fetching the department.');
  }
}

// --- Part 2: Write Operations ---

export async function createDepartment(data: {
  name: string;
  slug: string;
  description: string;
  head_of_department: string;
}): Promise<DepartmentData> {
  try {
    const supabase = createBrowserClient();
    const { data: created, error } = await supabase
      .from('departments')
      .insert([data])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('A department with this slug already exists.');
      }
      throw new Error(`Failed to create department: ${error.message}`);
    }

    return created as DepartmentData;
  } catch (error: any) {
    throw new Error(error.message || 'An unexpected error occurred while creating the department.');
  }
}

export async function updateDepartment(
  id: string,
  updates: Partial<DepartmentData>
): Promise<DepartmentData> {
  try {
    const supabase = createBrowserClient();
    const { data: updated, error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('A department with this slug already exists.');
      }
      throw new Error(`Failed to update department: ${error.message}`);
    }

    return updated as DepartmentData;
  } catch (error: any) {
    throw new Error(error.message || 'An unexpected error occurred while updating the department.');
  }
}

export async function deleteDepartment(id: string): Promise<void> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete department: ${error.message}`);
    }
  } catch (error: any) {
    throw new Error(error.message || 'An unexpected error occurred while deleting the department.');
  }
}