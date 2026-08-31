import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
// 🟢 CHEMIN RELATIF ADAPTÉ POUR LE DOSSIER (AUTH) : ON REMONTE BIEN DE DEUX NIVEAUX !
import { supabase } from '../../src/config/supabaseClient'; 
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ⚡ MOTEUR D'INSCRIPTION ULTRA-FLUIDE CONNECTÉ EN DIRECT À TON SUPABASE
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      return Alert.alert("Champs vides", "Merci de remplir toutes les cases du formulaire.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Sécurité", "Les deux mots de passe ne correspondent pas.");
    }
    if (password.length < 6) {
      return Alert.alert("Sécurité", "Votre mot de passe doit contenir au moins 6 caractères.");
    }

    try {
      setLoading(true);
      
      // 📡 Signal de création envoyé au cloud Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      if (data.user) {
        Alert.alert(
          "🎉 Bienvenue chez Jula", 
          "Votre compte Jula Network a été créé avec succès !",
          [
            { 
              text: "Découvrir Jula", 
              onPress: () => {
                // 🟢 RECONEXION CHIRURGICALE : On le propulse directement sur l'écran des pays sans fermer l'appli !
                router.replace('/(auth)/login');
              } 
            }
          ]
        );
      }
    } catch (err: any) {
      Alert.alert("❌ Échec de l'inscription", err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* BARRE SUPÉRIEURE DE NAVIGATION */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <Ionicons name="arrow-back" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un compte</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>Rejoignez Jula</Text>
        <Text style={styles.subTitle}>Inscrivez-vous gratuitement pour commander en gros et suivre vos livraisons.</Text>

        {/* INPUT E-MAIL */}
        <TextInput 
          style={styles.input} 
          placeholder="Adresse e-mail" 
          placeholderTextColor="#95a5a6"
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* INPUT MOT DE PASSE */}
        <TextInput 
          style={styles.input} 
          placeholder="Mot de passe (6 caractères minimum)" 
          placeholderTextColor="#95a5a6"
          value={password} 
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* INPUT CONFIRMATION */}
        <TextInput 
          style={styles.input} 
          placeholder="Confirmer le mot de passe" 
          placeholderTextColor="#95a5a6"
          value={confirmPassword} 
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* BOUTON DE VALIDATION PREMIUM ORANGE */}
        <TouchableOpacity style={styles.btnRegister} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnRegisterTxt}>S'inscrire sur Jula</Text>}
        </TouchableOpacity>

        {/* LIEN DE RETOUR VERS LA CONNEXION */}
        <TouchableOpacity style={styles.btnLoginLink} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.loginLinkTxt}>Déjà inscrit ? <Text style={{color: '#f57c00', fontWeight: 'bold'}}>Se connecter</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 🎨 DESIGN PREMIUM HARMONISÉ AVEC TON SYSTÈME MOBILE
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#f2f2f2', gap: 14, paddingTop: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { padding: 20, paddingTop: 40 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  subTitle: { fontSize: 13, color: '#7f8c8d', marginBottom: 30, lineHeight: 18 },
  input: { borderWidth: 1, borderColor: '#ced4da', padding: 14, borderRadius: 6, marginBottom: 16, fontSize: 15, color: '#212529' },
  btnRegister: { backgroundColor: '#f57c00', padding: 14, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  btnRegisterTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  btnLoginLink: { marginTop: 25, alignItems: 'center' },
  loginLinkTxt: { fontSize: 14, color: '#495057' }
});