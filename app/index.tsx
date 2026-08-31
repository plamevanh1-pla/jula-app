import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/config/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeCountryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 📡 MONITEUR DE SESSION INTELLIGENT : Écoute Supabase et évite les conflits
  useEffect(() => {
    async function verifierEtatConnexion() {
      const paysEnregistre = await AsyncStorage.getItem('jula_pays_choisi');
      const { data: { user } } = await supabase.auth.getUser();
      
      // Si l'user est connecté et son pays est déjà stocké, on détruit l'écran pays directement !
      if (user && paysEnregistre) {
        router.dismissAll();
        router.replace('/(client)/(tabs)/home');
      }
    }
    verifierEtatConnexion();

    // Écouteur pour capter le retour de Google Auth
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || session) && session?.user) {
        const paysChoisi = await AsyncStorage.getItem('jula_pays_choisi') || 'CI';
        
        // On synchronise le profil cloud en arrière-plan sans bloquer le tactile
        await supabase.from('profiles').upsert({
          id: session.user.id,
          email: session.user.email,
          country: paysChoisi,
          role: 'client'
        }, { onConflict: 'id' });

        // 🎉 PROPULSION DIRECTE SUR HOME ET SUPPRESSION DES ANCIENS ÉCRANS FANTÔMES
        router.dismissAll();
        router.replace('/(client)/(tabs)/home');
      }
    });

    return () => {
      if (authListener?.subscription) authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSelectCountry = async (countryCode: 'CI' | 'SN' | 'BJ' | 'TG') => {
    try {
      setLoading(true);
      await AsyncStorage.setItem('jula_pays_choisi', countryCode);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Mode invité : redirection directe
        router.dismissAll();
        router.replace('/(client)/(tabs)/home');
        return;
      }

      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        country: countryCode,
        role: 'client'
      }, { onConflict: 'id' });

      router.dismissAll();
      router.replace('/(client)/(tabs)/home');
    } catch (err) {
      router.dismissAll();
      router.replace('/(client)/(tabs)/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logoText}>Jula</Text>
        <Text style={styles.subTitle}>Veuillez sélectionner votre pays de livraison :</Text>
        <Text style={styles.regionTitle}>Zone CFA (XOF)</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#f57c00" style={{ marginVertical: 40 }} />
        ) : (
          <View style={styles.grid}>
            <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('SN')}>
              <Text style={styles.flag}>🇸🇳</Text>
              <Text style={styles.countryName}>Sénégal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('CI')}>
              <Text style={styles.flag}>🇨🇮</Text>
              <Text style={styles.countryName}>Côte d'Ivoire</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('TG')}>
              <Text style={styles.flag}>🇹🇬</Text>
              <Text style={styles.countryName}>Togo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('BJ')}>
              <Text style={styles.flag}>🇧🇯</Text>
              <Text style={styles.countryName}>Bénin</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.footerTxt}>Réseau interconnecté Jula Afrique de l'Ouest</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f57c00', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 12, alignItems: 'center', elevation: 5 },
  logoText: { fontSize: 36, fontWeight: 'bold', color: '#f57c00', marginBottom: 5 },
  subTitle: { fontSize: 15, color: '#495057', textAlign: 'center', marginBottom: 4, fontWeight: '500' },
  regionTitle: { fontSize: 12, color: '#7f8c8d', fontWeight: 'bold', marginBottom: 25, textTransform: 'uppercase' },
  grid: { width: '100%', gap: 12 },
  countryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef' },
  flag: { fontSize: 24, marginRight: 14 },
  countryName: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  footerTxt: { fontSize: 11, color: '#95a5a6', marginTop: 30, fontWeight: '500' }
});