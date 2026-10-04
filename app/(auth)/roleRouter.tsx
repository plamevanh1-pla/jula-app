 import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function RoleRouterScreen() {
  const router = useRouter();

  useEffect(() => {
    async function aiguillerUtilisateur() {
      try {
        if (!supabase) return;

        // 1. On récupère la session de l'utilisateur connecté
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          // Si pas connecté, retour à la sélection du pays ou login
          router.replace('/');
          return;
        }

        // 2. On interroge la table profiles sur Supabase pour connaître son rôle réel
        const { data: profil, error: profileError } = await supabase
          .from('profiles')
          .select('role, country')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError || !profil) {
          // Si le profil cloud n'existe pas encore, on le crée en mode client par défaut
          const paysChoisi = await AsyncStorage.getItem('jula_pays_choisi') || 'CI';
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            country: paysChoisi,
            role: 'client'
          });
          router.replace('/(client)/(tabs)/home');
          return;
        }

        // 3. PROPULSION CHIRURGICALE SELON LE RÔLE DÉTECTÉ SUR LE CLOUD
        if (profil.role === 'admin') {
          // Jacky est envoyé vers l'Accueil mais avec tous les accès ouverts
          router.replace('/(client)/(tabs)/home');
        } else if (profil.role === 'boutique') {
          // Les grossistes sont redirigés vers l'Accueil en attendant Jula Web
          router.replace('/(client)/(tabs)/home');
        } else {
          // Les clients standards vont directement sur le catalogue
          router.replace('/(client)/(tabs)/home');
        }

      } catch (err) {
        console.error("Erreur aiguillage rôle:", err);
        router.replace('/(client)/(tabs)/home');
      }
    }

    aiguillerUtilisateur();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f57c00" />
      <Text style={styles.loaderText}>Analyse sécurisée de votre profil Jula...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111417', justifyContent: 'center', alignItems: 'center' },
  loaderText: { color: '#fff', marginTop: 14, fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 }
});
