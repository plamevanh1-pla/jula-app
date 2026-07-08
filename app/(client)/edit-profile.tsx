import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function EditProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCurrentProfile();
  }, []);

  const loadCurrentProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (data) setFullName(data.full_name || '');
    }
  };

  const handleUpdate = async () => {
    if (!fullName.trim()) return Alert.alert("Erreur", "Le nom ne peut pas être vide.");
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user?.id);
      if (error) throw error;
      Alert.alert("Succès", "Profil mis à jour sur Jula !");
      router.back();
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><Text style={styles.backText}>⬅ Retour</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier mon Profil</Text>
        <View style={{ width: 60 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Nom complet</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Votre nom" />
        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enregistrer les modifications</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backButton: { padding: 4 }, backText: { fontSize: 15, color: '#f57c00', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { padding: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 24, fontSize: 16 },
  button: { backgroundColor: '#f57c00', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});