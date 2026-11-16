 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [activeChannel, setActiveChannel] = useState<'support' | 'logistique' | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Animation de respiration fluide pour l'avatar du conseiller humain
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: isTyping ? 1.15 : 1.06,
          duration: isTyping ? 400 : 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: isTyping ? 400 : 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [isTyping]);

  const [messagesByChannel, setMessagesByChannel] = useState<{
    support: Message[];
    logistique: Message[];
  }>({
    support: [
      {
        id: '1',
        text: 'Bonjour ! Je suis Kévin, votre Conseiller Support Jula 👨🏾‍💼. Comment puis-je vous aider avec votre compte, votre portefeuille FCFA ou votre inscription ?',
        sender: 'bot',
        time: 'En ligne',
      },
    ],
    logistique: [
      {
        id: '1',
        text: 'Bienvenue sur la Logistique Jula 🚚 (7 pays UEMOA : CI, SN, ML, BF, NE, BJ, TG). Je suis Moussa, votre coordinateur. Indiquez le numéro de votre commande ou votre ville.',
        sender: 'bot',
        time: 'En ligne',
      },
    ],
  });

  // Cerveau de réponse intelligente Jula
  const genererReponseIA = (question: string, canal: 'support' | 'logistique'): string => {
    const q = question.toLowerCase();

    if (canal === 'logistique') {
      if (q.includes('prix') || q.includes('tarif') || q.includes('combien')) {
        return 'Les frais de livraison Jula Express varient selon le poids et le trajet entre nos hubs (Abidjan, Dakar, Bamako, Ouagadougou, Niamey, Cotonou, Lomé). Le montant exact s’affiche avant le paiement.';
      }
      if (q.includes('temps') || q.includes('jour') || q.includes('délai') || q.includes('quand')) {
        return 'Délais moyens : 24h en ville (Abidjan/Bouaké) et 48h à 72h pour les expéditions inter-états dans la zone UEMOA.';
      }
      if (q.includes('colis') || q.includes('commande') || q.includes('suivi') || q.includes('#')) {
        return 'Votre demande de suivi est bien enregistrée. Vous pouvez aussi consulter le statut en direct dans l’onglet « Mes Commandes » de votre profil.';
      }
      return 'Bien reçu ! Un agent logistique Jula vérifie l’itinéraire de votre colis sur le réseau UEMOA. Précisez votre ville de départ et d’arrivée si nécessaire.';
    } else {
      if (q.includes('paiement') || q.includes('payer') || q.includes('wave') || q.includes('orange') || q.includes('fcfa')) {
        return 'Jula accepte le paiement en espèces à la livraison (Cash) ainsi que les transferts Wave au numéro officiel (+2250706073717) dans les 7 pays UEMOA.';
      }
      if (q.includes('vendeur') || q.includes('grossiste') || q.includes('boutique') || q.includes('vendre')) {
        return 'Pour vendre sur Jula, ouvrez notre portail web officiel et téléchargez vos pièces d’identité (CNI/Passeport) pour la validation de votre magasin.';
      }
      if (q.includes('mot de passe') || q.includes('compte') || q.includes('connexion')) {
        return 'Pour sécuriser ou modifier vos accès, rendez-vous dans l’onglet « Compte » puis « Sécurité ».';
      }
      return 'Merci pour votre message ! J’ai bien noté votre demande. Un conseiller humain prendra le relais si une vérification manuelle est requise.';
    }
  };

  const handleBack = () => {
    if (activeChannel !== null) {
      setActiveChannel(null);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(client)/(tabs)/account');
    }
  };

  const handleSend = () => {
    if (inputText.trim() === '' || !activeChannel) return;

    const texteUtilisateur = inputText.trim();
    const canalActuel = activeChannel;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: texteUtilisateur,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesByChannel((prev) => ({
      ...prev,
      [canalActuel]: [...prev[canalActuel], newMsg],
    }));
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reponse = genererReponseIA(texteUtilisateur, canalActuel);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: reponse,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessagesByChannel((prev) => ({
        ...prev,
        [canalActuel]: [...prev[canalActuel], botMsg],
      }));
      setIsTyping(false);
    }, 1200);
  };

  const currentMessages = activeChannel ? messagesByChannel[activeChannel] : [];

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f4f6f9',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    bgInput: isDarkMode ? '#2d3139' : '#f1f3f5',
    bgCircle: isDarkMode ? '#1a1d21' : '#e9ecef',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* En-tête dynamique avec Avatar Conseiller Animé */}
      <View style={[styles.header, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>

        {activeChannel && (
          <Animated.View
            style={[
              styles.animatedAvatarHeader,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: activeChannel === 'support' ? '#e3f2fd' : '#e8f5e9',
              },
            ]}
          >
            <Text style={{ fontSize: 22 }}>{activeChannel === 'support' ? '👨🏾‍💼' : '🚚'}</Text>
            <View style={styles.onlineDot} />
          </Animated.View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: themeColors.textMain }]}>
            {activeChannel === 'support'
              ? 'Kévin • Support Jula'
              : activeChannel === 'logistique'
              ? 'Moussa • Logistique Jula'
              : 'Boîte de réception'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {activeChannel
              ? isTyping
                ? 'En train d’écrire...'
                : 'Conseiller IA en ligne • Relais humain actif'
              : 'Messagerie Interconnectée Jula'}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {activeChannel === null ? (
          /* VUE 1 : LISTE DES SALONS DE DISCUSSION */
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.channelsBlock, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
              <Text style={styles.channelLabel}>💬 Conseillers d'assistance Jula</Text>

              <TouchableOpacity
                style={[styles.channelItem, { borderColor: themeColors.border }]}
                onPress={() => setActiveChannel('support')}
              >
                <Animated.View
                  style={[
                    styles.iconBox,
                    {
                      transform: [{ scale: pulseAnim }],
                      backgroundColor: isDarkMode ? 'rgba(33, 150, 243, 0.2)' : '#e3f2fd',
                    },
                  ]}
                >
                  <Text style={styles.channelIcon}>👨🏾‍💼</Text>
                  <View style={styles.onlineDotSmall} />
                </Animated.View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.channelName, { color: themeColors.textMain }]}>Kévin • Support Jula (IA)</Text>
                  <Text style={styles.channelDesc}>Aide instantanée sur ton compte et tes paiements</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#adb5bd" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.channelItem, { borderBottomWidth: 0 }]}
                onPress={() => setActiveChannel('logistique')}
              >
                <Animated.View
                  style={[
                    styles.iconBox,
                    {
                      transform: [{ scale: pulseAnim }],
                      backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : '#e8f5e9',
                    },
                  ]}
                >
                  <Text style={styles.channelIcon}>🚚</Text>
                  <View style={styles.onlineDotSmall} />
                </Animated.View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.channelName, { color: themeColors.textMain }]}>Moussa • Logistique Jula (IA)</Text>
                  <Text style={styles.channelDesc}>Suivi d'expédition entre les 7 pays UEMOA</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#adb5bd" />
              </TouchableOpacity>
            </View>

            <View style={styles.emptyContainer}>
              <View style={[styles.iconCircle, { backgroundColor: themeColors.bgCircle }]}>
                <Feather name="mail" size={40} color={isDarkMode ? '#adb5bd' : '#6c757d'} />
              </View>
              <Text style={[styles.emptyTitle, { color: themeColors.textMain }]}>Aucun message privé</Text>
              <Text style={[styles.emptySubtitle, { color: themeColors.textSub }]}>
                Tes échanges en temps réel avec les grossistes d'Adjamé, Sandaga, Dantokpa, Assigamé, Bamako, Ouagadougou et Niamey s'afficheront ici.
              </Text>
            </View>
          </ScrollView>
        ) : (
          /* VUE 2 : INTÉRIEUR DU SALON SÉLECTIONNÉ */
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatArea}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {currentMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[styles.msgRow, isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}
                >
                  {!isUser && (
                    <View
                      style={[
                        styles.miniBotAvatar,
                        { backgroundColor: activeChannel === 'support' ? '#e3f2fd' : '#e8f5e9' },
                      ]}
                    >
                      <Text style={{ fontSize: 16 }}>{activeChannel === 'support' ? '👨🏾‍💼' : '🚚'}</Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.messageBubble,
                      isUser
                        ? styles.userBubble
                        : [styles.botBubble, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }],
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isUser ? styles.userText : { color: themeColors.textMain },
                      ]}
                    >
                      {msg.text}
                    </Text>
                    <Text
                      style={[
                        styles.timeText,
                        isUser ? { color: '#ffe0b2' } : { color: '#868e96' },
                      ]}
                    >
                      {msg.time}
                    </Text>
                  </View>
                </View>
              );
            })}

            {isTyping && (
              <View style={styles.msgRow}>
                <Animated.View
                  style={[
                    styles.miniBotAvatar,
                    {
                      transform: [{ scale: pulseAnim }],
                      backgroundColor: activeChannel === 'support' ? '#e3f2fd' : '#e8f5e9',
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>{activeChannel === 'support' ? '👨🏾‍💼' : '🚚'}</Text>
                </Animated.View>
                <View style={[styles.typingBubble, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
                  <Text style={styles.typingText}>
                    {activeChannel === 'support' ? 'Kévin écrit...' : 'Moussa écrit...'}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* Barre de saisie affichée uniquement à l'intérieur d'un salon */}
        {activeChannel !== null && (
          <View style={[styles.inputContainer, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.bgInput, color: themeColors.textMain }]}
              placeholder="Écrire un message dans le salon..."
              placeholderTextColor="#7f8c8d"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Feather name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, paddingTop: 40, gap: 12 },
  backBtn: { padding: 4 },
  animatedAvatarHeader: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  onlineDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#2e7d32', position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: '#fff' },
  onlineDotSmall: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2e7d32', position: 'absolute', bottom: 0, right: 0, borderWidth: 1.5, borderColor: '#fff' },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 11, color: '#f57c00', fontWeight: '600', marginTop: 1 },
  scrollContent: { flexGrow: 1, padding: 16 },
  channelsBlock: { borderRadius: 10, padding: 14, marginBottom: 20, borderWidth: 1 },
  channelLabel: { fontSize: 12, fontWeight: 'bold', color: '#7f8c8d', marginBottom: 12, textTransform: 'uppercase' },
channelItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', position: 'relative' },
channelIcon: { fontSize: 20 },
channelName: { fontSize: 14, fontWeight: 'bold' },
channelDesc: { fontSize: 11, color: '#7f8c8d', marginTop: 2 },
emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 30, paddingHorizontal: 16 },
iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
emptyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
emptySubtitle: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
chatArea: { flexGrow: 1, padding: 16, gap: 12 },
msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
miniBotAvatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
messageBubble: { maxWidth: '76%', padding: 12, borderRadius: 14 },
userBubble: { backgroundColor: '#f57c00', borderBottomRightRadius: 2 },
botBubble: { borderWidth: 1, borderBottomLeftRadius: 2 },
messageText: { fontSize: 14, lineHeight: 20 },
userText: { color: '#fff' },
timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
typingBubble: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, borderWidth: 1, borderBottomLeftRadius: 2 },
typingText: { fontSize: 12, color: '#f57c00', fontStyle: 'italic' },
inputContainer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, alignItems: 'center', gap: 10 },
input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, height: 42, fontSize: 14 },
sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#f57c00', justifyContent: 'center', alignItems: 'center' }
});