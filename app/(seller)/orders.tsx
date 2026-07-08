import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';
import { useAuth } from '../../src/context/AuthContext';
import { useOrdersRealtime } from '../../src/hooks/useOrdersRealtime';

export default function SellerOrdersScreen() {
  const { user, profile } = useAuth();
  const router = useRouter();
  
  // Utilisation de notre hook temps réel pour le vendeur
  const { orders, loading } = useOrdersRealtime(user?.id, profile?.role);

  // Fonction pour faire progresser l'état de la livraison
  const handleUpdateStatus = async (orderId: number, currentStatus: string) => {
    let nextStatus = 'en_cours';
    let label = 'marquer comme en cours de livraison';

    if (currentStatus === 'en_cours') {
      nextStatus = 'livré';
      label = 'marquer comme livré';
    } else if (currentStatus === 'livré') {
      Alert.alert("Information", "Cette commande a déjà été entièrement livrée.");
      return;
    }

    Alert.alert(
      "Mettre à jour le statut",
      `Voulez-vous vraiment ${label} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('orders')
                .update({ status: nextStatus })
                .eq('id', orderId);

              if (error) throw error;
              Alert.alert("Succès", "Le statut de la commande a été mis à jour.");
            } catch (error: any) {
              Alert.alert("Erreur", "Impossible de modifier le statut : " + error.message);
            }
          }
        }
      ]
    );
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'livré': return { label: 'Livré', color: '#2e7d32', bg: '#e8f5e9' };
      case 'en_cours': return { label: 'En cours', color: '#ef6c00', bg: '#fff3e0' };
      case 'en_attente':
      default:
        return { label: 'En attente', color: '#c62828', bg: '#ffebee' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Tableau de bord</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commandes reçues</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucune commande de client n'a été enregistrée pour le moment.</Text>
          }
          renderItem={({ item }) => {
            const statusInfo = getStatusDetails(item.status);
            const orderDate = new Date(item.created_at).toLocaleDateString('fr-FR');

            return (
              <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Commande #{item.id.toString().substring(0, 8).toUpperCase()}</Text>
                  <Text style={styles.orderDate}>{orderDate}</Text>
                </View>

                <View style={styles.divider} />

                {/* Coordonnées du client acheteur */}
                <View style={styles.clientDetails}>
                  <Text style={styles.infoText}>📍 Ville : {item.delivery_city}</Text>
                  <Text style={styles.infoText}>🏡 Quartier : {item.delivery_neighborhood}</Text>
                  <Text style={styles.infoText}>📞 Téléphone : {item.delivery_phone}</Text>
                  {item.delivery_details && <Text style={styles.infoText}>📝 Note : {item.delivery_details}</Text>}
                </View>

                <View style={styles.divider} />

                <View style={styles.orderFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                  </View>
                  <Text style={styles.orderPrice}>{item.total_amount.toLocaleString()} FCFA</Text>
                </View>

                {/* Bouton d'action pour modifier le statut (style Jumia Vendeur) */}
                {item.status !== 'livré' && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleUpdateStatus(item.id, item.status)}
                  >
                    <Text style={styles.actionButtonText}>
                      {item.status === 'en_attente' ? '🚚 Lancer la livraison' : '🏠 Confirmer la réception'}
                    </Text>
                  </TouchableOpacity>
                )}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backButton: { padding: 4 },
  backText: { fontSize: 14, color: '#f57c00', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  list: { padding: 16 },
  emptyText: { textAlign: 'center', color: '#6c757d', marginTop: 40, fontSize: 14 },
  orderCard: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 15, fontWeight: 'bold', color: '#212529' },
  orderDate: { fontSize: 12, color: '#6c757d' },
  divider: { height: 1, backgroundColor: '#f1f3f5', marginVertical: 12 },
  clientDetails: { gap: 4 },
  infoText: { fontSize: 14, color: '#495057' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  orderPrice: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  actionButton: { backgroundColor: '#f57c00', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 14 },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});