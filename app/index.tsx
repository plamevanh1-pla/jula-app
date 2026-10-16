   import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../src/config/supabaseClient';

// Liste officielle des 6 pays de l'empire Jula Express (Wave actif uniquement sur CI, SN, ML, BF)
const countries = [
  { code: 'CI', name: 'Côte d’Ivoire', flag: '🇨🇮', currency: 'XOF', hasWave: true },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', currency: 'XOF', hasWave: true },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', currency: 'XOF', hasWave: true },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', currency: 'XOF', hasWave: true },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', currency: 'XOF', hasWave: false },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', currency: 'XOF', hasWave: false },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', currency: 'XOF', hasWave: false },
];

export default function WelcomeCountryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function verifierEtatConnexion() {
      const paysEnregistre = await AsyncStorage.getItem('jula_pays_choisi');
      const { data: { user } } = await supabase.auth.getUser();
      if (user && paysEnregistre) {
        router.replace('/(client)/(tabs)/home');
      }
    }
    verifierEtatConnexion();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || session) && session?.user) {
        const paysChoisi = await AsyncStorage.getItem('jula_pays_choisi') || 'CI';
        await supabase.from('profiles').upsert({
          id: session.user.id,
          email: session.user.email,
          country: paysChoisi,
          role: 'client'
        }, { onConflict: 'id' });
        router.replace('/(client)/(tabs)/home');
      }
    });

    return () => {
      if (authListener?.subscription) authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSelectCountry = async (countryCode: 'CI' | 'SN' | 'ML' | 'BF' | 'BJ' | 'TG' | 'NE') => {
    try {
      setLoading(true);
      await AsyncStorage.setItem('jula_pays_choisi', countryCode);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/(client)/(tabs)/home');
        return;
      }

      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        country: countryCode,
        role: 'client'
      }, { onConflict: 'id' });

      router.replace('/(client)/(tabs)/home');
    } catch (err) {
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
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {countries.map((country) => (
                <TouchableOpacity 
                  key={country.code} 
                  style={styles.countryBtn} 
                  onPress={() => handleSelectCountry(country.code as any)}
                >
                  <Text style={styles.flag}>{country.flag}</Text>
                  <View style={styles.countryInfo}>
                    <Text style={styles.countryName}>{country.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
        <Text style={styles.footerTxt}>Réseau interconnecté Jula Afrique de l'Ouest</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f57c00', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 12, alignItems: 'center', elevation: 5, maxHeight: '90%' },
  logoText: { fontSize: 36, fontWeight: 'bold', color: '#f57c00', marginBottom: 5 },
  subTitle: { fontSize: 15, color: '#495057', textAlign: 'center', marginBottom: 4, fontWeight: '500' },
  regionTitle: { fontSize: 12, color: '#7f8c8d', fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase' },
  scrollView: { width: '100%', maxHeight: 380 },
  grid: { width: '100%', gap: 10, paddingBottom: 5 },
  countryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef' },
  flag: { fontSize: 28, marginRight: 14 },
  countryInfo: { flex: 1, justifyContent: 'center' },
  countryName: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  footerTxt: { fontSize: 11, color: '#95a5a6', marginTop: 20, fontWeight: '500' }
});
