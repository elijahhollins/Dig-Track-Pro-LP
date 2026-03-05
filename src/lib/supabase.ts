import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Robust validation: Check if the string actually looks like a URL
const isUrl = (str: any) => typeof str === 'string' && str.startsWith('http');

const supabaseUrl = isUrl(rawUrl) ? rawUrl : 'https://jjksmzwizmwearwxkdam.supabase.co';
const supabaseAnonKey = (rawKey && !isUrl(rawKey)) ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa3Ntendpem13ZWFyd3hrZGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDM0MzUsImV4cCI6MjA4ODIxOTQzNX0.c5K0oHqQH6PLtqGBVnAB27rtBB620N1dY_hGX7pzGgs';

console.log('Initializing Supabase with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
