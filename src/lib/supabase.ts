import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase URL and anon key from your project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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