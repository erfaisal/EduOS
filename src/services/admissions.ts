import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';

export type AdmissionStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface Admission {
  id: string;
  applicant_name: string;
  email: string;
  phone: string;
  program_of_interest: string;
  status: AdmissionStatus;
  created_at: string;
}

export async function submitApplication(data: {
  applicant_name: string;
  email: string;
  phone: string;
  program_of_interest: string;
}): Promise<boolean> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase.from('admissions').insert([
      {
        applicant_name: data.applicant_name,
        email: data.email,
        phone: data.phone,
        program_of_interest: data.program_of_interest,
        status: 'pending',
      },
    ]);

    if (error) {
      throw new Error('Failed to submit application.');
    }

    return true;
  } catch (error) {
    if (error instanceof Error && error.message === 'Failed to submit application.') {
      throw error;
    }
    throw new Error('An unexpected error occurred while processing your request.');
  }
}

export async function getAdmissions(): Promise<Admission[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('admissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch admissions data.');
  }

  return (data as Admission[]) || [];
}

export async function updateAdmissionStatus(
  id: string,
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
): Promise<boolean> {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from('admissions')
    .update({ status })
    .eq('id', id);

  if (error) {
    throw new Error('Failed to update admission status.');
  }

  return true;
}

export async function deleteAdmission(id: string): Promise<boolean> {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from('admissions')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Failed to delete admission application.');
  }

  return true;
}