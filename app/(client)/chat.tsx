import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ClientChatListScreen() {
  const router = useRouter();

  const CONVERSATIONS = [
    { id: 'vendeur_01', name: 'Électronique Pro Plus', lastMessage: 'Votre colis est emballé.', date: '18/06' },
    { id: 'vendeur_02', name: 'Boutique Mode Africaine', lastMessage: 'Disponible en taille XL.', date: 'Yesterday' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Messages</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={CONVERSATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatCard}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatRow}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatDate}>{item.date}</Text>
              </View>
              <Text style={styles.chatPreview} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backButton: { padding: 4 },
  backText: { fontSize: 15, color: '#f57c00', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  chatCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, alignItems: 'center', elevation: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff3e0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ffe0b2' },
  avatarText: { color: '#f57c00', fontWeight: 'bold', fontSize: 16 },
  chatInfo: { flex: 1, marginLeft: 14 },
  chatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { fontSize: 15, fontWeight: 'bold', color: '#212529' },
  chatDate: { fontSize: 11, color: '#adb5bd' },
  chatPreview: { fontSize: 13, color: '#6c757d', marginTop: 4 }
}); 