import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';

/**
 * Custom Hook pour écouter les mises à jour des commandes en temps réel.
 * @param {string} userId - L'identifiant de l'utilisateur connecté (client ou vendeur)
 * @param {string} userRole - Le rôle de l'utilisateur ('client' ou 'seller')
 * @returns {Array} orders - La liste des commandes mise à jour en direct
 */
export const useOrdersRealtime = (userId, userRole) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // 1. Chargement initial des commandes existantes
    const fetchInitialOrders = async () => {
      try {
        let query = supabase.from('orders').select('*');

        // Filtrage de la requête selon le rôle de l'utilisateur
        if (userRole === 'seller') {
          // Si c'est un vendeur, on pourrait lier via une table intermédiaire ou charger ses commandes
          // Pour cet exemple de base, on charge globalement ou filtre selon votre logique de base
          query = query.order('created_at', { ascending: false });
        } else {
          // Si c'est un client, on ne récupère que ses propres commandes
          query = query.eq('user_id', userId).order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Erreur chargement initial des commandes Jula:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialOrders();

    // 2. Configuration du canal d'écoute en temps réel (Supabase Realtime)
    const ordersChannel = supabase
      .channel('custom-orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Changement détecté en direct sur les commandes Jula:', payload);

          // Cas A : Nouvelle commande insérée
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new;
            // Si c'est un client, on vérifie que la commande lui appartient
            if (userRole === 'client' && newOrder.user_id !== userId) return;

            setOrders((prevOrders) => [newOrder, ...prevOrders]);
          }

          // Cas B : Commande modifiée (ex: mise à jour du statut par un livreur ou vendeur)
          if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new;

            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === updatedOrder.id ? updatedOrder : order
              )
            );
          }

          // Cas C : Commande supprimée du système
          if (payload.eventType === 'DELETE') {
            const deletedOrderId = payload.old.id;
            setOrders((prevOrders) =>
              prevOrders.filter((order) => order.id !== deletedOrderId)
            );
          }
        }
      )
      .subscribe();

    // 3. Nettoyage de la connexion websocket lorsque l'écran se ferme
    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [userId, userRole]);

  return { orders, loading };
};