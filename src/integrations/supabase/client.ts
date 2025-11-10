// Este arquivo é automaticamente gerado. Não o edite diretamente.
import { createClient } from '@supabase/supabase-js';

// Usando variáveis de ambiente VITE para suportar desenvolvimento e produção (Vercel)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ltdejyjghlyervvcqijz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZGVqeWpnaGx5ZXJ2dmNxaWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzYzNDIsImV4cCI6MjA3ODM1MjM0Mn0.RUr2fhAkVnYnFknVSWGTLNWyBBiasXUVAiNU1-0XnEU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);