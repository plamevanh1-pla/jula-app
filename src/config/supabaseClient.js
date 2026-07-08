  import { createClient } from '@supabase/supabase-js';

const supabaseUrl =  "https://bgfmnjvhlonrfpfsxefe.supabase.co"; 
const supabaseAnonKey = "sb_publishable_W_q0i6GH_dKXr2QFc3xu_Q_EUZzpDMK";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);