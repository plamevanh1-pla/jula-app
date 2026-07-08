import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function RegisterShopScreen() {
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('Informatique & Électronique');
  const [phone, setPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [rcText, setRcText] = useState(''); // Registre de commerce ou ID National
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateShop = async () => {
    const cleanName = shopName.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = fullAddress.trim();
    const cleanRc = rcText.trim();

    if (!cleanName || !cleanPhone || !cleanAddress || !cleanRc) {
      Alert.alert("Informations requises", "Veuillez remplir toutes les informations pour créer votre Magasin Jula.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Aucun utilisateur connecté.");

      // 1. Mettre à jour le profil de l'utilisateur pour lui donner le rôle de vendeur officiel
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role: 'vendeur'
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Noter la création fictive ou réelle de la boutique pour le test
      Alert.alert(
        "Magasin Enregistré !",
        `Félicitations ! La boutique "${cleanName}" est désormais ouverte sur Jula. Vous pouvez y déposer vos produits informatique.`,
        [{ text: "Accéder à mon Espace", onPress: () => router.replace('/(seller)/dashboard') }]
      );

    } catch (error: any) {
      Alert.alert("Erreur d'enregistrement", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.title}>Ouvrir mon Magasin Jula 🏪</Text>
          <Text style={styles.subtitle}>Enregistrez votre commerce informatique pour vendre dans toute l'Afrique de l'Ouest</Text>

          <Text style={styles.label}>Nom commercial de la boutique :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Jula Informatique SARL"
            value={shopName}
            onChangeText={setShopName}
          />

          <Text style={styles.label}>Catégorie d'activité principale :</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#e9ecef', color: '#6c757d' }]}
            value={category}
            editable={false} // Verrouillé sur l'informatique pour le test
          />

          <Text style={styles.label}>Numéro de téléphone professionnel :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: +225 07..."
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Adresse physique du local (Ville, Quartier, Rue) :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Abidjan, Cocody, Rue des Jardins"
            value={fullAddress}
            onChangeText={setFullAddress}
          />

          <Text style={styles.label}>Numéro de Registre de Commerce ou CNI :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: CI-ABJ-01-..."
            value={rcText}
            onChangeText={setRcText}
          />

          <TouchableOpacity style={styles.button} onPress={handleCreateShop} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Ouverture en cours..." : "Valider et Ouvrir ma Boutique"}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#212529', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6c757d', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', fontSize: 15, color: '#212529' },
  button: { backgroundColor: '#f57c00', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32, elevation: 1 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});