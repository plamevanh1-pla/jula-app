  import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../src/config/supabaseClient';
import { useTheme } from '../../../src/context/ThemeContext'; // 🟢 INJECTION DE LA LUMIÈRE JULA

export default function AccountScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme(); // 🌓 INTERCEPTEUR CLAIR/SOMBRE AUTOMATIQUE
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('client'); 
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
        const pays = await AsyncStorage.getItem('jula_pays_choisi') || 'CI';
        if (pays === 'SN') setCurrentCountry('🇸🇳 Sénégal');
        if (pays === 'TG') setCurrentCountry('🇹🇬 Togo');
        if (pays === 'BJ') setCurrentCountry('🇧🇯 Bénin');
        if (pays === 'CI') setCurrentCountry('🇨🇮 Côte d\'Ivoire');

        if (supabase && supabase.auth) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setUserEmail(user.email || '');
            
            const { data: profil } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
            if (profil) setUserRole(profil.role || 'client');

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

  // 🛠️ COMPOSANT INTERNE DE SÉCURITÉ DE COULEUR DES CELLULES
  const renderItem = (icon: string, text: string, path: string, isAlert = false) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#f2f2f2' }]} 
      onPress={() => isAlert ? Alert.alert(text) : router.push(path as any)}
    >
      <Feather name={icon as any} size={20} color={isDarkMode ? '#fff' : '#212529'} style={{ marginRight: 16 }} />
      <Text style={[styles.menuItemTxt, { color: isDarkMode ? '#fff' : '#212529' }]}>{text}</Text>
      <Feather name="chevron-right" size={16} color="#7f8c8d" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? '#111417' : '#fff' }]}>
        <ActivityIndicator size="large" color="#f57c00" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#111417' : '#f2f2f2' }]}>
      
      {/* 🔍 BARRE DE RECHERCHE SUPÉRIEURE INTERACTIVE */}
      <View style={[styles.searchBarContainer, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#e9ecef' }]}>
        <View style={[styles.searchField, { backgroundColor: isDarkMode ? '#111417' : '#e9ecef' }]}>
          <TouchableOpacity onPress={declencherRechercheGlobale}>
            <Feather name="search" size={20} color="#f57c00" style={{ padding: 2 }} />
          </TouchableOpacity>
          <TextInput 
            style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#212529' }]} 
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
        
        {/* EN-TÊTE D'ACCUEIL DU PROFIL */}
        <View style={[styles.loginBlock, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bonjourTxt, { color: isDarkMode ? '#fff' : '#212529' }]}>Bonjour ({currentCountry})</Text>
            <Text style={styles.subBonjourTxt}>{userEmail ? masquerEmail(userEmail) : "Merci d'insérer votre compte"}</Text>
          </View>
          {!userEmail ? (
            <TouchableOpacity style={styles.btnOrangeConnect} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.btnConnectTxt}>Connexion</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.btnOrangeConnect, { backgroundColor: '#d9534f' }]} onPress={handleLogout}>
              <Text style={styles.btnConnectTxt}>Déconnexion</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* COMPARTIMENT SOLDE DISPONIBLE EN DIRECT */}
        <View style={[styles.soldeLine, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#f2f2f2' }]}>
          <Feather name="credit-card" size={20} color="#1072ba" />
          <Text style={styles.soldeTxt}>{userEmail ? `Votre solde disponible : ${walletBalance.toLocaleString('fr-FR')} FCFA` : "Connectez-vous pour voir votre solde disponible"}</Text>
        </View>

        {/* BOUTONS DE CONTACT ASSISTANCE DIRECTE */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/chat')}>
            <Feather name="message-square" size={18} color="#fff" />
            <Text style={styles.chatBtnTxt}>Chat En Direct</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.wpBtn, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff' }]} 
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

        <!-- ZONE INTERNATIONALE DE LIVRAISON -->
        <Text style={styles.sectionTitle}>Région de livraison</Text>
        <View style={[styles.menuGroup, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff' }]}>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0 }]} 
            onPress={async () => {
              await AsyncStorage.removeItem('jula_pays_choisi'); 
              router.replace('/'); 
            }}
          >
            <Feather name="globe" size={20} color="#f57c00" style={{ marginRight: 16 }} />
            <Text style={[styles.menuItemTxt, { color: '#f57c00', fontWeight: 'bold' }]}>Changer de pays actuel</Text>
            <Feather name="chevron-right" size={16} color="#f57c00" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>À propos de Jula</Text>
        <View style={[styles.menuGroup, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff' }]}>
          {renderItem("info", "Aide & Assistance", "/(client)/help")}
          {renderItem("briefcase", "À propos de nos Services", "/(client)/services")}
        </View>

        <Text style={styles.sectionTitle}>Mon compte Jula</Text>
        <Text style={{ fontSize: 13, color: '#6c757d', marginLeft: 16, marginBottom: 12, fontWeight: '500' }}>
          👤 Compte Connecté : {masquerEmail(userEmail)}
        </Text>

        <View style={[styles.menuGroup, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff' }]}>
          {renderItem("package", "Mes commandes", "/(client)/orders")}
          {renderItem("mail", "Boîte de réception", "/chat")}
          {renderItem("edit-3", "Notes et avis", "/(client)/reviews-history")}
          {renderItem("gift", "Bons d'achat", "/(client)/vouchers")}
          {renderItem("heart", "Favoris", "/favorites")}
          {renderItem("shopping-bag", "Vendeurs suivis", "/(client)/vendeurs-suivis")}
          {renderItem("clock", "Consultés récemment", "/(client)/consultes-recemment")}
        </View>

        <Text style={styles.sectionTitle}>Mes paramètres</Text>
        <View style={[styles.menuGroup, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff' }]}>
          {renderItem("sliders", "Paramètres de paiement", "/(client)/payment-settings")}
          {renderItem("map-pin", "Carnet d'adresses", "/(client)/checkout-address")}
          {renderItem("bell", "Préférences de notification", "/notifications")}
          {renderItem("shield", "Politique de Confidentialité", "/(client)/about")}
        </View>

        {/* 🔒 MODULE DE SÉCURITÉ ADMINISTRATEUR SÉCURISÉ ET RESTAURÉ VERS LE DASHBOARD EXPO */}
        {userRole === 'admin' && (
          <View style={{ backgroundColor: isDarkMode ? '#111417' : '#f2f2f2', marginTop: 15 }}>
            <Text style={styles.sectionTitle}>Administration Privée</Text>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: isDarkMode ? '#1a1d21' : '#fff' }}>
              <TouchableOpacity style={styles.btnSecretAdmin} onPress={() => router.push('/(client)/dashboard')} activeOpacity={0.8}>
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
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBarContainer: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 40, borderBottomWidth: 1 },
  searchField: { flexDirection: 'row', alignItems: 'center', borderRadius: 25, paddingHorizontal: 16, height: 48, gap: 10 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '500' },
  loginBlock: { flexDirection: 'row', padding: 16, marginTop: 10, alignItems: 'center', justifyContent: 'space-between' },
  bonjourTxt: { fontSize: 15, fontWeight: 'bold' },
  subBonjourTxt: { fontSize: 13, color: '#7f8c8d', marginTop: 2 },
  btnOrangeConnect: { backgroundColor: '#f57c00', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 4 },
  btnConnectTxt: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  soldeLine: { flexDirection: 'row', alignItems: 'center', padding: 14, borderTopWidth: 1, gap: 12 },
  soldeTxt: { fontSize: 13, color: '#1072ba', fontWeight: '600' },
  actionRow: { flexDirection: 'row', padding: 14, gap: 12 },
  chatBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#f57c00', height: 48, borderRadius: 4, alignItems: 'center', justifyContent: 'center', gap: 8 },
  chatBtnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  wpBtn: { flex: 1, flexDirection: 'row', height: 48, borderRadius: 4, borderWidth: 1, borderColor: '#25D366', alignItems: 'center', justifyContent: 'center', gap: 8 },
  wpBtnTxt: { color: '#25D366', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 12, color: '#7f8c8d', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, fontWeight: 'bold' },
  menuGroup: { },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  menuItemTxt: { flex: 1, fontSize: 15 },
  footerInviteBlock: { paddingVertical: 35, alignItems: 'center', justifyContent: 'center' },
  footerInviteTxt: { color: '#f57c00', fontSize: 15, fontWeight: '600', textDecorationLine: 'underline' },
  btnSecretAdmin: { backgroundColor: '#111417', padding: 16, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#f57c00', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  btnSecretText: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }
});
