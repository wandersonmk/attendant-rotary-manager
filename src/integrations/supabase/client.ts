// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ugtfvzhwxqcqpruqdyru.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndGZ2emh3eHFjcXBydXFkeXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzQ0MjcsImV4cCI6MjA1NDI1MDQyN30.qM9Ft-fZt0j-ISETh4jG1u3Pq8mhIqDTwMksES_cpa4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);