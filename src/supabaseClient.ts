import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjksmzwizmwearwxkdam.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa3Ntendpem13ZWFyd3hrZGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDM0MzUsImV4cCI6MjA4ODIxOTQzNX0.c5K0oHqQH6PLtqGBVnAB27rtBB620N1dY_hGX7pzGgs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
