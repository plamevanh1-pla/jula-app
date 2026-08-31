import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChatListScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* BARRE SUPÉRIEURE DE NAVIGATION */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#f57c00" />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Discussions Jula</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* 🟢 ROUTE CORRIGÉE ET SÉCURISÉE AVEC LES PARAMÈTRES POUR ÉVITER LE GEL DE L'ÉCRAN */}
        <TouchableOpacity 
          style={styles.chatRow} 
          onPress={() => router.push({
            pathname: '/chat/[id]',
            params: { id: 'support-logistique' }
          })}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>👨‍💻</Text>
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.chatName}>Support Jula & Logistique</Text>
            <Text style={styles.chatPreview}>Cliquez pour échanger en direct...</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#c7c7cc" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#dee2e6', alignItems: 'center', paddingTop: 40 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { padding: 16 },
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f1f3f5' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff3e0', justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 22 },
  chatInfo: { flex: 1, marginLeft: 16 },
  chatName: { fontSize: 15, fontWeight: 'bold', color: '#212529' },
  chatPreview: { fontSize: 13, color: '#6c757d', marginTop: 2 }
});