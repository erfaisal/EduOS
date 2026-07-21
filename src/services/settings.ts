import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

/**
 * @typedef {Object} SettingsType
 * @property {number} id - The unique identifier for the settings row (typically 1 for a single-row table).
 * @property {string} institution_name - The name of the institution.
 * @property {string} theme_primary_color - The primary color for the application theme.
 * @property {string} contact_email - General contact email for the institution.
 * @property {string} support_phone - Support phone number for the institution.
 * @property {boolean} registration_open - Whether new user registration is currently open.
 * @property {string} [logo_url] - Optional URL to the institution's logo.
 * @property {string} [favicon_url] - Optional URL to the institution's favicon.
 * @property {string} created_at - Timestamp when the settings were created.
 * @property {string} updated_at - Timestamp when the settings were last updated.
 */
interface SettingsType {
  id: number;
  institution_name: string;
  theme_primary_color: string;
  contact_email: string;
  support_phone: string;
  registration_open: boolean;
  logo_url: string | null;
  favicon_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches the global institution settings from the `institution_settings` table using the server client.
 * Assumes there is only a single row in this table, typically with `id = 1`.
 *
 * @returns {Promise<SettingsType | null>} The settings data or null if an error occurs or no settings are found.
 */
export async function getSettingsServer(): Promise<SettingsType | null> {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from('institution_settings')
      .select('*')
      .single(); // Assuming a single row for settings

    if (error) {
      console.error('getSettingsServer: Error fetching settings:', error.message);
      return null;
    }

    if (!data) {
      console.warn('getSettingsServer: No settings found in the database.');
      return null;
    }

    return data as SettingsType;
  } catch (err) {
    console.error('getSettingsServer: Unexpected error:', err);
    return null;
  }
}

/**
 * Updates the global institution settings in the `institution_settings` table using the browser client.
 * This function should be called from the client-side.
 * Assumes there is only a single row in this table, typically with `id = 1`.
 *
 * @param {Partial<SettingsType>} updates - An object containing the partial settings to update.
 * @returns {Promise<SettingsType>} The updated settings data.
 * @throws {string} A sanitized error message suitable for UI display.
 */
export async function updateSettingsClient(updates: Partial<Omit<SettingsType, 'id' | 'created_at' | 'updated_at'>>): Promise<SettingsType> {
  const supabase = createBrowserClient();

  try {
    // For a single-row settings table, we usually target a specific ID (e.g., 1)
    // or assume it's the only row and use .eq('id', 1).
    // The prompt assumes the table exists and will be updated.
    // We explicitly exclude `id`, `created_at`, `updated_at` from `updates` type
    // as these are usually managed by the database or immutable during update.
    const { data, error } = await supabase
      .from('institution_settings')
      .update({ ...updates, updated_at: new Date().toISOString() }) // Always update `updated_at`
      .eq('id', 1) // Target the single settings row
      .select('*')
      .single();

    if (error) {
      console.error('updateSettingsClient: Error updating settings:', error.message);
      throw 'Failed to update settings. Please try again.';
    }

    if (!data) {
      throw 'Update failed: No settings record found or updated.';
    }

    return data as SettingsType;
  } catch (err: any) {
    console.error('updateSettingsClient: Unexpected error during update:', err);
    if (typeof err === 'string') {
      throw err; // Re-throw the sanitized error message
    }
    throw 'An unexpected error occurred while updating settings.';
  }
}