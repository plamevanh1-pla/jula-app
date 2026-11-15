import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../src/context/ThemeContext';

export default function CartScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Palette dynamique selon le thème sélectionné
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f2f2f2',
    bgHeader: isDarkMode ? '#1a1d21' : '#ffffff',
    bgCircle: isDarkMode ? '#1a1d21' : '#e9ecef',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.bgMain }]}>
        <ActivityIndicator size="large" color="#f57c00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* En-tête personnalisé style Jula */}
      <View style={[styles.header, { backgroundColor: themeColors.bgHeader, borderColor: themeColors.border }]}>
        <Text style={[styles.headerTitle, { color: themeColors.textMain }]}>Mon Panier</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.iconCircle, { backgroundColor: themeColors.bgCircle }]}>
              <Feather name="shopping-cart" size={50} color={isDarkMode ? '#adb5bd' : '#6c757d'} />
            </View>
            <Text style={[styles.emptyTitle, { color: themeColors.textMain }]}>Votre panier est vide</Text>
            <Text style={[styles.emptySubtitle, { color: themeColors.textSub }]}>
              Découvrez nos articles et commencez vos achats sur Jula !
            </Text>
            
            <TouchableOpacity 
              style={styles.btnRetourAccueil} 
              onPress={() => router.push('/(client)/(tabs)/home')}
            >
              <Text style={styles.btnRetourTxt}>Continuer mes achats</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={{ textAlign: 'center', marginTop: 20, color: themeColors.textMain }}>
              Articles présents dans le panier
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  btnRetourAccueil: {
    backgroundColor: '#f57c00',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnRetourTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
