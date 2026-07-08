import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/config/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Champs vides", "Merci de saisir votre identifiant et mot de passe.");
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.user) {
        router.replace('/(client)/(tabs)/profile');
      }
    } catch (err: any) {
      Alert.alert("Échec de connexion", "Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connexion</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>Bienvenue chez Jula</Text>
        <Text style={styles.subTitle}>Connectez-vous pour suivre vos commandes et gérer vos adresses de livraison.</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Adresse e-mail" 
          placeholderTextColor="#95a5a6"
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput 
          style={styles.input} 
          placeholder="Mot de passe" 
          placeholderTextColor="#95a5a6"
          value={password} 
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btnLogin} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnLoginTxt}>Se connecter</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnRegisterLink} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerLinkTxt}>Nouveau sur Jula ? <Text style={{color: '#f57c00', fontWeight: 'bold'}}>Créer un compte</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#f2f2f2', gap: 14, paddingTop: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { padding: 20, paddingTop: 40 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  subTitle: { fontSize: 13, color: '#7f8c8d', marginBottom: 30, lineHeight: 18 },
  input: { borderWidth: 1, borderColor: '#ced4da', padding: 14, borderRadius: 6, marginBottom: 16, fontSize: 15, color: '#212529' },
  btnLogin: { backgroundColor: '#f57c00', padding: 14, borderRadius: 4, alignItems: 'center', marginTop: 10 },
  btnLoginTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  btnRegisterLink: { marginTop: 25, alignItems: 'center' },
  registerLinkTxt: { fontSize: 14, color: '#495057' }
});
