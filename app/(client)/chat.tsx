 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([]); 
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '') return;
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête Jula Messagerie */}
      <View style={styles.header}>
        {/* 🟢 RECTIFIÉ : Forcer Expo Router à utiliser le retour natif ou à basculer de sécurité sur account */}
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(client)/(tabs)/account')} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Boîte de réception</Text>
          <Text style={styles.headerSubtitle}>Messagerie Interconnectée Jula</Text>
        </View>
      </View>

      {/* Salons de discussion / Canaux */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.channelsBlock}>
          <Text style={styles.channelLabel}>💬 Canaux d'assistance Jula</Text>
          
          <TouchableOpacity style={styles.channelItem} onPress={() => alert("Discussion avec le Support technique")}>
            <View style={[styles.iconBox, { backgroundColor: '#e3f2fd' }]}><Text style={styles.channelIcon}>🛠️</Text></View>
            <View style={{ flex: 1 }}><Text style={styles.channelName}>Support Jula</Text><Text style={styles.channelDesc}>Aide sur ton compte et tes portefeuilles</Text></View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.channelItem} onPress={() => alert("Discussion avec la Logistique")}>
            <View style={[styles.iconBox, { backgroundColor: '#e8f5e9' }]}><Text style={styles.channelIcon}>📦</Text></View>
            <View style={{ flex: 1 }}><Text style={styles.channelName}>Logistique Jula</Text><Text style={styles.channelDesc}>Suivi d'expédition entre les 4 pays</Text></View>
          </TouchableOpacity>
        </View>

        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <Feather name="mail" size={40} color="#6c757d" />
            </View>
            <Text style={styles.emptyTitle}>Aucun message privé</Text>
            <Text style={styles.emptySubtitle}>
              Tes échanges en temps réel avec les grossistes d'Adjamé, Sandaga, Dantokpa ou Assigamé s'afficheront ici.
            </Text>
          </View>
        ) : (
          <View></View>
        )}
      </ScrollView>

      {/* Saisie inférieure */}
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
  scrollContent: { flexGrow: 1, padding: 16 },
  channelsBlock: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: '#dee2e6' },
  channelLabel: { fontSize: 12, fontWeight: 'bold', color: '#7f8c8d', marginBottom: 12, textTransform: 'uppercase' },
  channelItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#f1f3f5', gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  channelIcon: { fontSize: 18 },
  channelName: { fontSize: 14, fontWeight: 'bold', color: '#212529' },
  channelDesc: { fontSize: 11, color: '#7f8c8d', marginTop: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 30, paddingHorizontal: 16 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginBottom: 6 },
  emptySubtitle: { fontSize: 12, color: '#6c757d', textAlign: 'center', lineHeight: 18 },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#dee2e6', alignItems: 'center', gap: 10 },
  input: { flex: 1, backgroundColor: '#f1f3f5', borderRadius: 20, paddingHorizontal: 16, height: 40, fontSize: 14, color: '#212529' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f57c00', justifyContent: 'center', alignItems: 'center' }
});
