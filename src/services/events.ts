import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export interface EventData {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  image_url: string | null;
  created_at: string;
}

export async function getUpcomingEvents(): Promise<EventData[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch upcoming events: ${error.message}`);
    }

    return (data as EventData[]) || [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while fetching upcoming events.');
  }
}

export async function getAllEvents(): Promise<EventData[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    return (data as EventData[]) || [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while fetching events.');
  }
}

export async function createEvent(
  data: Omit<EventData, 'id' | 'created_at'>
): Promise<EventData> {
  try {
    const supabase = createBrowserClient();
    const { data: createdEvent, error } = await supabase
      .from('events')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }

    return createdEvent as EventData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while creating the event.');
  }
}

export async function updateEvent(
  id: string,
  updates: Partial<EventData>
): Promise<EventData> {
  try {
    const supabase = createBrowserClient();
    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }

    return updatedEvent as EventData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while updating the event.');
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while deleting the event.');
  }
}