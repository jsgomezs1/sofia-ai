import { createClient } from '@supabase/supabase-js';

// Database Types
export interface Tech {
  id: number;
  created_at: string;
  name: string | null;
}

export interface Database {
  public: {
    Tables: {
      tech: {
        Row: Tech;
        Insert: Omit<Tech, 'id' | 'created_at'>;
        Update: Partial<Omit<Tech, 'id' | 'created_at'>>;
      };
    };
  };
}

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

