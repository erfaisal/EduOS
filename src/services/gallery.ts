import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { uploadFile } from '@/services/storage';

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
}

export type CreateGalleryItemInput = Omit<GalleryItem, 'id' | 'created_at'>;

export async function getGalleryImages(): Promise<GalleryItem[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    return (data as GalleryItem[]) ?? [];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to retrieve gallery images: ${message}`);
  }
}

export async function deleteGalleryImage(id: string, path: string): Promise<void> {
  try {
    const supabase = createBrowserClient();

    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([path]);

    if (storageError) {
      throw new Error(`Storage removal failed: ${storageError.message}`);
    }

    const { error: dbError } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw new Error(`Database record deletion failed: ${dbError.message}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to delete gallery image: ${message}`);
  }
}

export async function uploadToGallery(title: string, file: File): Promise<GalleryItem> {
  try {
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${sanitizedFileName}`;

    const uploadResponse = await uploadFile('gallery', uniqueName, file);
    const publicUrl = typeof uploadResponse === 'string' ? uploadResponse : uploadResponse?.publicUrl;

    if (!publicUrl) {
      throw new Error('Failed to retrieve public URL for uploaded file.');
    }

    const supabase = createBrowserClient();
    const payload: CreateGalleryItemInput = {
      title,
      image_url: publicUrl,
    };

    const { data, error } = await supabase
      .from('gallery')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(`Database insertion failed: ${error.message}`);
    }

    return data as GalleryItem;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Upload to gallery failed: ${message}`);
  }
}