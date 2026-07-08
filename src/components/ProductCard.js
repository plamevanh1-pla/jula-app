import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ProductCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image_url }} style={styles.img} />
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.price}>{item.price.toLocaleString()} FCFA</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#fff', margin: 8, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6' },
  img: { width: '100%', height: 120, borderRadius: 6, resizeMode: 'cover' },
  name: { fontSize: 14, fontWeight: '500', marginTop: 8 },
  price: { fontSize: 14, fontWeight: 'bold', color: '#e65100', marginTop: 4 }
});