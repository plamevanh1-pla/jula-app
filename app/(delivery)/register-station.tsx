import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/config/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterStationScreen() {
  const router = useRouter();
  const [stationName, setStationName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Sénégal');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email || '');
    });
  }, []);

  const handleRegisterStation = async () => {
    if (!stationName || !phone || !city) return Alert.alert("Erreur", "Veuillez remplir tous les champs");
    
    const { error } = await supabase.from('orders').insert([
      { 
        product_name: `🏪 INSCRIPTION POINT RELAIS : ${stationName}`, 
        price_fcfa: 0, 
        delivery_address: `Pays: ${country} | Ville: ${city} | Tél: ${phone} | Gérant: ${userEmail}`, 
        delivery_status: 'En attente' 
      }
    ]);

    if (!error) {
      Alert.alert("Succès 🎉", `Votre Point Relais Jula a été enregistré pour le ${country} !`);
      setStationName(''); setPhone(''); setCity('');
      router.push('/(client)/(tabs)/profile');
    } else {
      Alert.alert("Erreur", "Impossible d'enregistrer le Point Relais.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/profile')}><Ionicons name="arrow-back" size={24} color="#f57c00" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Devenir Point Relais Jula</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.infoText}>Inscrivez votre commerce physique pour devenir un point de collecte de colis Jula et toucher des commissions sur chaque retrait.</Text>

          <TextInput style={styles.input} placeholder="Nom de votre commerce (ex: Épicerie Diallo)" value={stationName} onChangeText={setStationName} />
          <TextInput style={styles.input} placeholder="Numéro de téléphone WhatsApp" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <TextInput style={styles.input} placeholder="Ville et quartier (ex: Abidjan - Cocody)" value={city} onChangeText={setCity} />

          {/* SÉLECTION GÉOGRAPHIQUE DU POINT RELAIS */}
          <Text style={styles.label}>📍 Zone d'activité (Réseau Ouest-Africain) :</Text>
          <View style={styles.grid}>
            {['Sénégal', 'Côte d\'Ivoire', 'Togo', 'Bénin'].map((p) => (
              <TouchableOpacity key={p} style={[styles.gridBtn, country === p && styles.activeBtn]} onPress={() => setCountry(p)}>
                <Text style={[styles.gridText, country === p && styles.activeText]}>{p === 'Côte d\'Ivoire' ? '🇨🇮 RCI' : p === 'Sénégal' ? '🇸🇳 Sénégal' : p === 'Togo' ? '🇹🇬 Togo' : '🇧🇯 Bénin'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.btnSubmit} onPress={handleRegisterStation}>
            <Text style={styles.btnSubmitText}>Valider mon inscription de Point Relais</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  scrollContent: { padding: 16, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#f57c00' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, elevation: 3 },
  infoText: { fontSize: 13, color: '#6c757d', marginBottom: 16, lineHeight: 18 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 12, backgroundColor: '#f8f9fa' },
  label: { fontSize: 12, color: '#6c757d', fontWeight: 'bold', marginBottom: 8 },
  grid: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  gridBtn: { flex: 1, padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', backgroundColor: '#f8f9fa' },
  gridText: { fontSize: 11, fontWeight: '600', color: '#212529' },
  activeBtn: { backgroundColor: '#f57c00', borderColor: '#f57c00' },
  activeText: { color: '#fff' },
  btnSubmit: { backgroundColor: '#25D366', padding: 14, borderRadius: 6, alignItems: 'center' },
  btnSubmitText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
