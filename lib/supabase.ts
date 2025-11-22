import { createClient } from '@supabase/supabase-js';

// Database Types
export interface Tech {
  id: number;
  created_at: string;
  name: string | null;
}

export interface User {
  id: number;
  name: string;
  phone_number: string;
}

export interface Database {
  public: {
    Tables: {
      tech: {
        Row: Tech;
        Insert: Omit<Tech, 'id' | 'created_at'>;
        Update: Partial<Omit<Tech, 'id' | 'created_at'>>;
      };
      user: {
        Row: User;
        Insert: Omit<User, 'id'>;
        Update: Partial<Omit<User, 'id'>>;
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

