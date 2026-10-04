import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const router = useRouter();

  const handleRegister = async () => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanPassword) {
      Alert.alert("Champs requis", "Veuillez remplir toutes les informations d'inscription.");
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert("Mot de passe faible", "Votre mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      setLoading(true);
      if (!supabase) return;

      // 📡 1. Création de l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (authError) throw authError;

      if (authData?.user) {
        // 🌍 Récupération du pays mémorisé sur le mobile
        const paysChoisi = await AsyncStorage.getItem('jula_pays_choisi') || 'CI';

        // 📡 2. Insertion automatique du profil sécurisé en mode "client"
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: authData.user.id,
            email: cleanEmail,
            full_name: cleanName,
            phone: cleanPhone,
            country: paysChoisi,
            role: 'client', // Sécurité : tout le monde est client au départ
            is_verified: false
          }
        ]);

        if (profileError) throw profileError;

        // 📡 3. Création automatique de son portefeuille cloud Jula
        await supabase.from('wallets').insert([
          {
            user_id: authData.user.id,
            balance_fcfa: 0
          }
        ]);

        Alert.alert("🎉 Compte créé !", "Votre compte Jula Zone CFA a été configuré avec succès.", [
          { text: "Continuer", onPress: () => router.replace('/(auth)/roleRouter') }
        ]);
      }

    } catch (err: any) {
      Alert.alert("Échec de l'inscription", err.message || "Impossible de créer le compte cloud.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#212529" />
          </TouchableOpacity>

          <View style={styles.headerBlock}>
            <Text style={styles.title}>Créer un compte Jula 🌍</Text>
            <Text style={styles.subtitle}>Rejoignez le premier réseau interconnecté des grossistes de la zone CFA</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nom et prénom complet :</Text>
            <View style={styles.inputField}>
              <Feather name="user" size={18} color="#7f8c8d" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Mamadou Diallo"
                placeholderTextColor="#7f8c8d"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <Text style={styles.label}>Adresse e-mail :</Text>
            <View style={styles.inputField}>
              <Feather name="mail" size={18} color="#7f8c8d" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Ex: diallo@jula.com"
                placeholderTextColor="#7f8c8d"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Numéro WhatsApp (avec indicatif) :</Text>
            <View style={styles.inputField}>
              <Feather name="phone" size={18} color="#7f8c8d" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Ex: +225 05..."
                placeholderTextColor="#7f8c8d"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.label}>Créer un mot de passe (6 caractères min) :</Text>
            <View style={styles.inputField}>
              <Feather name="lock" size={18} color="#7f8c8d" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Choisissez un mot de passe"
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
              <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
                <Text style={styles.btnRegisterTxt}>S'inscrire et ouvrir mon portefeuille</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.btnRow} onPress={() => router.back()}>
              <Text style={styles.loginSubTxt}>Déjà inscrit ? </Text>
              <Text style={styles.loginLinkTxt}>Se connecter</Text>
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
  headerBlock: { alignItems: 'flex-start', marginTop: 10, marginBottom: 25 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#212529' },
  subtitle: { fontSize: 13, color: '#7f8c8d', marginTop: 6, lineHeight: 18 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8, marginTop: 14 },
  inputField: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, paddingHorizontal: 14, height: 48 },
  input: { flex: 1, fontSize: 15, color: '#212529' },
  btnRegister: { backgroundColor: '#f57c00', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 32, elevation: 2 },
  btnRegisterTxt: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  btnRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  loginSubTxt: { fontSize: 13, color: '#7f8c8d' },
  loginLinkTxt: { fontSize: 13, color: '#f57c00', fontWeight: 'bold', textDecorationLine: 'underline' }
});
