import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer ou créer le profil à la volée (Idéal pour Google Auth)
  const fetchProfile = async (currentUser) => {
    if (!currentUser) return;
    try {
      // 1. On tente de lire la ligne existante
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setProfile(data);
        return;
      }

      // 2. 🛡️ SÉCURITÉ INTÉGRÉE : Si la ligne n'existe pas (Erreur ou Google Auth), on la crée instantanément !
      const newProfile = {
        id: currentUser.id,
        email: currentUser.email,
        country: 'CI', // Côte d'Ivoire par défaut
        role: 'client'
      };

      const { data: insertedData, error: insertError } = await supabase
        .from('profiles')
        .upsert(newProfile, { onConflict: 'id' })
        .select()
        .single();

      if (!insertError && insertedData) {
        setProfile(insertedData);
      } else {
        // En cas de micro-coupure, on met un profil temporaire pour ne pas bloquer l'écran tactile
        setProfile(newProfile);
      }

    } catch (err) {
      console.log("Repli métadonnées profil sécurisé.");
    }
  };

  useEffect(() => {
    setLoading(true);

    // 1. Vérification de la session au démarrage de Jula
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchProfile(currentUser);
      }
      setLoading(false);
    });

    // 2. Écoute des changements d'état (connexion/déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);