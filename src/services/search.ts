import { createClient } from '@/lib/supabase/server';

export interface SearchResult {
  id: string;
  title: string;
  type: 'Page' | 'Event' | 'Program' | 'Notice';
  url: string;
  snippet: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query) {
    return [];
  }

  const supabase = await createClient();
  const searchPattern = `%${query}%`;

  const [pagesResult, eventsResult, programsResult, noticesResult] = await Promise.all([
    supabase
      .from('pages')
      .select('id, title, slug, meta_description')
      .ilike('title', searchPattern)
      .eq('is_published', true),
    supabase
      .from('events')
      .select('id, title, slug, description')
      .ilike('title', searchPattern)
      .eq('is_published', true),
    supabase
      .from('programs')
      .select('id, name, slug, description')
      .ilike('name', searchPattern)
      .eq('is_published', true),
    supabase
      .from('notices')
      .select('id, title, slug, content')
      .ilike('title', searchPattern)
      .eq('is_published', true)
  ]);

  const searchResults: SearchResult[] = [];

  if (pagesResult.data) {
    pagesResult.data.forEach((item) => {
      searchResults.push({
        id: item.id,
        title: item.title,
        type: 'Page',
        url: `/${item.slug}`,
        snippet: item.meta_description || ''
      });
    });
  }

  if (eventsResult.data) {
    eventsResult.data.forEach((item) => {
      searchResults.push({
        id: item.id,
        title: item.title,
        type: 'Event',
        url: `/events/${item.slug}`,
        snippet: item.description || ''
      });
    });
  }

  if (programsResult.data) {
    programsResult.data.forEach((item) => {
      searchResults.push({
        id: item.id,
        title: item.name,
        type: 'Program',
        url: `/programs/${item.slug}`,
        snippet: item.description || ''
      });
    });
  }

  if (noticesResult.data) {
    noticesResult.data.forEach((item) => {
      searchResults.push({
        id: item.id,
        title: item.title,
        type: 'Notice',
        url: `/notices/${item.slug}`,
        snippet: item.content || ''
      });
    });
  }

  return searchResults;
}