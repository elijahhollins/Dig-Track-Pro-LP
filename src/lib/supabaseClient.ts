import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type IndustryType = 'excavation' | 'utility' | 'sitework' | 'boring' | 'other';
export type RequestType = 'Talk to an Expert' | 'Start Your Free Trial';

export interface LeadInsert {
  full_name: string;
  business_name: string;
  email: string;
  phone: string;
  industry: IndustryType;
  request_type: RequestType;
}

export async function insertLead(lead: LeadInsert): Promise<void> {
  const { error } = await supabase.from('leads').insert(lead);
  if (error) {
    throw error;
  }
}
