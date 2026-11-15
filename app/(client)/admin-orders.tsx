import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';
import { useTheme } from '../../src/context/ThemeContext';

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f4f6f9',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    bgBtn: isDarkMode ? '#111417' : '#f8f9fa',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#ecf0f1' : '#495057',
    border: isDarkMode ? '#2d3139' : '#e0e0e0',
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      if (!supabase) return;
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

  const handleEditOrderStatus = (orderId: string, currentStatus: string) => {
    Alert.alert(
      "Modifier la commande",
      `Statut actuel : ${currentStatus || 'En attente'}`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Mettre En Attente", onPress: () => updateStatus(orderId, 'en attente') },
        { text: "Mettre En Cours", onPress: () => updateStatus(orderId, 'en cours') },
        { text: "Marquer comme Livré", onPress: () => updateStatus(orderId, 'Livré') }
      ]
    );
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
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
    const check = status ? status.toLowerCase() : 'en attente';
    switch (check) {
      case 'livré':
      case 'livre':
        return { label: 'Livré', color: '#2e7d32', bg: 'rgba(46, 125, 50, 0.15)' };
      case 'en cours':
        return { label: 'En cours', color: '#f57c00', bg: 'rgba(245, 124, 0, 0.15)' };
      case 'en attente':
      default:
        return { label: 'En attente', color: '#d9534f', bg: 'rgba(217, 83, 79, 0.15)' };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      <View style={[styles.headerBar, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerBarTitle, { color: themeColors.textMain }]}>SUIVI DES VENTES</Text>
          <Text style={styles.headerBarSubtitle}>Flux de commandes zone CFA</Text>
        </View>
        <Feather name="activity" size={20} color="#1072ba" />
      </View>

      {loading ? (
        <View style={[styles.center, { backgroundColor: themeColors.bgMain }]}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucune commande enregistrée sur Jula.</Text>
          }
          renderItem={({ item }) => {
            const statusInfo = getStatusColor(item.status);
            const date = item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : '--/--/----';
            return (
              <View style={[styles.orderCard, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.orderId, { color: themeColors.textMain }]}>
                    Commande #{item.id ? item.id.toString().substring(0, 8).toUpperCase() : 'ID'}
                  </Text>
                  <Text style={styles.orderDate}>{date}</Text>
                </View>

                <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

                <View style={styles.detailsBox}>
                  <Text style={[styles.detailsText, { color: themeColors.textSub }]}>
                    📦 Article : {item.product_title || item.product_name || 'Produit Jula'}
                  </Text>
                  <Text style={[styles.detailsText, { color: themeColors.textSub }]}>
                    👤 Client : {item.buyer_email || item.customer_email || 'Anonyme'}
                  </Text>
                  <Text style={[styles.detailsText, { color: themeColors.textSub }]}>
                    📞 Tel : {item.buyer_phone || 'Non renseigné'}
                  </Text>
                  <Text style={[styles.detailsText, { color: themeColors.textSub }]}>
                    📍 Adresse : {item.buyer_address || item.delivery_address || 'Zone CFA'}
                  </Text>
                  <Text style={[styles.detailsText, { color: themeColors.textSub }]}>
                    🚚 Transport : {item.selected_delivery_mode || 'Standard'}
                  </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

                <View style={styles.cardFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                  </View>
                  <Text style={styles.orderPrice}>
                    {Number(item.total_price || 0).toLocaleString('fr-FR')} FCFA
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: themeColors.bgBtn, borderColor: themeColors.border }]}
                  onPress={() => handleEditOrderStatus(item.id, item.status)}
                >
                  <Text style={[styles.actionButtonText, { color: themeColors.textMain }]}>
                    ⚙️ Forcer le statut de livraison
                  </Text>
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
