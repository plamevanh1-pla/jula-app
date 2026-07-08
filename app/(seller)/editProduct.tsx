import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

const CATEGORIES = ['Électronique', 'Mode', 'Supermarché', 'Beauté', 'Maison'];

export default function EditProductScreen() {
  const { id } = useLocalSearchParams(); // Récupère l'ID du produit à modifier
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setName(data.name);
        setPrice(data.price.toString());
        setCategory(data.category);
        setImageUrl(data.image_url);
        setDescription(data.description || '');
      }
    } catch (error: any) {
      Alert.alert("Erreur", "Impossible de charger les détails du produit.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!name || !price || !imageUrl) {
      Alert.alert("Erreur", "Veuillez renseigner le nom, le prix et l'image du produit.");
      return;
    }

    setUpdating(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name,
          price: parseFloat(price),
          category,
          image_url: imageUrl,
          description,
        })
        .eq('id', id);

      if (error) throw error;

      Alert.alert("Succès", "Le produit a été mis à jour avec succès !");
      router.replace('/(seller)/products');
    } catch (error: any) {
      Alert.alert("Erreur de modification", error.message || "Une erreur est survenue.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier l'article</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Nom du produit</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: iPhone 13 Pro Max"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Prix (FCFA)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 450000"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBadge, category === cat && styles.categoryBadgeActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>URL de l'image du produit</Text>
        <TextInput
          style={styles.input}
          placeholder="https://exemple.com"
          value={imageUrl}
          onChangeText={setImageUrl}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Description de l'article</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Décrivez les caractéristiques du produit..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdateProduct} disabled={updating}>
          {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enregistrer les modifications</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backButton: { padding: 4 },
  backText: { fontSize: 20, color: '#f57c00', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  formContainer: { padding: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 16, fontSize: 16 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dee2e6' },
  categoryBadgeActive: { backgroundColor: '#f57c00', borderColor: '#f57c00' },
  categoryText: { color: '#495057', fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#f57c00', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12, marginBottom: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});