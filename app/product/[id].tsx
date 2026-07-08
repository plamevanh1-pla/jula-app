import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paying, setPaying] = useState<boolean>(false);
  
  // 🟢 VRAIS AVIS : État connecté directement à la base de données
  const [reviews, setReviews] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
      fetchRealReviews(); // Charge les vrais avis du produit
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (data) setProduct(data);
    } catch (err: any) {
      console.log("Erreur détails produit:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 ROUTE SUPABASE : Récupérer les vrais avis depuis la table
  const fetchRealReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });
      if (!error && data) setReviews(data);
    } catch (err) {
      console.log("Erreur chargement avis réels:", err);
    }
  };

  // 🟢 ACTION SUPABASE : Permettre au vrai acheteur connecté de publier son avis
  const handleAddReview = async () => {
    if (!newComment.trim()) return Alert.alert("Erreur", "Veuillez écrire un commentaire.");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return Alert.alert("Attention", "Connectez-vous pour laisser un avis sur Jula.");

      const { error } = await supabase.from('reviews').insert([
        {
          product_id: id,
          user_id: user.id,
          user_email: user.email,
          comment: newComment,
          rating: newRating
        }
      ]);

      if (error) throw error;

      Alert.alert("Merci 🎉", "Votre avis a été publié en direct !");
      setNewComment('');
      fetchRealReviews(); // Rafraîchit la liste avec le nouvel avis
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      setPaying(true);
      const response = await fetch('https://jula-web.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_title: product.title, price: product.price })
      });

      const data = await response.json();
      if (response.ok && data.payment_url) {
        Linking.openURL(data.payment_url).catch(() => Alert.alert("Erreur", "Impossible d'ouvrir le guichet."));
      } else {
        throw new Error(data.error || "Erreur serveur.");
      }
    } catch (err) {
      Alert.alert("Guichet Jula Pay", "Erreur de liaison monétaire PayDunya. Vérifie que ton site web Render est LIVE.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <SafeAreaView style={[styles.container, styles.center]}><ActivityIndicator size="large" color="#f57c00" /></SafeAreaView>;
  if (!product) return <SafeAreaView style={[styles.container, styles.center]}><Text style={styles.errorText}>Article introuvable.</Text></SafeAreaView>;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="#212529" /></TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image_url }} style={styles.productImage} />
        
        <View style={styles.infoCard}>
          <Text style={styles.productPrice}>{product.price} FCFA</Text>
          
          {/* 📦 JAUGE DE QUANTITÉ VISIBLE POUR LE CLIENT (VERT OU ROUGE) */}
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: product.stock_quantity > 0 ? '#28a745' : '#d9534f', marginBottom: 10 }}>
            {product.stock_quantity > 0 ? `📦 Stock disponible : ${product.stock_quantity} pièces` : "❌ Rupture totale de stock"}
          </Text>

          <Text style={styles.productTitleText}>{product.title}</Text>
          
          <View style={styles.badgeRow}>
            <View style={styles.badgeCategory}><Text style={styles.badgeText}>📦 {product.category || 'Général'}</Text></View>
            <View style={styles.badgeExpress}><Text style={styles.badgeExpressText}>⚡ Jula Express</Text></View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>📝 Description :</Text>
          <Text style={styles.productDesc}>{product.description}</Text>
          
          <View style={styles.divider} />
          
          {/* ⭐ SECTION DES VRAIS AVIS CONNECTÉE À SUPABASE */}
          <Text style={styles.sectionLabel}>⭐ Vrais Avis des Clients Jula ({reviews.length}) :</Text>
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>Aucun avis sur cet article. Soyez le premier à donner votre avis !</Text>
          ) : (
            reviews.map((rev) => (
              <View key={rev.id} style={styles.reviewBox}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>👤 {rev.user_email ? rev.user_email.split('@')[0] : "Client"}</Text>
                  <Text style={styles.reviewStars}>{"★".repeat(rev.rating)}</Text>
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
              </View>
            ))
          )}

          {/* ✏️ BLOC FORMULAIRE D'ÉCRITURE DE VRAI COMMENTAIRE */}
          <View style={styles.addReviewContainer}>
            <Text style={styles.addReviewTitle}>Donner mon avis sur l'article :</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Écrivez votre vrai commentaire ici..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity style={styles.btnSubmitReview} onPress={handleAddReview}>
              <Text style={styles.btnSubmitReviewText}>Publier mon avis</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 🛑 TIROIR DU BAS INTÉGRANT LA RECONNAISSANCE AUTOMATIQUE DES RUPTURES DE STOCK */}
      <View style={styles.footerActionBox}>
        {product.stock_quantity > 0 ? (
          <TouchableOpacity 
            style={[styles.btnBuy, paying ? styles.btnDisabled : null]} 
            onPress={handleBuyNow} 
            disabled={paying}
          >
            {paying ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.btnBuyText}>💳 Acheter via Mobile Money</Text>}
          </TouchableOpacity>
        ) : (
          <View style={[styles.btnBuy, { backgroundColor: '#dee2e6', borderColor: '#ced4da', borderWidth: 1 }]}>
            <Text style={{ color: '#6c757d', fontWeight: 'bold', fontSize: 16 }}>❌ Article en Rupture de Stock</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  center: { justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 15, color: '#6c757d' },
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e9ecef', paddingTop: 40, gap: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529', flex: 1 },
  productImage: { width: '100%', height: 300, resizeMode: 'cover' },
  infoCard: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20, paddingBottom: 100 },
  productPrice: { fontSize: 24, fontWeight: 'bold', color: '#f57c00', marginBottom: 5 },
  productTitleText: { fontSize: 20, fontWeight: '600', color: '#212529', marginBottom: 15 },
  badgeRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  badgeCategory: { backgroundColor: '#e9ecef', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  badgeText: { fontSize: 12, color: '#495057', fontWeight: '500' },
  badgeExpress: { backgroundColor: '#fff3cd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  badgeExpressText: { fontSize: 12, color: '#856404', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#f2f2f2', marginVertical: 15 },
  sectionLabel: { fontSize: 15, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  productDesc: { fontSize: 14, color: '#495057', lineHeight: 20 },
  noReviews: { fontSize: 13, color: '#7f8c8d', fontStyle: 'italic', marginVertical: 10 },
  reviewBox: { backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e9ecef' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  reviewUser: { fontSize: 13, fontWeight: 'bold', color: '#495057' },
  reviewStars: { fontSize: 12, color: '#ffc107' },
  reviewComment: { fontSize: 13, color: '#212529' },
  addReviewContainer: { marginTop: 20, backgroundColor: '#fff' },
  addReviewTitle: { fontSize: 14, fontWeight: 'bold', color: '#212529', marginBottom: 10 },
  reviewInput: { borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top', fontSize: 14, color: '#212529', marginBottom: 10 },
  btnSubmitReview: { backgroundColor: '#1072ba', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnSubmitReviewText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  footerActionBox: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderColor: '#e9ecef' },
  btnBuy: { backgroundColor: '#f57c00', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  btnDisabled: { backgroundColor: '#ffb74d' },
  btnBuyText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
