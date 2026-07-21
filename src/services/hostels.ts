import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export interface HostelData {
  id: string;
  name: string;
  type: 'Boys' | 'Girls' | 'Faculty';
  capacity: number;
  warden_name: string;
  contact_number: string;
  facilities: string;
  created_at?: string;
}

export async function getHostels(): Promise<HostelData[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('hostels')
      .select('*')
      .order('type', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data as HostelData[]) || [];
  } catch (error: any) {
    throw new Error(error.message || 'Unable to fetch hostels. Please try again.');
  }
}

export async function createHostel(
  data: Omit<HostelData, 'id' | 'created_at'>
): Promise<HostelData> {
  try {
    const supabase = createBrowserClient();
    const { data: newHostel, error } = await supabase
      .from('hostels')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return newHostel as HostelData;
  } catch (error: any) {
    throw new Error(error.message || 'Unable to create hostel record. Please check your inputs.');
  }
}

export async function updateHostel(
  id: string,
  updates: Partial<HostelData>
): Promise<HostelData> {
  try {
    const supabase = createBrowserClient();
    const { data: updatedHostel, error } = await supabase
      .from('hostels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return updatedHostel as HostelData;
  } catch (error: any) {
    throw new Error(error.message || 'Unable to update hostel record. Please try again.');
  }
}

export async function deleteHostel(id: string): Promise<void> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('hostels')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    throw new Error(error.message || 'Unable to delete hostel record. Please try again.');
  }
}