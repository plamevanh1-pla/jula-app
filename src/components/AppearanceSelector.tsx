import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AppearanceSelector() {
  const { themeMode, setThemeMode, isDarkMode } = useTheme();

  const options: { id: 'light' | 'dark' | 'system'; label: string; icon: string }[] = [
    { id: 'light', label: 'Mode Clair', icon: 'sun' },
    { id: 'dark', label: 'Mode Sombre', icon: 'moon' },
    { id: 'system', label: 'Par Défaut', icon: 'sliders' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#e2e8f0' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#111417' }]}>
        🎨 Apparence de l'application
      </Text>
      <Text style={styles.subtitle}>Personnalisez votre confort visuel sur Jula</Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 15 }}>
        {options.map((opt) => {
          const isActive = themeMode === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setThemeMode(opt.id)}
              style={[
                styles.optionBtn,
                {
                  backgroundColor: isDarkMode ? '#111417' : '#f8f9fa',
                  borderColor: isActive ? '#f57c00' : (isDarkMode ? '#2d3139' : '#e2e8f0'),
                  borderWidth: isActive ? 2 : 1
                }
              ]}
            >
              <View style={styles.row}>
                <Feather name={opt.icon as any} size={18} color={isActive ? '#f57c00' : '#7f8c8d'} />
                <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#111417', fontWeight: isActive ? '700' : '500' }]}>
                  {opt.label}
                </Text>
              </View>
              {isActive && <Feather name="check-circle" size={18} color="#f57c00" />}
            </TouchableOpacity>
          );
        })}
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, borderRadius: 12, borderWidth: 1, marginVertical: 15 },
  title: { fontSize: 15, fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#7f8c8d', marginTop: 2 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { fontSize: 13.5 }
});
