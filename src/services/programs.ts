import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export interface ProgramData {
  id: string;
  name: string;
  slug: string;
  department: string;
  duration: string;
  tuition_fee: string;
  description: string;
  created_at: string;
}

export async function getPrograms(): Promise<ProgramData[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to retrieve programs: ${error.message}`);
    }

    return (data as ProgramData[]) || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while fetching programs.');
  }
}

export async function getProgramBySlug(slug: string): Promise<ProgramData | null> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to retrieve program: ${error.message}`);
    }

    return (data as ProgramData) || null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while fetching the program.');
  }
}

export async function createProgram(
  data: Omit<ProgramData, 'id' | 'created_at'>
): Promise<ProgramData> {
  try {
    const supabase = createBrowserClient();
    const { data: createdData, error } = await supabase
      .from('programs')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create program: ${error.message}`);
    }

    return createdData as ProgramData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while creating the program.');
  }
}

export async function updateProgram(
  id: string,
  updates: Partial<ProgramData>
): Promise<ProgramData> {
  try {
    const supabase = createBrowserClient();
    const { data: updatedData, error } = await supabase
      .from('programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update program: ${error.message}`);
    }

    return updatedData as ProgramData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while updating the program.');
  }
}

export async function deleteProgram(id: string): Promise<void> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete program: ${error.message}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while deleting the program.');
  }
}