import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export type NoticeType = 'alert' | 'event' | 'general';

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: NoticeType;
  is_active: boolean;
  created_at: string;
}

export interface NoticeData {
  title: string;
  content: string;
  type: NoticeType | string;
  is_active: boolean;
}

export async function getActiveNotices(): Promise<Notice[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to retrieve active notices: ${error.message}`);
    }

    return (data as Notice[]) || [];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new Error(`[getActiveNotices]: ${message}`);
  }
}

export async function getAllNotices(): Promise<Notice[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to retrieve all notices: ${error.message}`);
    }

    return (data as Notice[]) || [];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new Error(`[getAllNotices]: ${message}`);
  }
}

export async function createNotice(data: {
  title: string;
  content: string;
  type: string;
  is_active: boolean;
}): Promise<Notice> {
  try {
    const supabase = createBrowserClient();
    const { data: createdNotice, error } = await supabase
      .from('notices')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create notice: ${error.message}`);
    }

    return createdNotice as Notice;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new Error(`[createNotice]: ${message}`);
  }
}

export async function updateNotice(
  id: string,
  updates: Partial<NoticeData>
): Promise<Notice> {
  try {
    const supabase = createBrowserClient();
    const { data: updatedNotice, error } = await supabase
      .from('notices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update notice: ${error.message}`);
    }

    return updatedNotice as Notice;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new Error(`[updateNotice]: ${message}`);
  }
}

export async function deleteNotice(id: string): Promise<void> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete notice: ${error.message}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new Error(`[deleteNotice]: ${message}`);
  }
}