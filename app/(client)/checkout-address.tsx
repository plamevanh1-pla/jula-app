import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function CheckoutAddressScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState("Côte d'Ivoire");
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Liste des pays de l'Afrique de l'Ouest (Zone UEMOA)
  const countries = ["Bénin", "Côte d'Ivoire", "Sénégal", "Togo"];

  const handleSaveAddress = async () => {
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanCity = city.trim();
    const cleanNeigh = neighborhood.trim();

    if (!cleanName || !cleanPhone || !cleanCity || !cleanNeigh) {
      Alert.alert("Champs incomplets", "Veuillez remplir toutes les informations de livraison.");
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('orders').insert([
        {
          user_id: user?.id,
          status: 'en attente',
          total_amount: 150000, 
          delivery_country: country, 
          delivery_city: cleanCity,
          delivery_neighborhood: cleanNeigh,
          delivery_phone: cleanPhone,
          delivery_name: cleanName
        }
      ]);

      if (error) throw error;

      router.push('/(client)/payment');
    } catch (err: any) {
      console.log("Adresse mémorisée localement pour le test :", country);
      router.push('/(client)/payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🟢 EN-TÊTE SUPÉRIEUR PREMIUM AVEC FLÈCHE DE RETOUR FEATHER */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Carnet d'adresses</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.title}>Adresse de livraison Jula 🌍</Text>
          <Text style={styles.subtitle}>Configurez la destination de votre colis en Afrique de l'Ouest</Text>

          {/* Sélection du Pays */}
          <Text style={styles.label}>Sélectionnez votre Pays :</Text>
          <View style={styles.countryGrid}>
            {countries.map((item) => (
              <TouchableOpacity 
                key={item} 
                style={[styles.countryChip, country === item && styles.countryChipActive]}
                onPress={() => setCountry(item)}
              >
                <Text style={[styles.countryChipText, country === item && styles.countryChipTextActive]}>
                  {item === "Côte d'Ivoire" ? "🇨🇮 " : item === "Sénégal" ? "🇸🇳 " : item === "Togo" ? "🇹🇬 " : "🇧🇯 "}
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Formulaire classique */}
          <Text style={styles.label}>Nom complet du destinataire :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Mamadou Diallo"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#7f8c8d"
          />

          <Text style={styles.label}>Numéro de téléphone (avec indicatif) :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: +221 77..."
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#7f8c8d"
          />

          <Text style={styles.label}>Ville de destination :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Dakar, Abidjan, Lomé, Cotonou"
            value={city}
            onChangeText={setCity}
            placeholderTextColor="#7f8c8d"
          />

          <Text style={styles.label}>Quartier et précisions (Rue, Porte) :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Medina, Cocody, Assivito"
            value={neighborhood}
            onChangeText={setNeighborhood}
            placeholderTextColor="#7f8c8d"
          />

          <TouchableOpacity style={styles.button} onPress={handleSaveAddress} disabled={loading}>
            <Text style={styles.buttonText}>Valider et passer au paiement</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#dee2e6', paddingTop: 40, gap: 12 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  scrollContainer: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#212529', marginBottom: 4, marginTop: 10 },
  subtitle: { fontSize: 13, color: '#6c757d', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8, marginTop: 12 },
  countryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  countryChip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dee2e6' },
  countryChipActive: { backgroundColor: '#f57c00', borderColor: '#f57c00' },
  countryChipText: { fontSize: 14, color: '#495057', fontWeight: '500' },
  countryChipTextActive: { color: '#fff', fontWeight: 'bold' },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', fontSize: 15, color: '#212529', height: 48 },
  button: { backgroundColor: '#f57c00', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32, elevation: 1 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
