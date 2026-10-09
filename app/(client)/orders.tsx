 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';
import { useTheme } from '../../src/context/ThemeContext'; // 🟢 INJECTION DE LA LUMIÈRE JULA

export default function AdminOrdersScreen() {
  const { isDarkMode } = useTheme(); // 🌓 DÉTECTION DU MODE VISUEL CHOISI
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
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#111417' : '#f4f6f9' }]}>
      
      {/* 🪐 BARRE EN-TÊTE SUPÉRIEURE - FLÈCHE DE RETOUR FORCÉE AU COMPTE ACCESSIBLE */}
      <View style={[styles.headerBar, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderBottomColor: isDarkMode ? '#2d3139' : '#e9ecef' }]}>
        <TouchableOpacity 
          onPress={() => router.replace('/(client)/(tabs)/account')} 
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={isDarkMode ? '#fff' : '#212529'} />
        </TouchableOpacity>
        
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerBarTitle, { color: isDarkMode ? '#fff' : '#212529' }]}>SUIVI DES VENTES</Text>
          <Text style={styles.headerBarSubtitle}>Flux de commandes zone CFA</Text>
        </View>
        <Feather name="activity" size={20} color="#1072ba" />
      </View>

      {loading ? (
        <View style={[styles.center, { backgroundColor: isDarkMode ? '#111417' : '#f4f6f9' }]}>
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
              <View style={[styles.orderCard, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#e9ecef' }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.orderId, { color: isDarkMode ? '#fff' : '#212529' }]}>Commande #{cleanId}</Text>
                  <Text style={styles.orderDate}>{date}</Text>
                </View>

                <View style={[styles.divider, { backgroundColor: isDarkMode ? '#2d3139' : '#e9ecef' }]} />

                <View style={styles.detailsBox}>
                  <Text style={[styles.detailsText, { color: isDarkMode ? '#ecf0f1' : '#495057' }]}>👤 Destinataire : {item.delivery_name || 'Non spécifié'}</Text>
                  <Text style={[styles.detailsText, { color: isDarkMode ? '#ecf0f1' : '#495057' }]}>📞 Client : {item.delivery_phone || 'Pas de numéro'}</Text>
                  <Text style={[styles.detailsText, { color: isDarkMode ? '#ecf0f1' : '#495057' }]}>📍 Destination : {item.delivery_city || 'Ville'}, {item.delivery_neighborhood || 'Quartier'}</Text>
                  <Text style={[styles.detailsText, { color: isDarkMode ? '#ecf0f1' : '#495057' }]}>💳 Mode de Paiement : {item.payment_method || 'Mobile Money'}</Text>
                </View>

                <View style={[styles.divider, { backgroundColor: isDarkMode ? '#2d3139' : '#e9ecef' }]} />

                <View style={styles.cardFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                  </View>
                  <Text style={styles.orderPrice}>{cleanPrice} FCFA</Text>
                </View>

                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: isDarkMode ? '#111417' : '#f8f9fa', borderColor: isDarkMode ? '#2d3139' : '#e9ecef' }]}
                  onPress={() => handleEditOrderStatus(item.id, item.status)}
                >
                  <Text style={[styles.actionButtonText, { color: isDarkMode ? '#ecf0f1' : '#212529' }]}>⚙️ Forcer le statut de livraison</Text>
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
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, paddingTop: 40 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  headerBarSubtitle: { fontSize: 11, color: '#f57c00', fontWeight: '600', marginTop: 2 },
  list: { padding: 15 },
  emptyText: { textAlign: 'center', color: '#7f8c8d', marginTop: 40, fontSize: 13, fontWeight: '500' },
  orderCard: { borderRadius: 8, padding: 16, marginBottom: 15, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 14, fontWeight: 'bold' },
  orderDate: { fontSize: 11, color: '#7f8c8d' },
  divider: { height: 1, marginVertical: 12 },
  detailsBox: { gap: 6 },
  detailsText: { fontSize: 13 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  orderPrice: { fontSize: 15, fontWeight: 'bold', color: '#f57c00' },
  actionButton: { padding: 12, borderRadius: 4, borderWidth: 1, alignItems: 'center', marginTop: 14 },
  actionButtonText: { fontSize: 12, fontWeight: '600' }
});
