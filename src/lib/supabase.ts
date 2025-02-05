import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-url.supabase.co'
const supabaseAnonKey = 'your-anon-key'

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