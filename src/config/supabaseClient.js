   import AsyncStorage from '@react-native-async-storage/async-storage'; // ✨ Ajout indispensable
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://bgfmnjvhlonrfpfsxefe.supabase.co"; // ⚠️ Laissez votre URL Supabase actuelle entre les guillemets
const supabaseAnonKey = "sb_publishable_W_q0i6GH_dKXr2QFc3xu_Q_EUZzpDMK"; // ⚠️ Laissez votre clé actuelle entre les guillemets

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,       // ✨ Force la sauvegarde de la session sur le téléphone
    autoRefreshToken: true,      // ✨ Actualise automatiquement la session
    persistSession: true,        // ✨ Évite de se déconnecter en fermant l'application
    detectSessionInUrl: false,   // Indispensable pour la production sur mobile
  },
});