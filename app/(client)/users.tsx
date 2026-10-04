 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

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

export default function UsersAdminScreen() {
  const router = useRouter();
  const [partners, setPartners] = useState<PartnerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 📈 ÉTATS COMPTABLES GLOBAUX DE L'EMPIRE JACKY
  const [globalRevenue, setGlobalRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const fetchDataSuprême = async () => {
    try {
      setLoading(true);
      if (!supabase) return;
      
      // 1. Récupération de tous les partenaires
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setPartners((profilesData as PartnerProfile[]) || []);

      // 2. ANALYSE FINANCIÈRE : Calcul de la somme des ventes globales
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total_price, status');

      if (!ordersError && ordersData) {
        setTotalOrders(ordersData.length);
        
        let cumulSous = 0;
        ordersData.forEach(order => {
          if (order.status === 'Livré' || order.status === 'En cours de livraison') {
            cumulSous += Number(order.total_price);
          }
        });
        setGlobalRevenue(cumulSous);
      }
    } catch (error: any) {
      Alert.alert('❌ Erreur de synchronisation', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataSuprême();
  }, []);

  const handleVerify = async (id: string, fullName: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', id);

      if (error) throw error;
      Alert.alert('🎉 Succès', `${fullName} est désormais un Partenaire Officiel Jula !`);
      fetchDataSuprême(); 
    } catch (error: any) {
      Alert.alert('❌ Échec de validation', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f57c00" />
        <Text style={styles.loadingText}>Calcul des finances de l'Empire Jula...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 👑 BARRE DE RETOUR SUPÉRIEURE RECTIFIÉE POUR ÉVITER LE CRASH */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Utilisateurs & Boutiques</Text>
      </View>

      {/* 👑 EN-TÊTE D'ADMINISTRATION FINANCIÈRE */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🕵️‍♂️ Jacky SuperAdmin</Text>
        <Text style={styles.headerSubtitle}>Gestion des Marchands & Livreurs Jula</Text>
        
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
          <View style={styles.financeBoxGreen}>
            <Text style={styles.financeLabel}>💰 CA ENCAISSÉ</Text>
            <Text style={styles.financeValue}>{globalRevenue.toLocaleString('fr-FR')} F</Text>
          </View>
          <View style={styles.financeBoxOrange}>
            <Text style={styles.financeLabel}>📦 FLUX TRAFFIC</Text>
            <Text style={styles.financeValue}>{totalOrders} commandes</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={partners}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchDataSuprême}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, item.is_verified ? styles.cardVerified : null]}>
            <View style={styles.infoRow}>
              <Text style={styles.roleBadge}>{item.role?.toUpperCase() || 'CLIENT'}</Text>
              <Text style={[styles.statusBadge, item.is_verified ? styles.statusVerified : null]}>
                {item.is_verified ? '🔒 VÉRIFIÉ' : '⏳ EN ATTENTE'}
              </Text>
            </View>

            <Text style={styles.partnerName}>{item.full_name || 'Utilisateur Anonyme'}</Text>
            <Text style={styles.partnerDetails}>✉️ {item.email}</Text>
            <Text style={styles.partnerDetails}>📞 {item.phone || 'Pas de numéro'}</Text>
            <Text style={styles.partnerDetails}>📍 Pays : {item.country || 'Non spécifié'}</Text>
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
  loadingText: { color: '#fff', marginTop: 10, fontWeight: 'bold', fontSize: 13 },
  topHeaderBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111417', paddingVertical: 15, paddingHorizontal: 5, paddingTop: 40, gap: 14 },
  backButton: { padding: 2 },
  topHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  header: { backgroundColor: '#111417', padding: 16, borderRadius: 12, marginBottom: 15, borderBottomWidth: 4, borderBottomColor: '#f57c00' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#aaa', fontSize: 12, marginTop: 4 },
  
  financeBoxGreen: { flex: 1, backgroundColor: 'rgba(40, 167, 69, 0.15)', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#28a745' },
  financeBoxOrange: { flex: 1, backgroundColor: 'rgba(245, 124, 0, 0.15)', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#f57c00' },
  financeLabel: { fontSize: 10, color: '#aaa', fontWeight: 'bold' },
  financeValue: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginTop: 4 },

  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#1072ba', elevation: 1 },
  cardVerified: { borderLeftColor: '#28a745' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  roleBadge: { backgroundColor: '#e1f5fe', color: '#0288d1', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4, fontSize: 10, fontWeight: 'bold' },
  statusBadge: { backgroundColor: '#ffe0b2', color: '#e65100', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4, fontSize: 10, fontWeight: 'bold' },
  statusVerified: { backgroundColor: '#c8e6c9', color: '#257d32' },
  partnerName: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginBottom: 6 },
  partnerDetails: { fontSize: 13, color: '#495057', marginVertical: 1.5 },
  
  gallery: { flexDirection: 'row', marginTop: 12, paddingVertical: 4 },
  imgBox: { marginRight: 12, alignItems: 'center' },
  imgLabel: { fontSize: 10, color: '#7f8c8d', fontWeight: 'bold', marginBottom: 4 },
  docImage: { width: 90, height: 65, borderRadius: 6, backgroundColor: '#eee', resizeMode: 'cover' },
  btnVerify: { backgroundColor: '#f57c00', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 14 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 }
});
