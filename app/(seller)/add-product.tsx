import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/config/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AddProductScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Informatique');
  const [loading, setLoading] = useState(false);
  const [myId, setMyId] = useState('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission requise", "Jula a besoin d'accès à votre téléphone pour ajouter les photos des articles.");
      }
    })();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setMyId(user.id);
      } else {
        Alert.alert("Erreur", "Veuillez vous reconnecter.");
        router.push('/(auth)/login');
      }
    });
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets.uri);
    }
  };

  const handlePublish = async () => {
    if (!title || !price || !description) {
      return Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('products').insert([
        {
          title: title,
          price_fcfa: parseInt(price),
          description: description,
          category: category,
          seller_id: myId,
          image_url: image || 'https://unsplash.com'
        }
      ]);

      if (error) throw error;

      Alert.alert("Succès 🎉", "Votre produit a été publié avec succès sur Jula !");
      setTitle('');
      setPrice('');
      setDescription('');
      setImage(null);
      router.push('/(client)/(tabs)/home');
    } catch (err: any) {
      Alert.alert("Échec", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Magasin Jula</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.formTitle}>📢 Ajouter un article au rayon</Text>

          <TouchableOpacity style={styles.imageSelector} onPress={pickImage}>
            {image ? (
              <Text style={styles.imageSelectorText}>✅ Photo sélectionnée avec succès</Text>
            ) : (
              <View style={{alignItems:'center'}}><Ionicons name="camera-outline" size={30} color="#6c757d" /><Text style={styles.imageSelectorText}>Ajouter la photo du produit</Text></View>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Nom de l'article :</Text>
          <TextInput style={styles.input} placeholder="Ex: Ordinateur HP ProBook, iPhone 13..." value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Prix de vente (FCFA) :</Text>
          <TextInput style={styles.input} placeholder="Ex: 250000" keyboardType="numeric" value={price} onChangeText={setPrice} />

          <Text style={styles.label}>Sélectionner la Catégorie :</Text>
          <View style={styles.categoryRow}>
            {['Informatique', 'Téléphonie', 'Véhicules', 'Sport'].map((cat) => (
              <TouchableOpacity key={cat} style={[styles.catBadge, category === cat && styles.catBadgeActive]} onPress={() => setCategory(cat)}>
                <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Description & Point Relais de récupération :</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Ex: Disponible au Point Relais. Livraison sécurisée sous 3 jours." value={description} onChangeText={setDescription} multiline numberOfLines={4} />

          <TouchableOpacity style={styles.btnPublish} onPress={handlePublish} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnPublishText}>Propulser sur Jula</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  header: { backgroundColor: '#1072ba', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 4 },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: '#1072ba', marginBottom: 20, textAlign: 'center' },
  imageSelector: { borderWidth: 1, borderColor: '#ced4da', borderStyle: 'dashed', padding: 20, borderRadius: 6, backgroundColor: '#f8f9fa', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  imageSelectorText: { fontSize: 12, color: '#6c757d', fontWeight: '500', marginTop: 4 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#495057', marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ced4da', padding: 12, borderRadius: 6, fontSize: 14, color: '#212529', backgroundColor: '#f8f9fa' },
  textArea: { height: 80, textAlignVertical: 'top' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 },
  catBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ced4da', backgroundColor: '#fff' },
  catBadgeActive: { backgroundColor: '#1072ba', borderColor: '#1072ba' },
  catText: { fontSize: 12, color: '#495057', fontWeight: '500' },
  catTextActive: { color: '#fff', fontWeight: 'bold' },
  btnPublish: { backgroundColor: '#f57c00', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 25 },
  btnPublishText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
