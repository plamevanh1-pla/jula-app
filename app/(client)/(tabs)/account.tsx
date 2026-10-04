 import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../src/config/supabaseClient';

export default function AccountScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('client'); // 🔒 État de sécurité pour stocker le rôle cloud
  const [walletBalance, setWalletBalance] = useState(0);
  const [currentCountry, setCurrentCountry] = useState('🇨🇮 Côte d\'Ivoire');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const masquerEmail = (email: string) => {
    if (!email || !email.includes('@')) return "Non connecté";
    const [nom, domaine] = email.split('@');
    if (nom.length <= 2) return `**@${domaine}`;
    return `${nom.substring(0, 2)}**********@${domaine}`;
  };

  useEffect(() => {
    async function chargerDonneesProfil() {
      try {
        // 📡 1. Détection du drapeau national choisi par l'utilisateur
        const pays = await AsyncStorage.getItem('jula_pays_choisi') || 'CI';
        if (pays === 'SN') setCurrentCountry('🇸🇳 Sénégal');
        if (pays === 'TG') setCurrentCountry('🇹🇬 Togo');
        if (pays === 'BJ') setCurrentCountry('🇧🇯 Bénin');
        if (pays === 'CI') setCurrentCountry('🇨🇮 Côte d\'Ivoire');

        // 🔑 2. Détection automatique de la session cloud Supabase et du rôle
        if (supabase && supabase.auth) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setUserEmail(user.email || '');
            
            // On récupère le rôle de sécurité en direct de Supabase profiles
            const { data: profil } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
            if (profil) setUserRole(profil.role || 'client');

            // Solde du portefeuille
            const { data: wallet } = await supabase.from('wallets').select('balance_fcfa').eq('user_id', user.id).maybeSingle();
            if (wallet) setWalletBalance(wallet.balance_fcfa);
          } else {
            setUserEmail('');
            setUserRole('client');
          }
        }
      } catch (err) {
        console.log("Erreur chargement profil international:", err);
      } finally {
        setLoading(false);
      }
    }
    chargerDonneesProfil();
  }, []);

  // 🔎 RECHERCHE PROPULSÉE VERS L'ACCUEIL LOGIQUE JULA
  const declencherRechercheGlobale = async () => {
    if (search.trim() === '') return;
    try {
      await AsyncStorage.setItem('jula_mot_recherche_temporaire', search.trim());
      router.push('/(client)/(tabs)/home');
    } catch (e) {
      console.log("Erreur transmission recherche", e);
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vous déconnecter de Jula ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Oui", onPress: async () => { 
          if (supabase) await supabase.auth.signOut(); 
          setUserEmail(''); 
          setUserRole('client');
          setWalletBalance(0);
          router.replace('/(auth)/login'); 
        } 
      }
    ]);
  };

  const renderItem = (icon: string, text: string, path: string, isAlert = false) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => isAlert ? Alert.alert(text) : router.push(path as any)}>
      <Feather name={icon as any} size={20} color="#212529" style={{ marginRight: 16 }} />
      <Text style={styles.menuItemTxt}>{text}</Text>
      <Feather name="chevron-right" size={16} color="#7f8c8d" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }]}>
        <ActivityIndicator size="large" color="#f57c00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 BARRE DE RECHERCHE CORRIGÉE AVEC LOUPE CLICQUABLE ET ACTION CLAVIER */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchField}>
          <TouchableOpacity onPress={declencherRechercheGlobale}>
            <Feather name="search" size={20} color="#f57c00" style={{ padding: 2 }} />
          </TouchableOpacity>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Recherche sur Jula..." 
            placeholderTextColor="#7f8c8d" 
            value={search} 
            onChangeText={setSearch}
            onSubmitEditing={declencherRechercheGlobale}
            returnKeyType="search"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.loginBlock}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bonjourTxt}>Bonjour ({currentCountry})</Text>
            <Text style={styles.subBonjourTxt}>{userEmail ? masquerEmail(userEmail) : "Merci d'insérer votre compte"}</Text>
          </View>
          {!userEmail ? (
            <TouchableOpacity style={styles.btnOrangeConnect} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.btnConnectTxt}>Connexion</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.btnOrangeConnect, {backgroundColor: '#d9534f'}]} onPress={handleLogout}>
              <Text style={styles.btnConnectTxt}>Déconnexion</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.soldeLine}>
          <Feather name="credit-card" size={20} color="#1072ba" />
          <Text style={styles.soldeTxt}>{userEmail ? `Votre solde disponible : ${walletBalance.toLocaleString('fr-FR')} FCFA` : "Connectez-vous pour voir votre solde disponible"}</Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/chat')}>
            <Feather name="message-square" size={18} color="#fff" />
            <Text style={styles.chatBtnTxt}>Chat En Direct</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.wpBtn} 
            onPress={async () => {
              const numeroSupport = "2250585187834"; 
              const messageAutomatique = "Bonjour Jula, j'ai besoin d'une assistance concernant mon profil ou mes commandes.";
              const lienUniverselWhatsApp = `https://wa.me{numeroSupport}?text=${encodeURIComponent(messageAutomatique)}`;
              try {
                await Linking.openURL(lienUniverselWhatsApp);
              } catch (error) {
                Alert.alert("WhatsApp Jula", "Impossible d'ouvrir la discussion pour le moment.");
              }
            }}
          >
            <Feather name="message-circle" size={18} color="#25D366" />
            <Text style={styles.wpBtnTxt}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Région de livraison</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} onPress={async () => {
            await AsyncStorage.removeItem('jula_pays_choisi'); 
            router.replace('/'); 
          }}>
            <Feather name="globe" size={20} color="#f57c00" style={{ marginRight: 16 }} />
            <Text style={[styles.menuItemTxt, { color: '#f57c00', fontWeight: 'bold' }]}>Changer de pays actuel</Text>
            <Feather name="chevron-right" size={16} color="#f57c00" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>À propos de Jula</Text>
        <View style={styles.menuGroup}>
          {renderItem("info", "Aide & Assistance", "/(client)/help")}
          {renderItem("briefcase", "À propos de nos Services", "/(client)/services")}
        </View>

        <Text style={styles.sectionTitle}>Mon compte Jula</Text>
        <Text style={{ fontSize: 13, color: '#6c757d', marginLeft: 16, marginBottom: 12, fontWeight: '500' }}>
          👤 Compte Connecté : {masquerEmail(userEmail)}
        </Text>

        <View style={styles.menuGroup}>
          {renderItem("package", "Mes commandes", "/(client)/orders")}
          {renderItem("mail", "Boîte de réception", "/chat")}
          {renderItem("edit-3", "Notes et avis", "/(client)/reviews-history")}
          {renderItem("gift", "Bons d'achat", "/(client)/vouchers")}
          {renderItem("heart", "Favoris", "/favorites")}
          {renderItem("shopping-bag", "Vendeurs suivis", "/(client)/vendeurs-suivis")}
          {renderItem("clock", "Consultés récemment", "/(client)/consultes-recemment")}
        </View>

        <Text style={styles.sectionTitle}>Mes paramètres</Text>
        <View style={styles.menuGroup}>
          {renderItem("sliders", "Paramètres de paiement", "/(client)/payment-settings")}
          {renderItem("map-pin", "Carnet d'adresses", "/(client)/checkout-address")}
          {renderItem("bell", "Préférences de notification", "/notifications")}
          {renderItem("shield", "Politique de Confidentialité", "/(client)/about")}
        </View>

        {/* 🔒 MODULE DE SÉCURITÉ ADMINISTRATEUR TOTALEMENT PRIVÉ */}
        {userRole === 'admin' && (
          <View style={{ backgroundColor: '#f2f2f2' }}>
            <Text style={styles.sectionTitle}>Administration Privée</Text>
            <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff' }}>
              <TouchableOpacity style={styles.btnSecretAdmin} onPress={() => router.push('/(client)/superadmin')} activeOpacity={0.8}>
                <Text style={styles.btnSecretText}>⚙️ Ouvrir le QG Mobile Jacky</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!userEmail && (
          <View style={styles.footerInviteBlock}>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerInviteTxt}>Connectez-vous</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  searchBarContainer: { paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#fff', paddingTop: 40 },
  searchField: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e9ecef', borderRadius: 25, paddingHorizontal: 16, height: 48, gap: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#212529', fontWeight: '500' },
  loginBlock: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, marginTop: 10, alignItems: 'center', justifyContent: 'space-between' },
  bonjourTxt: { fontSize: 15, fontWeight: 'bold', color: '#212529' },
  subBonjourTxt: { fontSize: 13, color: '#7f8c8d', marginTop: 2 },
  btnOrangeConnect: { backgroundColor: '#f57c00', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 4 },
  btnConnectTxt: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  soldeLine: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderTopWidth: 1, borderColor: '#f2f2f2', gap: 12 },
  soldeTxt: { fontSize: 13, color: '#1072ba', fontWeight: '600' },
  actionRow: { flexDirection: 'row', padding: 14, gap: 12 },
  chatBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#f57c00', height: 48, borderRadius: 4, alignItems: 'center', justifyContent: 'center', gap: 8 },
  chatBtnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  wpBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', height: 48, borderRadius: 4, borderWidth: 1, borderColor: '#25D366', alignItems: 'center', justifyContent: 'center', gap: 8 },
  wpBtnTxt: { color: '#25D366', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 12, color: '#7f8c8d', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6, fontWeight: 'bold' },
  menuGroup: { backgroundColor: '#fff' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#f2f2f2' },
  menuItemTxt: { flex: 1, fontSize: 15, color: '#212529' },
  footerInviteBlock: { paddingVertical: 35, alignItems: 'center', justifyContent: 'center' },
  footerInviteTxt: { color: '#f57c00', fontSize: 15, fontWeight: '600', textDecorationLine: 'underline' },
  btnSecretAdmin: { backgroundColor: '#111417', padding: 16, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#f57c00', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  btnSecretText: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }
});
