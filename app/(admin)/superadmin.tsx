import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../config/supabaseClient'; // Vérifie que ton fichier client est bien à cet endroit

// 📝 Définition du type TypeScript pour un profil Jula
interface PartnerProfile {
  id: string;
  email: string;
  role: string;
  full_name: string;
  phone: string;
  country: string;
  shop_name?: string | null;
  vehicle_plate?: string | null;
  is_verified: boolean;
  cni_recto_url?: string | null;
  cni_verso_url?: string | null;
  photo_boutique_url?: string | null;
  photo_vehicule_url?: string | null;
  created_at: string;
}

export default function SuperAdminScreen() {
  const [partners, setPartners] = useState<PartnerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 📡 Fonction pour charger tous les partenaires depuis Supabase
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners((data as PartnerProfile[]) || []);
    } catch (error: any) {
      Alert.alert('❌ Erreur de synchronisation', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // ✅ Validation tactile instantanée du gérant ou du livreur
  const handleVerify = async (id: string, fullName: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', id);

      if (error) throw error;
      Alert.alert('🎉 Succès', `${fullName} est désormais un Partenaire Officiel Jula !`);
      fetchPartners(); // Rafraîchit l'écran mobile en direct
    } catch (error: any) {
      Alert.alert('❌ Échec de validation', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f57c00" />
        <Text style={styles.loadingText}>Connexion sécurisée au coffre-fort Jula...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🕵️‍♂️ Jacky SuperAdmin</Text>
        <Text style={styles.headerSubtitle}>Quartier Général Mobile Jula</Text>
      </View>

      <FlatList
        data={partners}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchPartners}
        renderItem={({ item }) => (
          <View style={[styles.card, item.is_verified ? styles.cardVerified : null]}>
            <div style={styles.infoRow}>
              <Text style={styles.roleBadge}>{item.role?.toUpperCase()}</Text>
              <Text style={[styles.statusBadge, item.is_verified ? styles.statusVerified : null]}>
                {item.is_verified ? '🔒 VÉRIFIÉ' : '⏳ EN ATTENTE'}
              </Text>
            </div>

            <Text style={styles.partnerName}>{item.full_name}</Text>
            <Text style={styles.partnerDetails}>✉️ {item.email}</Text>
            <Text style={styles.partnerDetails}>📞 {item.phone}</Text>
            <Text style={styles.partnerDetails}>📍 {item.country}</Text>
            {item.shop_name && <Text style={styles.partnerDetails}>🏪 Boutique : {item.shop_name}</Text>}
            {item.vehicle_plate && <Text style={styles.partnerDetails}>🏍️ Plaque : {item.vehicle_plate}</Text>}

            {/* 📸 GALERIE D'IMAGES TACTILE (CNI ET BOUTIQUE) */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
              {item.cni_recto_url && (
                <View style={styles.imgBox}>
                  <Text style={styles.imgLabel}>CNI Recto</Text>
                  <Image source={{ uri: item.cni_recto_url }} style={styles.docImage} />
                </View>
              )}
              {item.cni_verso_url && (
                <View style={styles.imgBox}>
                  <Text style={styles.imgLabel}>CNI Verso</Text>
                  <Image source={{ uri: item.cni_verso_url }} style={styles.docImage} />
                </View>
              )}
              {item.photo_boutique_url && (
                <View style={styles.imgBox}>
                  <Text style={styles.imgLabel}>Boutique</Text>
                  <Image source={{ uri: item.photo_boutique_url }} style={styles.docImage} />
                </View>
              )}
              {item.photo_vehicule_url && (
                <View style={styles.imgBox}>
                  <Text style={styles.imgLabel}>Véhicule</Text>
                  <Image source={{ uri: item.photo_vehicule_url }} style={styles.docImage} />
                </View>
              )}
            </ScrollView>

            {!item.is_verified && (
              <TouchableOpacity style={styles.btnVerify} onPress={() => handleVerify(item.id, item.full_name)}>
                <Text style={styles.btnText}>✅ Approuver le Partenaire</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111417' },
  loadingText: { color: '#fff', marginTop: 10, fontWeight: 'bold' },
  header: { backgroundColor: '#111417', padding: 20, borderRadius: 12, marginBottom: 15, borderBottomWidth: 4, borderBottomColor: '#f57c00' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#aaa', fontSize: 13, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#1072ba' },
  cardVerified: { borderLeftColor: '#28a745' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  roleBadge: { backgroundColor: '#e1f5fe', color: '#0288d1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 11, fontWeight: 'bold' },
  statusBadge: { backgroundColor: '#fff3cd', color: '#856404', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 11, fontWeight: 'bold' },
  statusVerified: { backgroundColor: '#d4edda', color: '#155724' },
  partnerName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  partnerDetails: { fontSize: 13, color: '#666', marginBottom: 3 },
  gallery: { flexDirection: 'row', marginTop: 12, marginBottom: 5 },
  imgBox: { marginRight: 12, alignItems: 'center' },
  imgLabel: { fontSize: 10, color: '#777', fontWeight: 'bold', marginBottom: 4 },
  docImage: { width: 100, height: 70, borderRadius: 6, backgroundColor: '#eee' },
  btnVerify: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
