  import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../src/config/supabaseClient';

export default function WelcomeCountryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 📡 MONITEUR DE SESSION INTELLIGENT : Écoute Supabase et évite les conflits
  useEffect(() => {
    async function verifierEtatConnexion() {
      const paysEnregistre = await AsyncStorage.getItem('jula_pays_choisi');
      const { data: { user } } = await supabase.auth.getUser();
      
      // ✨ CORRIGÉ : Propulsion directe et sécurisée sans l'historique fantôme
      if (user && paysEnregistre) {
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

        // 🎉 PROPULSION DIRECTE SUR HOME ET SUPPRESSION DES ANCIENS ÉCRANS
        router.replace('/(client)/(tabs)/home');
      }
    });

    return () => {
      if (authListener?.subscription) authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSelectCountry = async (countryCode: 'CI' | 'SN' | 'BJ' | 'TG' | 'ML' | 'BF' | 'NE') => {
    try {
      setLoading(true);
      await AsyncStorage.setItem('jula_pays_choisi', countryCode);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Mode invité : redirection directe vers l'accueil
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
              {/* Côte d'Ivoire */}
              <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('CI')}>
                <Text style={styles.flag}>🇨🇮</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>Côte d'Ivoire</Text>
                  <Text style={styles.badgeWave}>💙 Wave & Livraison</Text>
                </View>
              </TouchableOpacity>

              {/* Sénégal */}
              <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('SN')}>
                <Text style={styles.flag}>🇸🇳</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>Sénégal</Text>
                  <Text style={styles.badgeWave}>💙 Wave & Livraison</Text>
                </View>
              </TouchableOpacity>

              {/* Mali */}
              <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('ML')}>
                <Text style={styles.flag}>🇲🇱</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>Mali</Text>
                  <Text style={styles.badgeWave}>💙 Wave & Livraison</Text>
                </View>
              </TouchableOpacity>

              {/* Burkina Faso */}
              <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('BF')}>
                <Text style={styles.flag}>🇧🇫</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>Burkina Faso</Text>
                  <Text style={styles.badgeWave}>💙 Wave & Livraison</Text>
                </View>
              </TouchableOpacity>

              {/* Bénin */}
              <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('BJ')}>
                <Text style={styles.flag}>🇧🇯</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>Bénin</Text>
                  <Text style={styles.badgeWave}>💙 Wave & Livraison</Text>
                </View>
              </TouchableOpacity>

              {/* Togo */}
              <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('TG')}>
                <Text style={styles.flag}>🇹🇬</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>Togo</Text>
                  <Text style={styles.badgeCash}>💵 Cash / Mobile local à la livraison</Text>
                </View>
              </TouchableOpacity>

              {/* Niger */}
              <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('NE')}>
                <Text style={styles.flag}>🇳🇪</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>Niger</Text>
                  <Text style={styles.badgeCash}>💵 Cash / Mobile local à la livraison</Text>
                </View>
              </TouchableOpacity>
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
  countryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef' },
  flag: { fontSize: 28, marginRight: 14 },
  countryInfo: { flex: 1, flexDirection: 'column' },
  countryName: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  badgeWave: { fontSize: 11, color: '#0288D1', fontWeight: '600', marginTop: 2 },
  badgeCash: { fontSize: 11, color: '#2E7D32', fontWeight: '600', marginTop: 2 },
  footerTxt: { fontSize: 11, color: '#95a5a6', marginTop: 20, fontWeight: '500' }
});
