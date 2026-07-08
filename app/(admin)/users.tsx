import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Erreur utilisateurs admin:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateUser = (userId: string, currentRole: string, name: string) => {
    Alert.alert(
      "Modération du compte",
      `Gestion des droits pour : ${name || 'Utilisateur'} (${currentRole})`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Changer en Vendeur",
          onPress: () => updateUserRole(userId, 'seller')
        },
        {
          text: "Changer en Client",
          onPress: () => updateUserRole(userId, 'client')
        }
      ]
    );
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      Alert.alert("Mis à jour", "Le rôle de l'utilisateur a été modifié avec succès.");
      fetchAllUsers(); // Recharger la liste
    } catch (error: any) {
      Alert.alert("Erreur", "Impossible de modifier les droits : " + error.message);
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin': return { label: 'ADMIN', color: '#7f1d1d', bg: '#fee2e2' };
      case 'seller': return { label: 'VENDEUR', color: '#b45309', bg: '#fef3c7' };
      case 'client':
      default:
        return { label: 'CLIENT', color: '#1e3a8a', bg: '#dbeafe' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête Admin */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestion des Membres</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#212529" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun utilisateur trouvé sur la plateforme Jula.</Text>
          }
          renderItem={({ item }) => {
            const badge = getRoleBadgeStyle(item.role);
            const date = new Date(item.created_at).toLocaleDateString('fr-FR');

            return (
              <View style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.full_name || "Sans nom"}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                  <Text style={styles.userDate}>Inscrit le : {date}</Text>
                </View>

                <View style={styles.actionsColumn}>
                  <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.roleText, { color: badge.color }]}>{badge.label}</Text>
                  </View>
                  
                  {item.role !== 'admin' && (
                    <TouchableOpacity 
                      style={styles.moderateButton}
                      onPress={() => handleModerateUser(item.id, item.role, item.full_name)}
                    >
                      <Text style={styles.moderateButtonText}>Gérer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#212529', borderBottomWidth: 1, borderColor: '#343a40' },
  backButton: { padding: 4 },
  backText: { fontSize: 15, color: '#fff', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16 },
  emptyText: { textAlign: 'center', color: '#6c757d', marginTop: 40, fontSize: 14 },
  userCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#dee2e6', alignItems: 'center' },
  userInfo: { flex: 1, gap: 4 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  userEmail: { fontSize: 13, color: '#495057' },
  userDate: { fontSize: 11, color: '#868e96' },
  actionsColumn: { alignItems: 'flex-end', gap: 10, marginLeft: 12 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  roleText: { fontSize: 10, fontWeight: 'bold' },
  moderateButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4, backgroundColor: '#e9ecef', borderWidth: 1, borderColor: '#ced4da' },
  moderateButtonText: { color: '#495057', fontSize: 12, fontWeight: '600' }
});