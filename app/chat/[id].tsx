import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../src/config/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function PrivateChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [myId, setMyId] = useState('');
  const SERVER_URL = 'https://jula-backend-production.onrender.com';

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setMyId(user.id);
        fetchPrivateMessages();
      }
    });

    const subscription = supabase.channel(`room:${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        if (payload.new.room_id === id) setMessages(prev => [...prev, payload.new]);
      }).subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, [id]);

  const fetchPrivateMessages = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/messages/${id}`);
      const data = await response.json();
      if (data) setMessages(data);
    } catch {
      const { data } = await supabase.from('messages').select('*').eq('room_id', id).order('created_at', { ascending: true });
      if (data) setMessages(data);
    }
  };

  const sendPrivateMessage = async () => {
    if (!text.trim()) return;
    const messageData = { message_text: text, room_id: id, sender_id: myId };
    try {
      await fetch(`${SERVER_URL}/api/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(messageData) });
    } catch {
      await supabase.from('messages').insert([messageData]);
    }
    setText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/profile')}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
          <Text style={styles.headerTitle}>💬 Salon Jula N° {id?.toString().substring(0, 8)}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {messages.map((msg, i) => (
            <View key={i} style={[styles.msg, msg.sender_id === myId ? { alignSelf: 'flex-end', backgroundColor: '#f57c00' } : { alignSelf: 'flex-start', backgroundColor: '#fff' }]}><Text style={{ color: msg.sender_id === myId ? '#fff' : '#000' }}>{msg.message_text}</Text></View>
          ))}
        </ScrollView>
        <View style={styles.inputArea}>
          <TextInput style={styles.input} placeholder="Votre message..." value={text} onChangeText={setText} />
          <TouchableOpacity style={styles.send} onPress={sendPrivateMessage}><Ionicons name="send" size={18} color="#fff" /></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  header: { backgroundColor: '#f57c00', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  msg: { padding: 12, borderRadius: 10, marginBottom: 8, maxWidth: '80%' },
  inputArea: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', gap: 10, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ced4da', padding: 10, borderRadius: 20 },
  send: { backgroundColor: '#f57c00', padding: 12, borderRadius: 50 }
});
