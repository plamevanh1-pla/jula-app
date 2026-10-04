 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.log("Erreur silencieuse commandes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOrderStatus = (orderId: number, currentStatus: string) => {
    Alert.alert(
      "Modifier la commande",
      `Statut actuel : ${currentStatus || 'En attente'}`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Mettre En Attente", onPress: () => updateStatus(orderId, 'en_attente') },
        { text: "Mettre En Cours", onPress: () => updateStatus(orderId, 'en_cours') },
        { text: "Marquer comme Livré", onPress: () => updateStatus(orderId, 'livré') }
      ]
    );
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      Alert.alert("Succès", "Le statut de la commande a été modifié.");
      fetchAllOrders();
    } catch (error: any) {
      Alert.alert("Erreur", "Modification impossible : " + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    const check = status ? status.toLowerCase() : 'en_attente';
    switch (check) {
      case 'livré':
      case 'livre': 
        return { label: 'Livré', color: '#2e7d32', bg: 'rgba(46, 125, 50, 0.15)' };
      case 'en_cours': 
        return { label: 'En cours', color: '#f57c00', bg: 'rgba(245, 124, 0, 0.15)' };
      case 'en_attente':
      default:
        return { label: 'En attente', color: '#d9534f', bg: 'rgba(217, 83, 79, 0.15)' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerBarTitle}>SUIVI DES VENTES</Text>
          <Text style={styles.headerBarSubtitle}>Flux de commandes zone CFA</Text>
        </View>
        <Feather name="activity" size={20} color="#1072ba" />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item && item.id ? item.id.toString() : Math.random().toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucune commande enregistrée sur Jula pour l'instant.</Text>
          }
          renderItem={({ item }) => {
            if (!item) return null;
            const statusInfo = getStatusColor(item.status);
            
            let date = '--/--/----';
            try {
              if (item.created_at) date = new Date(item.created_at).toLocaleDateString('fr-FR');
            } catch(e) {}

            const cleanId = item.id ? item.id.toString().substring(0, 8).toUpperCase() : 'SANS-ID';
            const cleanPrice = item.total_amount ? Number(item.total_amount).toLocaleString('fr-FR') : '0';
            return (
              <View style={styles.orderCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.orderId}>Commande #{cleanId}</Text>
                  <Text style={styles.orderDate}>{date}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsBox}>
                  <Text style={styles.detailsText}>👤 Destinataire : {item.delivery_name || 'Non spécifié'}</Text>
                  <Text style={styles.detailsText}>📞 Client : {item.delivery_phone || 'Pas de numéro'}</Text>
                  <Text style={styles.detailsText}>📍 Destination : {item.delivery_city || 'Ville'}, {item.delivery_neighborhood || 'Quartier'}</Text>
                  <Text style={styles.detailsText}>💳 Mode de Paiement : {item.payment_method || 'Mobile Money'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                  </View>
                  <Text style={styles.orderPrice}>{cleanPrice} FCFA</Text>
                </View>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditOrderStatus(item.id, item.status)}
                >
                  <Text style={styles.actionButtonText}>⚙️ Forcer le statut de livraison</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111417' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111417' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1d21', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#2d3139', paddingTop: 40 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  headerBarSubtitle: { fontSize: 11, color: '#f57c00', fontWeight: '600', marginTop: 2 },
  list: { padding: 15 },
  emptyText: { textAlign: 'center', color: '#7f8c8d', marginTop: 40, fontSize: 13, fontWeight: '500' },
  orderCard: { backgroundColor: '#1a1d21', borderRadius: 8, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: '#2d3139' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  orderDate: { fontSize: 11, color: '#7f8c8d' },
  divider: { height: 1, backgroundColor: '#2d3139', marginVertical: 12 },
  detailsBox: { gap: 6 },
  detailsText: { fontSize: 13, color: '#ecf0f1' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  orderPrice: { fontSize: 15, fontWeight: 'bold', color: '#f57c00' },
  actionButton: { padding: 12, borderRadius: 4, borderWidth: 1, borderColor: '#2d3139', alignItems: 'center', marginTop: 14, backgroundColor: '#111417' },
  actionButtonText: { color: '#ecf0f1', fontSize: 12, fontWeight: '600' }
});
