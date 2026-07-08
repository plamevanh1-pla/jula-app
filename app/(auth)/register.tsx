import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/config/supabaseClient';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Senegal'); 
  
  // 🟢 SÉCURITÉ : Bloqué sur 'client' pour l'application acheteur classique
  const role = 'client'; 

  const handleRegister = async () => {
    if (!email || !password) {
      return Alert.alert("Erreur", "Veuillez remplir tous les champs");
    }
    
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      return Alert.alert("Erreur Inscription", error.message);
    }
    
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: data.user.id, email: email, role: role, country: country, is_verified: true }
      ]);

      if (!profileError) {
        Alert.alert("Succès 🎉", "Votre compte acheteur Jula a été créé ! Connectez-vous.");
        router.push('/(auth)/login');
      } else {
        Alert.alert("Erreur Profil", "Compte créé mais échec de la liaison avec la base de données.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Créer mon compte Jula</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Votre adresse e-mail" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address" 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Votre mot de passe" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />
          
          <Text style={styles.label}>📍 Sélectionnez votre Pays d'achat (Zone CFA) :</Text>
          {/* 🟢 CORRECTIF : Utilisation de View au lieu de div pour éviter l'écran vide */}
          <View style={styles.grid}>
            <TouchableOpacity 
              style={[styles.gridBtn, country === 'Senegal' ? styles.activeCountry : null]} 
              onPress={() => setCountry('Senegal')}
            >
              <Text style={[styles.gridText, country === 'Senegal' ? styles.activeText : null]}>🇸🇳 Sénégal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.gridBtn, country === 'RCI' ? styles.activeCountry : null]} 
              onPress={() => setCountry('RCI')}
            >
              <Text style={[styles.gridText, country === 'RCI' ? styles.activeText : null]}>🇨🇮 Côte d'Ivoire</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.gridBtn, country === 'Togo' ? styles.activeCountry : null]} 
              onPress={() => setCountry('Togo')}
            >
              <Text style={[styles.gridText, country === 'Togo' ? styles.activeText : null]}>🇹🇬 Togo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.gridBtn, country === 'Benin' ? styles.activeCountry : null]} 
              onPress={() => setCountry('Benin')}
            >
              <Text style={[styles.gridText, country === 'Benin' ? styles.activeText : null]}>🇧🇯 Bénin</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
            <Text style={styles.btnRegisterText}>Valider mon inscription Acheteur</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 4 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#f57c00', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 12 },
  label: { fontSize: 13, color: '#6c757d', fontWeight: 'bold', marginBottom: 8, marginTop: 4 },
  grid: { flexDirection: 'row', gap: 6, marginBottom: 25, flexWrap: 'wrap' },
  gridBtn: { flex: 1, minWidth: '22%', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', backgroundColor: '#f8f9fa' },
  gridText: { fontSize: 11, fontWeight: '600', color: '#212529' },
  activeCountry: { backgroundColor: '#f57c00', borderColor: '#f57c00' },
  activeText: { color: '#fff' },
  btnRegister: { backgroundColor: '#f57c00', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  btnRegisterText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
