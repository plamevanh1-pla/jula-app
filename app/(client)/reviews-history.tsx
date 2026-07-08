import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/config/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function ReviewsHistoryScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('reviews')
          .select('*, products(title)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data && !error) setReviews(data);
      }
    } catch (err: any) {
      console.log("Erreur avis:", err.message);
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
        <Text style={styles.headerTitle}>Notes et avis rédigés</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#f57c00" style={{ marginTop: 40 }} />
        ) : reviews.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="star-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Vous n'avez pas encore rédigé d'avis.</Text>
          </View>
        ) : (
          reviews.map((item) => (
            <View key={item.id} style={styles.reviewCard}>
              <Text style={styles.productTitle}>{item.products?.title || 'Article Jula'}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star} 
                    name={star <= item.rating ? "star" : "star-outline"} 
                    size={16} 
                    color="#f57c00" 
                  />
                ))}
              </View>
              <Text style={styles.commentTxt}>{item.comment_text}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: { backgroundColor: '#f57c00', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#7f8c8d', fontSize: 14, marginTop: 10 },
  reviewCard: { backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef', marginBottom: 12 },
  productTitle: { fontSize: 14, fontWeight: 'bold', color: '#212529' },
  starsRow: { flexDirection: 'row', gap: 2, marginVertical: 6 },
  commentTxt: { fontSize: 13, color: '#495057' }
});
