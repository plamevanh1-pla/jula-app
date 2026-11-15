import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';
import { useTheme } from '../../src/context/ThemeContext';

export default function EditProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f8f9fa',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textLabel: isDarkMode ? '#d1d5db' : '#495057',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
  };

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
    if (!fullName.trim()) return Alert.alert('Erreur', 'Le nom ne peut pas être vide.');
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('profiles').update({ full_name: fullName.trim() }).eq('id', user?.id);
      if (error) throw error;
      Alert.alert('Succès', 'Profil mis à jour sur Jula !');
      router.back();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      <View style={[styles.header, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textMain }]}>Modifier mon Profil</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.label, { color: themeColors.textLabel }]}>Nom complet</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, color: themeColors.textMain },
          ]}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Votre nom"
          placeholderTextColor="#7f8c8d"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enregistrer les modifications</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, paddingTop: 40 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { padding: 14, borderRadius: 8, borderWidth: 1, marginBottom: 24, fontSize: 16 },
  button: { backgroundColor: '#f57c00', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
