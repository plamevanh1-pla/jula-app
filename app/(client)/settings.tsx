import { useRouter } from 'expo-router';
import { default as React, default as React } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppearanceSelector from '../../src/components/AppearanceSelector'; // 🟢 IMPORT DU SÉLECTEUR JULA

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paramètres Jula</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.row} 
          onPress={() => Alert.alert("Sécurité", "Option de changement de mot de passe à venir.")}
        >
          <Text style={styles.rowText}>Changer le mot de passe</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e9ecef', paddingTop: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { padding: 16 },
  row: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#e9ecef' },
  rowText: { fontSize: 14, color: '#212529', fontWeight: '500' }
});

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paramètres Jula</Text>
      </View>
      
      <View style={styles.content}>
        {/* 🌓 INJECTION DE TON BOUTON DE CHANGEMENT DE THÈME INTERACTIF */}
        <AppearanceSelector />

        {/* Option Sécurité existante */}
        <TouchableOpacity 
          style={styles.row} 
          onPress={() => Alert.alert("Sécurité", "Option de changement de mot de passe à venir.")}
        >
          <Text style={styles.rowText}>Changer le mot de passe</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e9ecef', paddingTop: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { padding: 16 },
  row: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#e9ecef' },
  rowText: { fontSize: 14, color: '#212529', fontWeight: '500' }
});
