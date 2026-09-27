 import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function CartScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerBlock}>
        <Text style={styles.text}>🛒 Onglet Panier Jula Activé !</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerBlock: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold', color: '#212529' }
});