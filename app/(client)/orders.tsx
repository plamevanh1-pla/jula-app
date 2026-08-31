import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://bgfmnjvhlonrfpfsxefe.supabase.co",
  process.env. SUPABASE_SERVICE_ROLE_KEY || "sb_publishable_W_q0i6GH_dKXr2QFc3xu_Q_EUZzpDMK"
);

interface Commande {
  id: string;
  product_title: string;
  total_price: number;
  status: string;
  selected_delivery_mode: string;
  created_at: string;
}

export default function OrdersScreen() {
  const router = useRouter();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulation de l'e-mail du client connecté (À lier avec ta session d'authentification réelle)
  const clientEmail = 'client_afrique@jula.com';

  useEffect(() => {
    async function fetchMesCommandes() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, product_title, total_price, status, selected_delivery_mode, created_at')
          .eq('buyer_email', clientEmail)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setCommandes(data as Commande[]);
        }
      } catch (err) {
        console.error("Erreur de récupération des commandes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMesCommandes();
  }, []);

  const obtenirCouleurStatut = (status: string) => {
    switch (status) {
      case 'Livré': return '#2e7d32';
      case 'En cours de livraison': return '#1072ba';
      default: return '#f57c00';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Mes Commandes</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      ) : commandes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>Vous n'avez passé aucune commande</Text>
          <Text style={styles.emptySubtitle}>Vos achats auprès des grossistes d'Afrique de l'Ouest s'afficheront ici.</Text>
          <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/')}>
            <Text style={styles.exploreButtonText}>Découvrir les produits</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {commandes.map((order) => (
            <View key={order.id} style={styles.card}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>ID: #{order.id.slice(0, 8)}</Text>
                <Text style={[styles.statusBadge, { color: obtenirCouleurStatut(order.status) }]}>
                  ● {order.status}
                </Text>
              </View>
              
              <Text style={styles.productTitle}>{order.product_title}</Text>
              <Text style={styles.productPrice}>{order.total_price.toLocaleString('fr-FR')} FCFA</Text>
              <Text style={styles.deliveryMode}>🛵 Mode : {order.selected_delivery_mode}</Text>
            </View>
          ))}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { marginRight: 15 },
  backArrow: { fontSize: 22, color: '#333', fontWeight: 'bold' },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  emptySubtitle: { fontSize: 12, color: '#777', textAlign: 'center', marginTop: 5, marginBottom: 20, lineHeight: 18 },
  exploreButton: { backgroundColor: '#f57c00', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 6 },
  exploreButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  scrollContainer: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  orderId: { fontSize: 12, fontWeight: 'bold', color: '#555' },
  statusBadge: { fontSize: 12, fontWeight: 'bold' },
  productTitle: { fontSize: 14, fontWeight: '500', color: '#333' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#f57c00', marginTop: 5 },
  deliveryMode: { fontSize: 11, color: '#666', marginTop: 4 }
});