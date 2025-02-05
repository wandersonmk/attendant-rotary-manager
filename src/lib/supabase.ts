import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required. Please add it to your .env file')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required. Please add it to your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Manager = {
  id: string
  name: string
  email: string
  store: string
  status: 'Ativo' | 'Inativo'
  created_at: string
}

export type User = {
  id: string
  email: string
  role: 'super_admin' | 'manager' | 'seller'
}