import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export interface PlacementData {
  id: string;
  student_name: string;
  company_name: string;
  package_lpa: number;
  role: string;
  batch_year: number;
  created_at: string;
}

export async function getPlacements(): Promise<PlacementData[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('placements')
      .select('*')
      .order('batch_year', { ascending: false })
      .order('package_lpa', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data as PlacementData[]) || [];
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new Error(`Failed to fetch placements: ${message.replace(/[^\w\s.-]/gi, '')}`);
  }
}

export async function getPlacementStats(): Promise<{ totalOffers: number; highestPackage: number }> {
  try {
    const supabase = await createServerClient();

    const { count, error: countError } = await supabase
      .from('placements')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(countError.message);
    }

    const { data: topPlacement, error: topError } = await supabase
      .from('placements')
      .select('package_lpa')
      .order('package_lpa', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (topError) {
      throw new Error(topError.message);
    }

    return {
      totalOffers: count || 0,
      highestPackage: topPlacement?.package_lpa ? Number(topPlacement.package_lpa) : 0,
    };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new Error(`Failed to fetch placement statistics: ${message.replace(/[^\w\s.-]/gi, '')}`);
  }
}

export async function createPlacement(data: Omit<PlacementData, 'id' | 'created_at'>): Promise<PlacementData> {
  try {
    const supabase = createBrowserClient();
    const { data: created, error } = await supabase
      .from('placements')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return created as PlacementData;
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new Error(`Failed to create placement record: ${message.replace(/[^\w\s.-]/gi, '')}`);
  }
}

export async function updatePlacement(id: string, updates: Partial<PlacementData>): Promise<PlacementData> {
  try {
    const supabase = createBrowserClient();
    const { data: updated, error } = await supabase
      .from('placements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return updated as PlacementData;
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new Error(`Failed to update placement record: ${message.replace(/[^\w\s.-]/gi, '')}`);
  }
}

export async function deletePlacement(id: string): Promise<void> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('placements')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new Error(`Failed to delete placement record: ${message.replace(/[^\w\s.-]/gi, '')}`);
  }
}