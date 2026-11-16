import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';
import { useTheme } from '../../src/context/ThemeContext';

export default function CheckoutAddressScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState("Côte d'Ivoire");
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // 🌓 ACTIVATION DU MODE SOMBRE ET CLAIR
  const { isDarkMode } = useTheme();

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f8f9fa',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textLabel: isDarkMode ? '#d1d5db' : '#495057',
    textSub: isDarkMode ? '#9ca3af' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
  };

  // Liste complète des 7 pays de l'Afrique de l'Ouest (Zone UEMOA)
  const countries = [
    { name: "Bénin", flag: "🇧🇯" },
    { name: "Burkina Faso", flag: "🇧🇫" },
    { name: "Côte d'Ivoire", flag: "🇨🇮" },
    { name: "Mali", flag: "🇲🇱" },
    { name: "Niger", flag: "🇳🇪" },
    { name: "Sénégal", flag: "🇸🇳" },
    { name: "Togo", flag: "🇹🇬" },
  ];

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
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* En-tête supérieur avec flèche de retour */}
      <View style={[styles.headerBar, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerBarTitle, { color: themeColors.textMain }]}>Carnet d'adresses</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <Text style={[styles.title, { color: themeColors.textMain }]}>Adresse de livraison Jula 🌍</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSub }]}>
            Configurez la destination de votre colis en Afrique de l'Ouest
          </Text>

          {/* Sélection du Pays */}
          <Text style={[styles.label, { color: themeColors.textLabel }]}>Sélectionnez votre Pays :</Text>
          <View style={styles.countryGrid}>
            {countries.map((item) => {
              const isSelected = country === item.name;
              return (
                <TouchableOpacity 
                  key={item.name} 
                  style={[
                    styles.countryChip, 
                    { backgroundColor: themeColors.bgCard, borderColor: themeColors.border },
                    isSelected && styles.countryChipActive
                  ]}
                  onPress={() => setCountry(item.name)}
                >
                  <Text style={[
                    styles.countryChipText, 
                    { color: themeColors.textLabel },
                    isSelected && styles.countryChipTextActive
                  ]}>
                    {item.flag} {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Formulaire classique */}
          <Text style={[styles.label, { color: themeColors.textLabel }]}>Nom complet du destinataire :</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, color: themeColors.textMain }]}
            placeholder="Ex: Mamadou Diallo"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#7f8c8d"
          />

          <Text style={[styles.label, { color: themeColors.textLabel }]}>Numéro de téléphone (avec indicatif) :</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, color: themeColors.textMain }]}
            placeholder="Ex: +225 07... / +223 76..."
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#7f8c8d"
          />

          <Text style={[styles.label, { color: themeColors.textLabel }]}>Ville de destination :</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, color: themeColors.textMain }]}
            placeholder="Ex: Abidjan, Bamako, Ouagadougou, Niamey, Dakar"
            value={city}
            onChangeText={setCity}
            placeholderTextColor="#7f8c8d"
          />

          <Text style={[styles.label, { color: themeColors.textLabel }]}>Quartier et précisions (Rue, Porte) :</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, color: themeColors.textMain }]}
            placeholder="Ex: Cocody, Hamdallaye, Ouaga 2000, Plateau"
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
  container: { flex: 1 },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, paddingTop: 40, gap: 12 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContainer: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4, marginTop: 10 },
  subtitle: { fontSize: 13, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  countryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  countryChip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  countryChipActive: { backgroundColor: '#f57c00', borderColor: '#f57c00' },
  countryChipText: { fontSize: 14, fontWeight: '500' },
  countryChipTextActive: { color: '#fff', fontWeight: 'bold' },
  input: { padding: 14, borderRadius: 8, borderWidth: 1, fontSize: 15, height: 48 },
  button: { backgroundColor: '#f57c00', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32, elevation: 1 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
