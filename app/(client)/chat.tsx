import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([]); // Tableau vide pour le mode test initial
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '') return;
    // La logique d'envoi en direct vers Supabase Realtime viendra s'insérer ici
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête Premium Jula Messagerie */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Boîte de réception</Text>
          <Text style={styles.headerSubtitle}>Messagerie Interconnectée Jula</Text>
        </View>
      </View>

      {/* Zone d'affichage dynamique des messages */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <Feather name="mail" size={45} color="#6c757d" />
            </View>
            <Text style={styles.emptyTitle}>Votre boîte est vide</Text>
            <Text style={styles.emptySubtitle}>
              Discutez en temps réel avec les grossistes de Côte d'Ivoire 🇨🇮, du Sénégal 🇸🇳, du Bénin 🇧🇯 et du Togo 🇹🇬 pour négocier vos prix !
            </Text>
          </View>
        ) : (
          <View>
            {/* Le rendu visuel des messages arrivera ici */}
          </View>
        )}
      </ScrollView>

      {/* Barre de saisie inférieure */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message privé..."
          placeholderTextColor="#7f8c8d"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Feather name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6', paddingTop: 40, gap: 16 },
  backBtn: { padding: 2 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#212529' },
  headerSubtitle: { fontSize: 11, color: '#f57c00', fontWeight: '600', marginTop: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 19, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: '#6c757d', textAlign: 'center', lineHeight: 20 },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#dee2e6', alignItems: 'center', gap: 10 },
  input: { flex: 1, backgroundColor: '#f1f3f5', borderRadius: 20, paddingHorizontal: 16, height: 40, fontSize: 14, color: '#212529' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f57c00', justifyContent: 'center', alignItems: 'center' }
});
