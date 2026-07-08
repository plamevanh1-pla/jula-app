import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function RegisterDriverScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cniNumber, setCniNumber] = useState('');
  const [motoPlate, setMotoPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegisterDriver = async () => {
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanCni = cniNumber.trim();
    const cleanPlate = motoPlate.trim();

    if (!cleanName || !cleanPhone || !cleanCni || !cleanPlate) {
      Alert.alert("Champs requis", "Veuillez remplir toutes vos informations professionnelles pour postuler.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Aucun utilisateur détecté.");

      // Enregistrement des documents officiels sur le profil Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          cni_number: cleanCni,
          moto_plate: cleanPlate,
          phone: cleanPhone,
          role: 'livreur' // Passage automatique au rôle livreur pour vos tests fluides
        })
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert(
        "Candidature Reçue ! 🏍️",
        "Votre dossier de livreur (CNI et immatriculation moto) a été transmis avec succès. Votre espace de courses est maintenant actif.",
        [{ text: "Ouvrir mon Tableau de bord", onPress: () => router.replace('/(delivery)/dashboard') }]
      );

    } catch (err: any) {
      Alert.alert("Erreur d'envoi", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.title}>Postuler comme Livreur Jula 🛵</Text>
          <Text style={styles.subtitle}>Rejoignez la flotte Jula Logistics (Modèle Glovo) pour livrer en Afrique de l'Ouest</Text>

          <Text style={styles.label}>Nom et Prénom du coursier :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Kouassi Koffi Jean"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Numéro WhatsApp actif :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: +225 05..."
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Numéro de la Carte Nationale d'Identité (CNI) :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: C0102..."
            value={cniNumber}
            onChangeText={setCniNumber}
          />

          <Text style={styles.label}>Numéro d'immatriculation de la moto :</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: D-2354-CI"
            value={motoPlate}
            onChangeText={setMotoPlate}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegisterDriver} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Traitement..." : "Valider ma candidature Livreur"}</Text>
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