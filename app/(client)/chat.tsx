import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: number;
  sender: 'user' | 'jula';
  text: string;
  time: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'jula', text: 'Bienvenue sur la messagerie Jula ! Comment pouvons-nous vous aider aujourd\'hui ?', time: '12:00' }
  ]);
  const [inputText, setInputText] = useState('');

  const envoyerMessage = () => {
    if (!inputText.trim()) return;
    
    const nouveauMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, nouveauMessage]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Boîte de réception Jula</Text>
      </View>

      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.julaBubble]}>
            <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : styles.julaText]}>
              {msg.text}
            </Text>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Barre d'envoi de message en bas de l'écran */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrivez votre message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={envoyerMessage}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { marginRight: 15 },
  backArrow: { fontSize: 22, color: '#333', fontWeight: 'bold' },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  chatContainer: { flex: 1, padding: 15 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 1, elevation: 1 },
  userBubble: { backgroundColor: '#f57c00', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  julaBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#e0e0e0' },
  messageText: { fontSize: 13, lineHeight: 18 },
  userText: { color: '#fff' },
  julaText: { color: '#333' },
  messageTime: { fontSize: 9, color: '#aaa', textAlign: 'right', marginTop: 4 },
  inputContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  input: { flex: 1, backgroundColor: '#f0f2f5', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, fontSize: 13, marginRight: 10 },
  sendButton: { backgroundColor: '#f57c00', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 }
});