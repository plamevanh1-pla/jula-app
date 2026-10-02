 import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
 // 🟢 IMPORTATION DE LA BIBLIOTHÈQUE MODERNE FEATHER
 import Feather from '@expo/vector-icons/Feather';
 
 export default function CartScreen() {
   const router = useRouter();
   const [cartItems, setCartItems] = useState([]); // Tableau vide pour le mode test initial
   const [loading, setLoading] = useState(false);
 
   if (loading) {
     return (
       <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }]}>
         <ActivityIndicator size="large" color="#f57c00" />
       </SafeAreaView>
     );
   }
 
   return (
     <SafeAreaView style={styles.container}>
       {/* En-tête personnalisé style Jula */}
       <View style={styles.header}>
         <Text style={styles.headerTitle}>Mon Panier</Text>
       </View>
 
       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
         {cartItems.length === 0 ? (
           <View style={styles.emptyContainer}>
             <View style={styles.iconCircle}>
               <Feather name="shopping-cart" size={50} color="#6c757d" />
             </View>
             <Text style={styles.emptyTitle}>Votre panier est vide</Text>
             <Text style={styles.emptySubtitle}>Découvrez nos articles et commencez vos achats sur Jula !</Text>
             
             <TouchableOpacity style={styles.btnRetourAccueil} onPress={() => router.push('/home')}>
               <Text style={styles.btnRetourTxt}>Continuer mes achats</Text>
             </TouchableOpacity>
           </View>
         ) : (
           <View>
             {/* La logique d'affichage de vos articles viendra ici plus tard */}
             <Text style={{ textAlign: 'center', marginTop: 20 }}>Articles présents dans le panier</Text>
           </View>
         )}
       </ScrollView>
     </SafeAreaView>
   );
 }
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#f2f2f2',
   },
   header: {
     backgroundColor: '#fff',
     paddingHorizontal: 16,
     paddingVertical: 16,
     borderBottomWidth: 1,
     borderColor: '#dee2e6',
     alignItems: 'center',
     justifyContent: 'center',
     paddingTop: 40,
   },
   headerTitle: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#212529',
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
     backgroundColor: '#e9ecef',
     alignItems: 'center',
     justifyContent: 'center',
     marginBottom: 20,
   },
   emptyTitle: {
     fontSize: 20,
     fontWeight: 'bold',
     color: '#212529',
     marginBottom: 8,
   },
   emptySubtitle: {
     fontSize: 14,
     color: '#6c757d',
     textAlign: 'center',
     marginBottom: 24,
     lineHeight: 20,
   },
   btnRetourAccueil: {
     backgroundColor: '#f57c00', // Ton orange Jula
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