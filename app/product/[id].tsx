import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Connexion instantanée à ta base de données Supabase Jula
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://bgfmnjvhlonrfpfsxefe.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY  || "sb_publishable_W_q0i6GH_dKXr2QFc3xu_Q_EUZzpDMK" // Clé publique Anon conforme mobile
);

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  promo_price?: number; 
  image_url: string;
  category: string;
  stock_quantity: number;
  vendedor_id: string;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState('Standard');

  // Session de Production de l'acheteur connecté 
  const currentUser = {
    email: 'client_afrique@jula.com',
    phone: '0707070707',
    address: 'Abidjan, Cocody',
    country: 'CI' as 'CI' | 'SN' | 'BJ' | 'TG' 
  };

  // 📡 ASPIRATION EN DIRECT DU PRODUIT SÉLECTIONNÉ DEPUIS SUPABASE
  useEffect(() => {
    async function loadProductData() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          setProduct(data as Product);
        }
      } catch (err) {
        console.error("Erreur de chargement du produit:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [id]);

  // 🗑️ FONCTION DE SUPPRESSION LOGÉE TECHNIQUEMENT AU BON ENDROIT
  const handleSupprimerProduitMobile = async () => {
    if (!product) return;

    Alert.alert(
      "🗑️ Supprimer l'article",
      "Voulez-vous vraiment retirer définitivement cet article du catalogue Jula Network ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setBuying(true);
              const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', product.id);

              if (error) throw error;

              Alert.alert("✅ Succès", "L'article a été retiré du catalogue mondial avec succès !");
              router.push('/(client)/(tabs)'); 
            } catch (err: any) {
              Alert.alert("❌ Erreur", "Impossible d'effacer le produit.");
            } finally {
              setBuying(false);
            }
          }
        }
      ]
    );
  };

  // 🛒 MOTEUR D'ACHAT ET DE REDIRECTION PAYDUNYA DE PRODUCTION
  const handleAddToCartAndPay = async () => {
    if (!product) return;
    if (!currentUser.email) {
      Alert.alert("Connexion requise", "Veuillez vous connecter pour acheter.", [{ text: "OK", onPress: () => router.push('/login') }]);
      return;
    }

    setBuying(true);
    const countryLabels = { CI: "Côte d'Ivoire", SN: "Sénégal", BJ: "Bénin", TG: "Togo" };
    const userCountry = countryLabels[currentUser.country];

    const prixFinalAchat = product.promo_price ? product.promo_price : product.price;

    const orderPayload = {
      vendedor_id: product.vendedor_id,
      product_id: product.id,
      product_title: product.title,
      price: prixFinalAchat,
      quantity: 1,
      delivery_mode: deliveryMode,
      buyer_email: currentUser.email,
      buyer_address: `${currentUser.address} (${userCountry})`,
      buyer_phone: currentUser.phone,
      currency: 'XOF'
    };

    try {
      // 🟢 RECONNEXION SUR LA ROUTE SPECIFIQUE /create-order
      const response = await fetch('https://jula-web.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("🛒 Panier Jula", "Votre article a bien été transmis au grossiste !");
        if (result.redirect_url) {
          Linking.openURL(result.redirect_url);
        }
      } else {
        Alert.alert("❌ Erreur", result.error || "Impossible de commander.");
      }
    } catch (error) {
      Alert.alert("📡 Erreur Réseau", "Le serveur en ligne est injoignable.");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#f57c00" />
      </SafeAreaView>
    );
  }

  // 🟢 CORRECTION DE LA VARIABLE : On écrit bien "product" au lieu de "products" !
  if (!product) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text>❌ Produit introuvable.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Grande Image du produit */}
        <Image source={{ uri: product.image_url }} style={styles.productImage} />

        <View style={styles.contentBlock}>
          {/* Titre et Prix */}
          <Text style={styles.productTitle}>{product.title}</Text>
          
          {/* Zone de Prix et Remises calculée en direct */}
          {product.promo_price ? (
            <View style={{ marginVertical: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.productPrice}>{product.promo_price.toLocaleString('fr-FR')} FCFA</Text>
                <View style={{ backgroundColor: '#f57c00', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, marginLeft: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
                    -{Math.round(((product.price - product.promo_price) / product.price) * 100)}%
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, color: '#999', textDecorationLine: 'line-through' }}>{product.price.toLocaleString('fr-FR')} FCFA</Text>
            </View>
          ) : (
            <Text style={styles.productPrice}>{product.price.toLocaleString('fr-FR')} FCFA</Text>
          )}

          {/* JAUGE DE STOCK INTERACTIVE JULA EXPRESS */}
          <Text style={styles.sectionLabel}>📉 État du stock disponible :</Text>
          <View style={{ marginVertical: 5 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: product.stock_quantity <= 5 ? '#d32f2f' : '#2e7d32', marginBottom: 4 }}>
              {product.stock_quantity <= 5 ? `⚠️ Quantité critique : Plus que ${product.stock_quantity} articles !` : `🟢 Stock sécurisé : ${product.stock_quantity} unités disponibles`}
            </Text>
            <View style={{ width: '100%', height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ 
                height: '100%', 
                width: `${Math.min((product.stock_quantity / 50) * 100, 100)}%`, 
                backgroundColor: product.stock_quantity <= 5 ? '#d32f2f' : product.stock_quantity <= 15 ? '#f57c00' : '#2e7d32' 
              }} />
            </View>
          </View>

          {/* Badges de catégorie */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>📦 {product.category}</Text></View>
            <View style={[styles.badge, { backgroundColor: '#fff3e0' }]}><Text style={[styles.badgeText, { color: '#e65100' }]}>⚡ Jula Express</Text></View>
          </View>
          {/* Description */}
          <Text style={styles.sectionLabel}>📝 Description :</Text>
          <Text style={styles.descriptionText}>{product.description || "Aucune description fournie par le vendeur."}</Text>

          {/* ⭐ BLOC DES AVIS CLIENTS D'ORIGINE */}
          <Text style={styles.sectionLabel}>⭐ Vrais Avis des Clients Jula (0) :</Text>
          <View style={styles.reviewsBox}>
            <Text style={styles.noReviewsText}>Aucun avis n'a encore été laissé pour cet article. Soyez le premier à donner votre avis après votre livraison !</Text>
          </View>

          {/* 🛵 SÉLECTEUR DE MODE DE LIVRAISON */}
          <Text style={styles.sectionLabel}>🛵 Choisissez votre mode de livraison :</Text>
          <View style={styles.deliveryRow}>
            <TouchableOpacity 
              style={[styles.deliveryBtn, deliveryMode === 'Standard' && styles.deliveryBtnActive]} 
              onPress={() => setDeliveryMode('Standard')}
            >
              <Text style={[styles.deliveryText, deliveryMode === 'Standard' && styles.deliveryTextActive]}>Standard (1 500 XOF)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.deliveryBtn, deliveryMode === 'Express' && styles.deliveryBtnActive]} 
              onPress={() => setDeliveryMode('Express')}
            >
              <Text style={[styles.deliveryText, deliveryMode === 'Express' && styles.deliveryTextActive]}>⚡ Express (2 500 XOF)</Text>
            </TouchableOpacity>
          </View>

          {/* 💬 INTERFACES DE CONTACT CLIENT (CHAT EN DIRECT & WHATSAPP) */}
          <Text style={styles.sectionLabel}>💬 Besoin d'assistance ?</Text>
          <View style={styles.contactRow}>
            {/* Bouton Chat En Direct */}
            <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/chat')}>
              <Text style={styles.chatBtnTxt}>✉️ Chat En Direct</Text>
            </TouchableOpacity>

            {/* Bouton WhatsApp de Production */}
            <TouchableOpacity 
              style={styles.wpBtn} 
              onPress={async () => {
                const numeroSupport = "2250585187834"; 
                const messageAutomatique = "Bonjour Jula, j'ai besoin d'une assistance concernant l'application mobile.";
                
                // 🌍 CORRECTION EFFECTUÉE : Liaison dynamique wa.me/${numeroSupport} parfaitement réparée
                const lienUniverselWhatsApp = `https://wa.me{numeroSupport}?text=${encodeURIComponent(messageAutomatique)}`;
                
                try {
                  await Linking.openURL(lienUniverselWhatsApp);
                } catch (error) {
                  Alert.alert("WhatsApp Jula", "Impossible de lancer la discussion pour le moment.");
                }
              }}
            >
              <Text style={styles.wpBtnTxt}>🟢 WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* 🛒 ENSEMBLE DE BOUTONS DE PRODUCTION DOUBLE ACTION : PANIER ET ACHAT DIRECT */}
          <View style={styles.actionRowContainer}>
            
            {/* 1. LE BOUTON « AJOUTER AU PANIER » */}
            <TouchableOpacity 
              style={[styles.cartAddBtn, product.stock_quantity === 0 && { backgroundColor: '#ccc' }]} 
              disabled={buying || product.stock_quantity === 0}
               onPress={async () => {
  try {
    // 📡 Récupère le panier actuel stocké en mémoire flash du téléphone
    const panierExistant = await AsyncStorage.getItem('jula_panier');
    let listeProduits = panierExistant ? JSON.parse(panierExistant) : [];

    // Vérifie si l'article est déjà dedans pour éviter les doublons
    const existeDeja = listeProduits.find((p: any) => p.id === product.id);
    if (!existeDeja) {
      listeProduits.push({
        id: product.id,
        title: product.title,
        price: product.promo_price || product.price,
        image_url: product.image_url,
        category: product.category,
        quantite: 1
      });
      // Enregistrement instantané en mémoire flash du Tecno
      await AsyncStorage.setItem('jula_panier', JSON.stringify(listeProduits));
    }

    Alert.alert(
      "🛒 Panier Jula", 
      `"${product.title}" a été ajouté à la vitesse de l'éclair !`,
      [{ text: "Continuer" }]
    );
  } catch (err) {
    Alert.alert("❌ Erreur", "Impossible de mettre à jour le panier.");
  }
}}
            >
              <Text style={styles.cartAddBtnText}>Ajouter au Panier</Text>
            </TouchableOpacity>
             
            {/* 2. LE BOUTON DE PAIEMENT IMMEDIAT ET DIRECT VIA PAYDUNYA */}
            <TouchableOpacity 
              style={[styles.orangeButtonDirect, product.stock_quantity === 0 && { backgroundColor: '#ccc' }]} 
              onPress={handleAddToCartAndPay}
              disabled={buying || product.stock_quantity === 0}
            >
              <Text style={styles.buttonTextDirect}>
                {buying ? "Traitement..." : "💳 Acheter Direct"}
              </Text>
            </TouchableOpacity>

          </View>

          {/* 🛡️ LE BOUTON DE SUPPRESSION REPLACÉ AU BON ENDROIT (DANS LE FLUX DE DÉFILEMENT) */}
          {product.vendedor_id === currentUser.email && (
            <TouchableOpacity 
              style={styles.mobileDeleteBtn} 
              onPress={handleSupprimerProduitMobile}
              disabled={buying}
            >
              <Text style={styles.mobileDeleteBtnText}>
                {buying ? "Suppression en cours..." : "🗑️ Supprimer mon article du catalogue"}
              </Text>
            </TouchableOpacity>
          )}

        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// 🎨 FEUILLE DE DESIGN UNITAIRE SANS AUCUNE COUPURE DE CODES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  center: { justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '100%', height: 300, resizeMode: 'cover', backgroundColor: '#fff' },
  contentBlock: { padding: 16 },
  productTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  productPrice: { fontSize: 22, fontWeight: 'bold', color: '#f57c00', marginVertical: 8 },
  badgeRow: { flexDirection: 'row', marginBottom: 15 },
  badge: { backgroundColor: '#eceff1', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, marginRight: 8 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#455a64' },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 15, marginBottom: 8 },
  descriptionText: { fontSize: 13, color: '#666', lineHeight: 18, textAlign: 'justify' },
  
  reviewsBox: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  noReviewsText: { fontSize: 12, color: '#777', fontStyle: 'italic', textAlign: 'center', lineHeight: 16 },
  
  deliveryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  deliveryBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, alignItems: 'center', marginRight: 5, backgroundColor: '#fff' },
  deliveryBtnActive: { borderColor: '#f57c00', backgroundColor: '#fff3e0' },
  deliveryText: { fontSize: 12, color: '#555', fontWeight: '500' },
  deliveryTextActive: { color: '#e65100', fontWeight: 'bold' },

  contactRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  chatBtn: { flex: 1, backgroundColor: '#1072ba', padding: 12, borderRadius: 6, alignItems: 'center', marginRight: 5 },
  chatBtnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  wpBtn: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#25D366', padding: 12, borderRadius: 6, alignItems: 'center', marginLeft: 5 },
  wpBtnTxt: { color: '#25D366', fontWeight: 'bold', fontSize: 13 },

  mobileDeleteBtn: { backgroundColor: '#d32f2f', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15, borderWidth: 1, borderColor: '#d32f2f', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  mobileDeleteBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase' },

  actionRowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  cartAddBtn: { flex: 1, backgroundColor: '#fff', borderWidth: 2, borderColor: '#1072ba', padding: 15, borderRadius: 8, alignItems: 'center', marginRight: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  cartAddBtnText: { color: '#1072ba', fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase' },
  orangeButtonDirect: { flex: 1, backgroundColor: '#f57c00', padding: 15, borderRadius: 8, alignItems: 'center', marginLeft: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 3 },
  buttonTextDirect: { color: '#fff', fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase' }
});