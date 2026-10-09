  import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { supabase } from '../../src/config/supabaseClient';
import { useTheme } from '../../src/context/ThemeContext'; // 🌓 S'adapte au mode sombre Jacky

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { orderId } = useLocalSearchParams(); // Récupère l'ID du colis en cours

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    // 📡 1. CHARGEMENT INITIAL DE LA COMMANDE DEPUIS SUPABASE
    async function fetchOrderDetails() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (!error && data) {
          setOrder(data);
        }
      } catch (err) {
        console.log("Erreur de récupération du colis:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();

    // ⚡ 2. ÉCOUTE EN TEMPS RÉEL (REALTIME) : Dès que le livreur change le statut sur sa moto, l'écran change !
    const orderSubscription = supabase
      .channel(`live-tracking-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', filter: `id=eq.${orderId}`, schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Statut logistique mis à jour en direct:', payload.new);
          setOrder(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, [orderId]);

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: isDarkMode ? '#111417' : '#f4f4f6' }]}>
        <ActivityIndicator size="large" color="#f57c00" />
        <Text style={{ marginTop: 10, color: isDarkMode ? '#fff' : '#212529' }}>Recherche de votre colis Jula...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: isDarkMode ? '#111417' : '#f4f4f6' }]}>
        <Feather name="alert-circle" size={40} color="#d32f2f" />
        <Text style={{ marginTop: 10, color: isDarkMode ? '#fff' : '#212529', fontWeight: 'bold' }}>Aucun colis trouvé.</Text>
        <TouchableOpacity style={styles.btnRetour} onPress={() => router.back()}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retourner à l'accueil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🛠️ MOTEUR DE VÉRIFICATION DES ÉTAPES DE LIVRAISON (STATUTS EN FRANÇAIS DE LA ZONE CFA)
  const statutActuel = order.status || 'En attente de préparation';
  
  const estEtape1 = true; // Toujours validé car commandé
  const estEtape2 = statutActuel === 'En cours de livraison' || statutActuel === 'Livré';
  const estEtape3 = statutActuel === 'Livré';
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#111417' : '#f4f4f6' }]}>
      {/* En-tête de la page de suivi */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#e9ecef' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={isDarkMode ? '#fff' : '#212529'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#212529' }]}>Suivi de livraison Jula</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Fiche récapitulative du Colis CFA */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#eee' }]}>
          <Text style={styles.cardLabel}>Numéro de suivi Jula :</Text>
          <Text style={[styles.orderIdText, { color: isDarkMode ? '#fff' : '#212529' }]}>📦 {order.id}</Text>
          <View style={styles.separator} />
          <Text style={styles.cardLabel}>Article commandé :</Text>
          <Text style={[styles.productTitle, { color: isDarkMode ? '#fff' : '#212529' }]}>{order.product_title} (x{order.product_quantity || 1})</Text>
          <Text style={styles.priceText}>{(order.total_price || 0).toLocaleString('fr-FR')} FCFA</Text>
        </View>

        {/* 🪐 LA FRISE TEMPORELLE VERTICALE INTERACTIVE (LA MOTO) */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#eee' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#212529' }]}>État d'avancement du colis</Text>

          {/* ÉTAPE 1 : Commande Reçue et en Préparation */}
          <View style={styles.stepRow}>
            <View style={styles.timelineLeftColumn}>
              <View style={[styles.circleBadge, estEtape1 ? styles.circleBadgeActifOrange : styles.circleBadgeInactif]}>
                <Feather name="shopping-bag" size={16} color="#fff" />
              </View>
              <View style={[styles.verticalLineFill, estEtape2 ? styles.lineActifVert : styles.lineInactif]} />
            </View>
            <View style={styles.stepTextContainer}>
                <Text style={[styles.stepTitle, { color: isDarkMode ? '#fff' : '#212529' }]}>Boutique & Grossiste</Text>
                <Text style={styles.stepSub}>Commande enregistrée et en cours de préparation à la boutique.</Text>
            </View>
          </View>

          {/* ÉTAPE 2 : En cours de route sur la Moto */}
          <View style={styles.stepRow}>
            <View style={styles.timelineLeftColumn}>
              <View style={[styles.circleBadge, estEtape2 ? (estEtape3 ? styles.circleBadgeActifVert : styles.circleBadgeActifOrange) : styles.circleBadgeInactif]}>
                <Feather name="truck" size={16} color="#fff" />
              </View>
              <View style={[styles.verticalLineFill, estEtape3 ? styles.lineActifVert : styles.lineInactif]} />
            </View>
            <View style={styles.stepTextContainer}>
                <Text style={[styles.stepTitle, { color: isDarkMode ? '#fff' : '#212529' }]}>En cours de route à moto</Text>
                <Text style={styles.stepSub}>Le coursier logistique Jula a récupéré votre colis et fait route vers votre adresse.</Text>
            </View>
          </View>

          {/* ÉTAPE 3 : Colis arrivé à Destination */}
          <View style={styles.stepRow}>
            <View style={styles.timelineLeftColumn}>
              <View style={[styles.circleBadge, estEtape3 ? styles.circleBadgeActifVert : styles.circleBadgeInactif]}>
                <Feather name="check-circle" size={16} color="#fff" />
              </View>
            </View>
            <View style={styles.stepTextContainer}>
                <Text style={[styles.stepTitle, { color: isDarkMode ? '#fff' : '#212529' }]}>Colis Livré Officiel</Text>
                <Text style={styles.stepSub}>Le colis de votre smartphone est arrivé à bon port. Merci d'avoir choisi Jula !</Text>
            </View>
          </View>
        </View>

        {/* Fiche d'assistance logistique client */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#eee' }]}>
          <Text style={[styles.assistantTitle, { color: isDarkMode ? '#fff' : '#212529' }]}><Feather name="phone-call" size={16} /> Besoin d'assistance ?</Text>
          <Text style={styles.assistantSub}>Notre équipe de régulation logistique UEMOA suit l'avancement de cette moto en temps réel.</p>
          <Text style={styles.assistantContact}>Téléphone acheteur : {order.buyer_phone || 'Non renseigné'}</Text>
          <Text style={styles.assistantContact}>Adresse choisie : {order.buyer_address || 'Adjamé, Abidjan'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  btnRetour: { backgroundColor: '#f57c00', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginTop: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60, borderBottomWidth: 1, paddingTop: 5 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  card: { padding: 18, borderRadius: 12, borderWidth: 1, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  cardLabel: { fontSize: 11, color: '#7f8c8d', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  orderIdText: { fontSize: 14, fontWeight: '700', marginTop: 4, fontFamily: 'monospace' },
  separator: { height: 1, backgroundColor: '#e9ecef', marginVertical: 12, opacity: 0.5 },
  productTitle: { fontSize: 15, fontWeight: '500', marginTop: 4 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#f57c00', marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 20 },
  stepRow: { flexDirection: 'row', minHeight: 85 },
  timelineLeftColumn: { alignItems: 'center', width: 30, marginRight: 15 },
  circleBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  circleBadgeInactif: { backgroundColor: '#bdc3c7' },
  circleBadgeActifOrange: { backgroundColor: '#f57c00', shadowColor: '#f57c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  circleBadgeActifVert: { backgroundColor: '#2e7d32', shadowColor: '#2e7d32', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  verticalLineFill: { width: 4, position: 'absolute', top: 32, bottom: -10, zIndex: 1 },
  lineInactif: { backgroundColor: '#dee2e6' },
  lineActifVert: { backgroundColor: '#2e7d32' },
  stepTextContainer: { flex: 1, paddingTop: 2 },
  stepTitle: { fontSize: 14, fontWeight: 'bold' },
  stepSub: { fontSize: 12, color: '#7f8c8d', marginTop: 3, lineHeight: 17 },
  assistantTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  assistantSub: { fontSize: 12, color: '#7f8c8d', marginBottom: 10 },
  assistantContact: { fontSize: 13, color: '#555', fontWeight: '500', marginTop: 2 }
});


     