
import { createClient } from './supabase/client';

export async function getStoreId(slug: string): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching store:', error);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error('Unexpected error fetching store:', err);
    return null;
  }
}
