import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';
import { useTheme } from '../../src/context/ThemeContext';

export default function PrivateChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome-1',
      sender_id: 'jula-support-ai',
      sender_name: 'Conseiller Support Jula',
      message_text: 'Bonjour ! Bienvenue sur le support en direct Jula Express (Zone UEMOA). Comment puis-je vous aider pour votre commande ou votre livraison ?',
    },
  ]);
  const [text, setText] = useState('');
  const [myId, setMyId] = useState('client-guest');
  const [isTyping, setIsTyping] = useState(false);

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f4f4f6',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    bgInput: isDarkMode ? '#111417' : '#f8f9fa',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setMyId(user.id);
        fetchPrivateMessages();
      }
    });

    const subscription = supabase
      .channel(`room:${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.room_id === id && payload.new.sender_id !== myId) {
          setMessages((prev) => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id]);

  const fetchPrivateMessages = async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', id)
        .order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setMessages(data);
      }
    } catch (e) {
      console.log('Mode discussion locale actif');
    }
  };

  // Réponse intelligente automatique de l'Assistant IA Support
  const genererReponseSupportIA = (question: string) => {
    const q = question.toLowerCase();
    if (q.includes('wave') || q.includes('payer') || q.includes('paiement') || q.includes('argent')) {
      return 'Vous pouvez régler vos achats soit en espèces à la livraison (Cash), soit par transfert Wave au numéro officiel Jula (+2250706073717).';
    }
    if (q.includes('livraison') || q.includes('colis') || q.includes('retard') || q.includes('livreur')) {
      return 'Nos livreurs Jula opèrent dans les 7 pays de la zone UEMOA. Dès qu’une commande est validée, un coursier vous contacte par téléphone avant son arrivée.';
    }
    if (q.includes('vendeur') || q.includes('grossiste') || q.includes('boutique')) {
      return 'Pour ouvrir une boutique grossiste sur Jula, rendez-vous sur notre portail web officiel et remplissez le formulaire avec votre pièce d’identité.';
    }
    return 'Votre message a bien été transmis au service logistique Jula. Un conseiller humain prendra le relais si nécessaire. Avez-vous un numéro de commande à me communiquer ?';
  };

  const sendPrivateMessage = async () => {
    if (!text.trim()) return;
    const texteEnvoye = text.trim();
    const messageData = {
      id: Date.now().toString(),
      message_text: texteEnvoye,
      room_id: id || 'support',
      sender_id: myId,
    };

    // Affichage immédiat du message du client
    setMessages((prev) => [...prev, messageData]);
    setText('');
    setIsTyping(true);

    // Enregistrement en arrière-plan dans Supabase pour qu'un agent humain puisse le voir aussi
    try {
      await supabase.from('messages').insert([
        { message_text: texteEnvoye, room_id: id || 'support', sender_id: myId },
      ]);
    } catch (e) {}

    // Réponse automatique de l'assistant IA après 1 seconde
    setTimeout(() => {
      const reponseIA = {
        id: (Date.now() + 1).toString(),
        sender_id: 'jula-support-ai',
        sender_name: 'Conseiller Support Jula',
        message_text: genererReponseSupportIA(texteEnvoye),
      };
      setMessages((prev) => [...prev, reponseIA]);
      setIsTyping(false);
    }, 1000);
  };

  // Retour sécurisé sans jamais ouvrir un écran noir
  const handleSafeBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(client)/(tabs)/account');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* EN-TÊTE AVEC AVATAR CONSEILLER HUMAIN */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSafeBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.agentAvatar}>
            <Text style={{ fontSize: 20 }}>👨🏾‍💼</Text>
            <View style={styles.onlineDot} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Support & Logistique Jula</Text>
            <Text style={styles.headerSub}>Conseiller IA en ligne • Relais humain actif</Text>
          </View>
        </View>

        {/* LISTE DES MESSAGES */}
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, i) => {
            const isMe = msg.sender_id === myId;
            return (
              <View key={msg.id || i} style={[styles.msgRow, isMe ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                {!isMe && (
                  <View style={[styles.miniAvatar, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
                    <Text style={{ fontSize: 16 }}>👨🏾‍💼</Text>
                  </View>
                )}

                <View
                  style={[
                    styles.msg,
                    isMe
                      ? { backgroundColor: '#f57c00', borderBottomRightRadius: 2 }
                      : { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, borderWidth: 1, borderBottomLeftRadius: 2 },
                  ]}
                >
                  {!isMe && (
                    <Text style={styles.senderLabel}>Conseiller Jula</Text>
                  )}
                  <Text style={{ color: isMe ? '#fff' : themeColors.textMain, fontSize: 14, lineHeight: 20 }}>
                    {msg.message_text}
                  </Text>
                </View>
              </View>
            );
          })}

          {isTyping && (
            <View style={styles.typingRow}>
              <Text style={{ fontSize: 14 }}>👨🏾‍💼</Text>
              <Text style={[styles.typingText, { color: themeColors.textSub }]}>Le conseiller Jula écrit...</Text>
            </View>
          )}
        </ScrollView>

        {/* ZONE DE SAISIE */}
        <View style={[styles.inputArea, { backgroundColor: themeColors.bgCard, borderTopColor: themeColors.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.bgInput, borderColor: themeColors.border, color: themeColors.textMain }]}
            placeholder="Écrivez votre message..."
            placeholderTextColor="#7f8c8d"
            value={text}
            onChangeText={setText}
            onSubmitEditing={sendPrivateMessage}
          />
          <TouchableOpacity style={styles.send} onPress={sendPrivateMessage}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: '#f57c00', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 40 },
  backBtn: { padding: 4 },
  agentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2e7d32', position: 'absolute', bottom: 0, right: 0, borderWidth: 1.5, borderColor: '#fff' },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  headerSub: { color: '#fff3e0', fontSize: 11, marginTop: 1 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, gap: 8 },
  miniAvatar: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  msg: { padding: 12, borderRadius: 14, maxWidth: '78%' },
  senderLabel: { fontSize: 10, fontWeight: 'bold', color: '#f57c00', marginBottom: 3 },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 38, marginTop: 4 },
  typingText: { fontSize: 12, fontStyle: 'italic' },
  inputArea: { flexDirection: 'row', padding: 12, borderTopWidth: 1, gap: 10, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 22, fontSize: 14 },
  send: { backgroundColor: '#f57c00', padding: 12, borderRadius: 50 }
});
