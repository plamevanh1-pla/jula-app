 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const router = useRouter();

  const handleLogin = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert("Champs requis", "Veuillez remplir votre e-mail et votre mot de passe.");
      return;
    }

    try {
      setLoading(true);
      if (!supabase) return;

      // 📡 Connexion en direct sur les serveurs d'authentification Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) throw error;

      // 🎉 Succès : Propulsion vers le routeur de rôle pour vérifier si c'est Jacky ou un client
      router.replace('/(auth)/roleRouter');

    } catch (err: any) {
      Alert.alert("Échec de connexion", err.message || "Identifiants incorrects dans la zone CFA.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Bouton de retour discret pour éviter le blocage tactile */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#212529" />
          </TouchableOpacity>

          <View style={styles.headerBlock}>
            <Text style={styles.logoText}>Jula</Text>
            <Text style={styles.title}>Réseau Interconnecté 🌍</Text>
            <Text style={styles.subtitle}>Connectez-vous pour gérer vos achats et votre portefeuille</Text>
          </View>

          {/* Formulaire de Connexion Cloud */}
          <View style={styles.form}>
            <Text style={styles.label}>Adresse e-mail :</Text>
            <View style={styles.inputField}>
              <Feather name="mail" size={18} color="#7f8c8d" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Ex: jacky@jula.com"
                placeholderTextColor="#7f8c8d"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Mot de passe sécurisé :</Text>
            <View style={styles.inputField}>
              <Feather name="lock" size={18} color="#7f8c8d" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor="#7f8c8d"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Feather name={secureText ? "eye-off" : "eye"} size={18} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#f57c00" style={{ marginTop: 24 }} />
            ) : (
              <TouchableOpacity style={styles.btnConnect} onPress={handleLogin}>
                <Text style={styles.btnConnectTxt}>Se connecter en toute sécurité</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.btnRegisterRow} onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerSubTxt}>Nouveau sur Jula ? </Text>
              <Text style={styles.registerLinkTxt}>Créer un compte Zone CFA</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 24, paddingBottom: 40 },
  backButton: { paddingTop: 20, marginBottom: 10, alignSelf: 'flex-start' },
  headerBlock: { alignItems: 'center', marginTop: 10, marginBottom: 30 },
  logoText: { fontSize: 42, fontWeight: 'bold', color: '#f57c00' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginTop: 4 },
  subtitle: { fontSize: 13, color: '#7f8c8d', textAlign: 'center', marginTop: 6, paddingHorizontal: 15, lineHeight: 18 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8, marginTop: 14 },
  inputField: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, paddingHorizontal: 14, height: 48 },
  input: { flex: 1, fontSize: 15, color: '#212529' },
  btnConnect: { backgroundColor: '#f57c00', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 32, elevation: 2 },
  btnConnectTxt: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  btnRegisterRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  registerSubTxt: { fontSize: 13, color: '#7f8c8d' },
  registerLinkTxt: { fontSize: 13, color: '#f57c00', fontWeight: 'bold', textDecorationLine: 'underline' }
});
