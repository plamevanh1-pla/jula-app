import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeCountryScreen() {
  const router = useRouter();

  const handleSelectCountry = (countryName: string) => {
    // On enregistre le choix et on redirige directement vers l'accueil acheteur
    router.replace('/(client)/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logoText}>Jula</Text>
        <Text style={styles.subTitle}>Veuillez sélectionner votre pays de livraison :</Text>
        <Text style={styles.regionTitle}>Zone CFA (XOF)</Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('Senegal')}>
            <Text style={styles.flag}>🇸🇳</Text>
            <Text style={styles.countryName}>Sénégal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('RCI')}>
            <Text style={styles.flag}>🇨🇮</Text>
            <Text style={styles.countryName}>Côte d'Ivoire</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('Togo')}>
            <Text style={styles.flag}>🇹🇬</Text>
            <Text style={styles.countryName}>Togo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.countryBtn} onPress={() => handleSelectCountry('Benin')}>
            <Text style={styles.flag}>🇧🇯</Text>
            <Text style={styles.countryName}>Bénin</Text>
          </TouchableOpacity>
        </View>
        
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
