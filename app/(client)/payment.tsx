import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🆕 Liaison mondiale sécurisée avec votre serveur Render (sans ajouter :5000 ni /api à la fin)
  const SERVER_URL = 'https://jula-backend-production.onrender.com'; 

  const handleMobileMoneyPayment = async (method: string) => {
    setLoading(true);
    console.log(`Tentative de paiement via ${method}...`);

    try {
      // Connexion internet globale sur l'URL publique de production de Render
      const response = await fetch(`${SERVER_URL}/api/payments/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: Math.floor(Math.random() * 100000),
          amount: 15000,
          phoneNumber: "+22507000000" // Remplacé dynamiquement en production
        })
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          "Paiement Validé !",
          `Félicitations ! Votre règlement via ${method} a été confirmé en arrière-plan par le serveur Jula.`,
          [{ text: "Super", onPress: () => router.replace('/(client)/(tabs)/home') }]
        );
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      Alert.alert(
        "Erreur de paiement", 
        "La communication avec le serveur de paiement en ligne a échoué.\n\nVeuillez vérifier votre connexion Internet (Données mobiles / Wi-Fi) et réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sélectionnez votre moyen de paiement</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#f57c00" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.btnGrid}>
            <TouchableOpacity style={[styles.payBtn, { backgroundColor: '#1072ba' }]} onPress={() => handleMobileMoneyPayment('Wave')}>
              <Text style={styles.payText}>🌊 Payer avec Wave</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.payBtn, { backgroundColor: '#ff6600' }]} onPress={() => handleMobileMoneyPayment('Orange Money')}>
              <Text style={styles.payText}>🍊 Payer avec Orange Money</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center' },
  content: { padding: 24 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#212529', marginBottom: 32, textAlign: 'center' },
  btnGrid: { gap: 16 },
  payBtn: { padding: 18, borderRadius: 8, alignItems: 'center' },
  payText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});