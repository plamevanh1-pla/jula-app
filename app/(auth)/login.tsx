 import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  // Génère dynamiquement l'URL de redirection selon l'environnement (Expo Go ou Production)
  const redirectUrl = Linking.createURL('/(auth)/login');

  // Écouteur pour intercepter le retour de l'authentification Google
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const { url } = event;
      if (url && url.includes('access_token')) {
        setLoading(true);
        const params = Linking.parse(url);
        const { access_token, refresh_token } = params.queryParams || {};

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (!error) {
            router.replace('/(client)/(tabs)/home');
          } else {
            Alert.alert("Erreur de session", "Impossible de synchroniser le compte.");
          }
        }
        setLoading(false);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  // 1️⃣ CONNEXION CLASSIQUE EMAIL/PASSWORD
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Champs vides", "Merci de saisir votre identifiant et mot de passe.");
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.user) {
        router.replace('/(client)/(tabs)/home');
      }
    } catch (err) {
      Alert.alert("Échec de connexion", "Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ MOTEUR GOOGLE AUTH CORRIGÉ
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: redirectUrl, 
          skipBrowserRedirect: true 
        }
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        // Si l'utilisateur ferme le navigateur manuellement sans finir
        if (result.type === 'cancel') {
          setLoading(false);
        }
      }
    } catch (err) {
      Alert.alert("❌ Google Auth", "Échec de l'authentification Google.");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(client)/(tabs)/profile')}>
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

        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.passwordInput} 
            placeholder="Mot de passe" 
            placeholderTextColor="#95a5a6"
            value={password} 
            onChangeText={setPassword}
            secureTextEntry={secureText}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setSecureText(!secureText)}>
            <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color="#7f8c8d" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnLogin} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnLoginTxt}>Se connecter</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnGoogle} onPress={handleGoogleLogin} disabled={loading}>
          <View style={styles.googleContentRow}>
            <Ionicons name="logo-google" size={18} color="#ea4335" />
            <Text style={styles.btnGoogleTxt}>S'identifier avec Google</Text>
          </View>
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
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ced4da', borderRadius: 6, marginBottom: 16, backgroundColor: '#fff' },
  passwordInput: { flex: 1, padding: 14, fontSize: 15, color: '#212529' },
  eyeIcon: { paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center' },
  btnLogin: { backgroundColor: '#f57c00', padding: 14, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  btnLoginTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  btnGoogle: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dadce0', padding: 14, borderRadius: 25, alignItems: 'center', marginTop: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  googleContentRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btnGoogleTxt: { color: '#3c4043', fontWeight: 'bold', fontSize: 15 },
  btnRegisterLink: { marginTop: 25, alignItems: 'center' },
  registerLinkTxt: { fontSize: 14, color: '#495057' }
});