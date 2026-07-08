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
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Erreur commandes admin Jula:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOrderStatus = (orderId: number, currentStatus: string) => {
    Alert.alert(
      "Modifier la commande",
      `Statut actuel : ${currentStatus}`,
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
    switch (status) {
      case 'livré': return { label: 'Livré', color: '#155724', bg: '#d4edda' };
      case 'en_cours': return { label: 'En cours', color: '#856404', bg: '#fff3cd' };
      case 'en_attente':
      default:
        return { label: 'En attente', color: '#721c24', bg: '#f8d7da' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête Admin */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suivi Global des Ventes</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#212529" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucune commande enregistrée sur Jula.</Text>
          }
          renderItem={({ item }) => {
            const statusInfo = getStatusColor(item.status);
            const date = new Date(item.created_at).toLocaleDateString('fr-FR');

            return (
              <View style={styles.orderCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.orderId}>Commande #{item.id.toString().substring(0, 8).toUpperCase()}</Text>
                  <Text style={styles.orderDate}>{date}</Text>
                </View>

                <View style={styles.divider} />

                {/* Coordonnées logistiques stockées sur Supabase */}
                <View style={styles.detailsBox}>
                  <Text style={styles.detailsText}>📞 Client : {item.delivery_phone}</Text>
                  <Text style={styles.detailsText}>📍 Destination : {item.delivery_city}, {item.delivery_neighborhood}</Text>
                  <Text style={styles.detailsText}>💳 Paiement : {item.payment_method}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                  </View>
                  <Text style={styles.orderPrice}>{item.total_amount.toLocaleString()} FCFA</Text>
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
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#212529', borderBottomWidth: 1, borderColor: '#343a40' },
  backButton: { padding: 4 },
  backText: { fontSize: 15, color: '#fff', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16 },
  emptyText: { textAlign: 'center', color: '#6c757d', marginTop: 40, fontSize: 14 },
  orderCard: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#dee2e6' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 15, fontWeight: 'bold', color: '#212529' },
  orderDate: { fontSize: 12, color: '#6c757d' },
  divider: { height: 1, backgroundColor: '#f1f3f5', marginVertical: 12 },
  detailsBox: { gap: 4 },
  detailsText: { fontSize: 14, color: '#495057' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  orderPrice: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  actionButton: { padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#ced4da', alignItems: 'center', marginTop: 14, backgroundColor: '#f8f9fa' },
  actionButtonText: { color: '#495057', fontSize: 13, fontWeight: '600' }
});